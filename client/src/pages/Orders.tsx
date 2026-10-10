import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { PageLoader } from "../components/Loaders";
export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (user)
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          setOrders(data || []);
          setLoaded(true);
        });
  }, [user]);
  return (
    <div className="page">
      <div className="page-hero small">
        <span className="eyebrow">YOUR PURCHASES</span>
        <h1>Orders</h1>
      </div>
      {!loaded ? (
        <PageLoader label="Loading your orders..." />
      ) : !orders.length ? (
        <div className="empty-box">
          <PackageSearch size={40} />
          <h3>No orders yet</h3>
          <Link className="primary-btn" to="/shop">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders">
          {orders.map((o, i) => (
            <motion.div
              className="order-card"
              key={o.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div>
                <b>#{o.order_number}</b>
                <span>
                  {new Date(o.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              <strong>₹{Number(o.total_amount).toLocaleString("en-IN")}</strong>
              <span className={`status ${o.status}`}>{o.status}</span>
              <Link to={`/orders/${o.id}`}>
                View <ArrowRight size={14} />
              </Link>
            </motion.div>
            
          ))}
        </div>
      )}
    </div>
  );
}
