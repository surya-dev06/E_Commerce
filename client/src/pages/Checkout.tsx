import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../App";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!user)
    return (
      <div className="center-page">
        <div className="success-box">
          <h2>Please login before checkout.</h2>
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  const finalAmount = total + (total >= 2500 ? 0 : 99);
  async function pay() {
    setLoading(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired.");
      const order = await api<any>(
        "/payments/create-order",
        {
          method: "POST",
          body: JSON.stringify({
            items: items.map((i) => ({
              product_id: i.product.id,
              quantity: i.quantity,
            })),
            address,
          }),
        },
        session.access_token,
      );
      if (!window.Razorpay)
        throw new Error("Razorpay Checkout script is not loaded.");
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Voltix",
        description: "Electronics order",
        order_id: order.razorpay_order_id,
        prefill: {
          name: address.name,
          email: user?.email ?? "",
          contact: address.phone,
        },
        theme: { color: "#0a67d8" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: any) => {
          try {
            const verified = await api<any>(
              "/payments/verify",
              {
                method: "POST",
                body: JSON.stringify({ ...response, order_id: order.order_id }),
              },
              session.access_token,
            );
            clear();
            navigate(`/order-success?order=${verified.order_number}`);
          } catch (e: any) {
            navigate("/payment-failure");
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (e: any) {
      setError(e.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="page">
      <div className="page-hero small">
        <span className="eyebrow">SECURE CHECKOUT</span>
        <h1>Complete your order</h1>
      </div>
      <div className="checkout-grid">
        <div className="checkout-form">
          <h2>Shipping Address</h2>
          {Object.entries(address).map(
            ([key, value]) =>
              key !== "country" && (
                <input
                  key={key}
                  placeholder={key.replace("_", " ")}
                  value={value}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  required
                />
              ),
          )}
          {error && <p className="error">{error}</p>}
          <button
            className="primary-btn wide"
            onClick={pay}
            disabled={loading || !items.length}
          >
            {loading
              ? "Creating secure payment..."
              : `Pay ₹${finalAmount.toLocaleString("en-IN")}`}
          </button>
        </div>
        <aside className="summary">
          <h2>Order Summary</h2>
          {items.map((i) => (
            <div key={i.product.id}>
              <span>
                {i.product.name} × {i.quantity}
              </span>
              <strong>
                ₹{(i.product.price * i.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
          <hr />
          <div>
            <span>Subtotal</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{total >= 2500 ? "FREE" : "₹99"}</strong>
          </div>
          <hr />
          <div>
            <span>Total</span>
            <strong>₹{finalAmount.toLocaleString("en-IN")}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
