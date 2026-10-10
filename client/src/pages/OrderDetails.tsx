import { PageLoader } from "../components/Loaders";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
export default function OrderDetails() {
  const { id } = useParams();
  const [o, setO] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (id)
      (async () => {
        const a = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();
        setO(a.data);
        const b = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", id);
        setItems(b.data || []);
      })();
  }, [id]);
  if (!o) return <PageLoader label="Loading order..." />;
  return (
    <div className="page">
      <div className="page-hero small">
        <span className="eyebrow">ORDER DETAILS</span>
        <h1>#{o.order_number}</h1>
      </div>
      <motion.div
        className="order-detail-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="order-status-big">
          <span>Status</span>
          <strong>{o.status}</strong>
          <small>{new Date(o.created_at).toLocaleString("en-IN")}</small>
        </div>
        <div className="order-items">
          {items.map((i) => (
            <div key={i.id}>
              <div>
                <b>{i.product_name}</b>
                <span>
                  SKU {i.sku} · Qty {i.quantity}
                </span>
              </div>
              <strong>₹{Number(i.total_price).toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
        <div className="summary-lines">
          <span>
            Subtotal <b>₹{Number(o.subtotal).toLocaleString("en-IN")}</b>
          </span>
          <span>
            Shipping{" "}
            <b>
              {Number(o.shipping_amount)
                ? `₹${Number(o.shipping_amount)}`
                : "FREE"}
            </b>
          </span>
          <span>
            Total <b>₹{Number(o.total_amount).toLocaleString("en-IN")}</b>
          </span>
        </div>
        <Link className="primary-btn" to="/track-order">
          Track this order
        </Link>
      </motion.div>
    </div>
  );
}
