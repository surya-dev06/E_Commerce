import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

type AuthValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};

const AuthCtx = createContext<AuthValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
});

/** One single auth listener for the whole app (was one per component before). */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load(s: Session | null) {
      if (!alive) return;
      setSession(s);
      if (s?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", s.user.id)
          .maybeSingle();
        if (alive) setProfile(data as Profile | null);
      } else if (alive) setProfile(null);
      if (alive) setLoading(false);
    }
    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => {
      // never await supabase calls directly inside this callback
      setTimeout(() => load(s), 0);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, profile, loading }),
    [session, profile, loading],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
