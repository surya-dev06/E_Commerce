import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../App";

export default function Cart() {
  const { items, update, remove, total } = useCart();
  const navigate = useNavigate();
  return (
    <div className="page">
      <div className="page-hero small">
        <h1>Your Cart</h1>
      </div>
      {!items.length ? (
        <div className="empty-box">
          Your cart is empty. <Link to="/shop">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((i) => (
              <div className="cart-row" key={i.product.id}>
                <img src={i.product.image_url || "/images/laptop.svg"} alt="" />
                <div>
                  <h3>{i.product.name}</h3>
                  <p>₹{i.product.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="qty">
                  <button onClick={() => update(i.product.id, i.quantity - 1)}>
                    <Minus />
                  </button>
                  <b>{i.quantity}</b>
                  <button onClick={() => update(i.product.id, i.quantity + 1)}>
                    <Plus />
                  </button>
                </div>
                <strong>
                  ₹{(i.product.price * i.quantity).toLocaleString("en-IN")}
                </strong>
                <button
                  className="icon-btn"
                  onClick={() => remove(i.product.id)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Order Summary</h2>
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
              <strong>
                ₹{(total + (total >= 2500 ? 0 : 99)).toLocaleString("en-IN")}
              </strong>
            </div>
            <button
              className="primary-btn wide"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
