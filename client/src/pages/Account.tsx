import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package, Heart, UserRound, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { PageLoader, SafeImg } from "../components/Loaders";
import { motion } from "framer-motion";
export default function Account() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const { ids } = useWishlist();
  const [wish, setWish] = useState<any[] | null>(null);
  // re-load the saved products whenever a heart is toggled anywhere
  const idKey = Array.from(ids).sort().join(",");
  useEffect(() => {
    if (user)
      supabase
        .from("wishlists")
        .select("id,product:products(*)")
        .eq("user_id", user.id)
        .then(({ data }) => setWish((data || []).filter((w: any) => w.product)));
  }, [user?.id, idKey]);
  if (!user)
    return (
      <div className="center-page">
        <div className="success-box">
          <h2>Login required</h2>
          <Link className="primary-btn" to="/login">
            Login
          </Link>
        </div>
      </div>
    );
  return (
    <div className="page">
      <div className="page-hero account-hero">
        <span className="avatar avatar-large">
          {(profile?.full_name || user.email || "U")[0].toUpperCase()}
        </span>
        <div>
          <span className="eyebrow">YOUR SPACE</span>
          <h1>{profile?.full_name || "My Account"}</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="account-layout">
        <motion.div
          className="account-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Quick access</h2>
          {[
            [Package, "My Orders", "/orders"],
            [Heart, "Wishlist", null],
            [UserRound, "Profile details", null],
          ].map(([I, t, l]: any) => (
            <button key={t} onClick={() => l && nav(l)}>
              <I />
              <span>{t}</span>
              <ChevronRight />
            </button>
          ))}
          <button
            className="logout"
            onClick={async () => {
              await supabase.auth.signOut();
              nav("/");
            }}
          >
            <LogOut /> Sign out
          </button>
        </motion.div>
        <div className="wishlist-panel">
          <div className="panel-head">
            <h2>Saved products</h2>
            <span>{ids.size}</span>
          </div>
          {wish === null ? (
            <PageLoader label="Loading saved products..." />
          ) : wish.length ? (
            <div className="product-grid">
              {wish.map((w) => (
                <Link className="mini-product" key={w.id} to={`/product/${w.product.slug}`}>
                  <SafeImg src={w.product.image_url} alt={w.product.name} />
                  <b>{w.product.name}</b>
                  <span>
                    ₹{Number(w.product.price).toLocaleString("en-IN")}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-box">Like products to see them here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
