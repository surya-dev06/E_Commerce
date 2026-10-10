import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  BarChart3,
  Box,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Edit3,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { PageLoader, Spinner } from "../components/Loaders";
const empty = {
  name: "",
  slug: "",
  brand: "Voltix",
  description: "",
  sku: "",
  price: "",
  compare_at_price: "",
  stock: "10",
  image_url: "",
  is_active: true,
  is_trending: true,
  is_featured: false,
};
export default function Admin() {
  const { user, profile, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]),
    [orders, setOrders] = useState<any[]>([]),
    [customers, setCustomers] = useState(0),
    [show, setShow] = useState(false),
    [form, setForm] = useState<any>(empty),
    [editing, setEditing] = useState<string | null>(null),
    [msg, setMsg] = useState(""),
    [fetching, setFetching] = useState(true),
    [saving, setSaving] = useState(false);
  async function load() {
    setFetching(true);
    const p = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(p.data || []);
    const o = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders(o.data || []);
    const c = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });
    setCustomers(c.count || 0);
    setFetching(false);
  }
  useEffect(() => {
    if (profile?.role === "admin") load();
  }, [profile]);
  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.payment_status === "paid")
        .reduce((s, o) => s + Number(o.total_amount), 0),
    [orders],
  );
  async function save(e: any) {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compare_at_price: form.compare_at_price
        ? Number(form.compare_at_price)
        : null,
      stock: Number(form.stock),
    };
    const r = editing
      ? await supabase.from("products").update(payload).eq("id", editing)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (r.error) setMsg(r.error.message);
    else {
      setShow(false);
      setEditing(null);
      setForm(empty);
      load();
    }
  }
  async function del(id: string) {
    if (confirm("Delete this product?")) {
      await supabase.from("products").update({ is_active: false }).eq("id", id);
      load();
    }
  }
  if (loading) return <PageLoader label="Loading admin..." />;
  if (!user) return <Navigate to="/login" />;
  if (profile?.role !== "admin")
    return (
      <div className="center-page">
        <div className="success-box">
          <h2>Admin access required</h2>
          <Link className="primary-btn" to="/">
            Back home
          </Link>
        </div>
      </div>
    );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <img src="/images/logo.svg" />
        <span className="admin-label">CONTROL CENTER</span>
        <Link className="active" to="/admin">
          <LayoutDashboard /> Dashboard
        </Link>
        <Link to="/shop">
          <ShoppingBag /> Storefront
        </Link>
        <button onClick={() => supabase.auth.signOut()}>
          <LogOut /> Sign out
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          <div>
            <span className="eyebrow">VOLTIX ADMIN</span>
            <h1>Commerce overview</h1>
          </div>
          <button
            className="primary-btn"
            onClick={() => {
              setEditing(null);
              setForm(empty);
              setShow(true);
            }}
          >
            <Plus /> Add Product
          </button>
        </div>
        <div className="admin-stats">
          <div>
            <Box />
            <span>Products</span>
            <b>{products.length}</b>
          </div>
          <div>
            <ShoppingBag />
            <span>Orders</span>
            <b>{orders.length}</b>
          </div>
          <div>
            <Users />
            <span>Customers</span>
            <b>{customers}</b>
          </div>
          <div>
            <BarChart3 />
            <span>Paid revenue</span>
            <b>₹{revenue.toLocaleString("en-IN")}</b>
          </div>
        </div>
        <div className="admin-grid">
          <section className="admin-panel">
            <div className="panel-head">
              <h2>Sales pulse</h2>
              <span>Last {Math.min(orders.length, 10)} orders</span>
            </div>
            <div className="bars">
              {orders
                .slice(0, 10)
                .reverse()
                .map((o, i) => (
                  <div key={o.id}>
                    <i
                      style={{
                        height: `${Math.max(12, Math.min(100, Number(o.total_amount) / 100))}%`,
                      }}
                    />
                    <small>{i + 1}</small>
                  </div>
                ))}
            </div>
          </section>
          <section className="admin-panel">
            <div className="panel-head">
              <h2>Order records</h2>
              <span>Live</span>
            </div>
            <div className="admin-orders">
              {orders.slice(0, 8).map((o) => (
                <div key={o.id}>
                  <b>#{o.order_number}</b>
                  <span>{o.status}</span>
                  <strong>
                    ₹{Number(o.total_amount).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="admin-panel">
          <div className="panel-head">
            <h2>Product catalogue</h2>
            <span>{products.length} records</span>
          </div>
          {fetching && <PageLoader label="Loading data..." />}
          <div className="product-table">
            {products.map((p) => (
              <div key={p.id}>
                <img src={p.image_url || "/images/laptop.svg"} />
                <div>
                  <b>{p.name}</b>
                  <span>
                    {p.sku} · Stock {p.stock}
                  </span>
                </div>
                <strong>₹{Number(p.price).toLocaleString("en-IN")}</strong>
                <button
                  onClick={() => {
                    setEditing(p.id);
                    setForm(p);
                    setShow(true);
                  }}
                >
                  <Edit3 />
                </button>
                <button onClick={() => del(p.id)}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      {show && (
        <div className="modal-backdrop">
          <motion.form
            className="product-modal"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onSubmit={save}
          >
            <div className="panel-head">
              <h2>{editing ? "Edit" : "Add"} product</h2>
              <button type="button" onClick={() => setShow(false)}>
                ×
              </button>
            </div>
            {[
              "name",
              "slug",
              "brand",
              "sku",
              "price",
              "compare_at_price",
              "stock",
              "image_url",
            ].map((k) => (
              <input
                key={k}
                required={[
                  "name",
                  "slug",
                  "sku",
                  "price",
                  "stock",
                  "image_url",
                ].includes(k)}
                placeholder={k.replaceAll("_", " ")}
                value={form[k] ?? ""}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {msg && <p className="error">{msg}</p>}
            <button className="primary-btn" disabled={saving}>
              {saving ? <><Spinner size={16} /> Saving...</> : "Save Product"}
            </button>
          </motion.form>
        </div>
      )}
    </div>
  );
}
