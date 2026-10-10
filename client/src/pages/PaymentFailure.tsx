import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function PaymentFailure() {
  return (
    <div className="center-page failure-page">
      <motion.div
        className="success-box"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <XCircle className="failure-icon" />
        <span className="eyebrow">PAYMENT NOT COMPLETED</span>
        <h1>We couldn't complete that payment.</h1>
        <p>No worries. Your cart is still available so you can try again.</p>
        <div className="button-row">
          <Link className="primary-btn" to="/checkout">
            <RefreshCcw /> Try Again
          </Link>
          <Link className="secondary-btn" to="/cart">
            <ArrowLeft /> Back to Cart
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
