import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, ChevronRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";
import { useCart } from "../App";
import { PageLoader, SafeImg } from "../components/Loaders";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [missing, setMissing] = useState(false);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    setProduct(null);
    setMissing(false);
    setQty(1);
    if (slug)
      supabase
        .from("products")
        .select("*, category:categories(name,slug)")
        .eq("slug", slug)
        .single()
        .then(({ data }) => (data ? setProduct(data as Product) : setMissing(true)));
  }, [slug]);

  if (missing)
    return (
      <div className="center-page">
        <div className="success-box">
          <h2>Product not found</h2>
          <Link className="primary-btn" to="/shop">Back to shop</Link>
        </div>
      </div>
    );
  if (!product) return <PageLoader label="Loading product..." />;

  const out = product.stock <= 0;
  const low = !out && product.stock <= 5;
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

  return (
    <div className="pd-page">
      <nav className="pd-crumbs">
        <Link to="/">Home</Link>
        <ChevronRight />
        <Link to="/shop">Shop</Link>
        {product.category && (
          <>
            <ChevronRight />
            <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <ChevronRight />
        <b>{product.name}</b>
      </nav>

      <div className="pd-grid">
        <div className="pd-media">
          {discount > 0 && <span className="pd-badge">-{discount}%</span>}
          <SafeImg src={product.image_url || ""} alt={product.name} />
        </div>

        <div className="pd-info">
          <span className="pd-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="pd-rating">
            <Star />
            <b>{product.rating}</b> ({product.review_count} reviews)
          </div>
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price.toLocaleString("en-IN")}</span>
            {discount > 0 && (
              <span className="pd-compare">₹{product.compare_at_price!.toLocaleString("en-IN")}</span>
            )}
          </div>
          <p className="pd-desc">{product.description}</p>
          <div className={`pd-stock${out ? " out" : low ? " low" : ""}`}>
            {out ? "Out of stock" : low ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </div>

          <div className="pd-buy">
            <div className="pd-qty">
              <button type="button" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus />
              </button>
              <b>{qty}</b>
              <button
                type="button"
                disabled={out || qty >= product.stock}
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
              >
                <Plus />
              </button>
            </div>
            <button type="button" className="pd-add" disabled={out} onClick={() => add(product, qty)}>
              <ShoppingCart /> Add to Cart
            </button>
          </div>

          <div className="pd-perks">
            <div><b>Free delivery</b>On orders above ₹999</div>
            <div><b>7-day returns</b>Easy replacement</div>
            <div><b>Warranty</b>Brand authorised</div>
          </div>
        </div>
      </div>
    </div>
  );
}