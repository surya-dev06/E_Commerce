import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

type Result = "login" | "added" | "removed" | "error";
type WishlistValue = {
  ids: Set<string>;
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<Result>;
};

const WishCtx = createContext<WishlistValue>({
  ids: new Set(),
  count: 0,
  has: () => false,
  toggle: async () => "login",
});

/**
 * Single source of truth for the wishlist.
 * Header heart number and every product heart read from here, so the
 * count changes instantly (optimistic update) when a heart is clicked.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [ids, setIds] = useState<Set<string>>(new Set());
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const busy = useRef(new Set<string>());

  useEffect(() => {
    let alive = true;
    if (!userId) {
      setIds(new Set());
      return;
    }
    supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (alive) setIds(new Set((data || []).map((r: any) => r.product_id)));
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const toggle = useCallback(
    async (productId: string): Promise<Result> => {
      if (!userId) return "login";
      if (busy.current.has(productId)) return "error";
      busy.current.add(productId);
      const had = idsRef.current.has(productId);
      const apply = (add: boolean) =>
        setIds((prev) => {
          const next = new Set(prev);
          add ? next.add(productId) : next.delete(productId);
          return next;
        });
      apply(!had); // instant UI change
      const res = had
        ? await supabase
            .from("wishlists")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId)
        : await supabase
            .from("wishlists")
            .upsert(
              { user_id: userId, product_id: productId },
              { onConflict: "user_id,product_id" },
            );
      busy.current.delete(productId);
      if (res.error) {
        apply(had); // roll back if the server refused
        return "error";
      }
      return had ? "removed" : "added";
    },
    [userId],
  );

  const value = useMemo(
    () => ({
      ids,
      count: ids.size,
      has: (id: string) => ids.has(id),
      toggle,
    }),
    [ids, toggle],
  );
  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}

export const useWishlist = () => useContext(WishCtx);
