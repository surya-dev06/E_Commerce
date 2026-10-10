import { Heart, Star, ShoppingCart, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Product } from "../types";
import { useCart } from "../App";
import { useWishlist } from "../context/WishlistContext";
import { SafeImg } from "./Loaders";
import { money } from "../lib/format";


export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const nav = useNavigate();
  const [added, setAdded] = useState(false);
  const liked = has(product.id);

  async function onHeart() {
    const r = await toggle(product.id);
    if (r === "login") nav("/login"); // no full page reload any more
  }

  function addItem() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article className="product-card" whileHover={{ y: -6 }} transition={{ duration: .25 }}>
      <div className="product-image">
        <motion.button
          whileTap={{ scale: 1.25 }}
          className={`heart ${liked ? "liked" : ""}`}
          onClick={onHeart}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </motion.button>
        <Link to={`/product/${product.slug}`}>
          <SafeImg src={product.image_url || ""} alt={product.name} />
        </Link>
        <span className="product-badge">
          {product.stock < 5 ? "LOW STOCK" : product.is_trending ? "TRENDING" : "NEW"}
        </span>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.slug}`} className="product-name">{product.name}</Link>
        <div className="rating">
          <Star size={13} fill="currentColor" /> {product.rating.toFixed(1)}
          <span>({product.review_count})</span>
        </div>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {product.compare_at_price && <del>{money(product.compare_at_price)}</del>}
        </div>
        <motion.button className={`add-btn ${added ? "added" : ""}`} onClick={addItem} whileTap={{ scale: .96 }}>
          {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
          <AnimatePresence>
            {added && (
              <motion.i className="add-ripple" initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.8, opacity: 0 }} exit={{ opacity: 0 }} />
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}
