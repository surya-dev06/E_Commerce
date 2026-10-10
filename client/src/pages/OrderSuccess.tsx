import { Link, useSearchParams } from "react-router-dom";
import { Check, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
export default function OrderSuccess() {
  const [p] = useSearchParams();
  return (
    <div className="center-page success-page">
      <motion.div
        className="success-box order-success"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="success-icon">
          <Check />
        </div>
        <span className="eyebrow">PAYMENT SUCCESSFUL</span>
        <h1>Order confirmed!</h1>
        <p>
          Thank you. Your order <strong>#{p.get("order") || "received"}</strong>{" "}
          is now being prepared.
        </p>
        <div className="button-row">
          <Link className="primary-btn" to="/orders">
            View Order <ArrowRight />
          </Link>
          <Link className="secondary-btn" to="/shop">
            <Package /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
