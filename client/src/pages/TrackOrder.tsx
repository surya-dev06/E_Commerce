import { useState } from "react";
import { Search, PackageCheck, Truck, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
export default function TrackOrder() {
  const [no, setNo] = useState(""),
    [order, setOrder] = useState<any>(null),
    [error, setError] = useState("");
  async function find(e: any) {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", no.trim())
      .maybeSingle();
    if (error || !data) setError("Order not found. Check your order number.");
    else setOrder(data);
  }
  const steps = ["pending", "confirmed", "processing", "shipped", "delivered"],
    idx = order ? Math.max(0, steps.indexOf(order.status)) : 0;
  return (
    <div className="page">
      <div className="page-hero small">
        <span className="eyebrow">ORDER SUPPORT</span>
        <h1>Track your order</h1>
      </div>
      <div className="track-box">
        <form onSubmit={find}>
          <input
            value={no}
            onChange={(e) => setNo(e.target.value)}
            placeholder="Enter order number e.g. VX12345678"
          />
          <button className="primary-btn">
            <Search /> Track
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {order && (
          <div className="tracking">
            <div className="tracking-head">
              <div>
                <span>Order</span>
                <h2>#{order.order_number}</h2>
              </div>
              <strong>{order.status}</strong>
            </div>
            <div className="timeline">
              {steps.map((s, i) => (
                <div className={i <= idx ? "done" : ""} key={s}>
                  <span>
                    {i === 0 ? (
                      <PackageCheck />
                    ) : i === 3 ? (
                      <Truck />
                    ) : (
                      <MapPin />
                    )}
                  </span>
                  <b>{s}</b>
                </div>
              ))}
            </div>
            <Link to="/contact">Need help?</Link>
          </div>
        )}
      </div>
    </div>
  );
}
