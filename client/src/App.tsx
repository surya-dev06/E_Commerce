import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { PageLoader } from "./components/Loaders";
import type { Product, CartItem } from "./types";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
const Admin = lazy(() => import("./pages/Admin")); // loaded only when needed
import { Login, Register, VerifyEmail, AuthCallback } from "./pages/Auth";
import ContentPage from "./pages/ContentPage";
import TrackOrder from "./pages/TrackOrder";
import OrderDetails from "./pages/OrderDetails";
import PaymentFailure from "./pages/PaymentFailure";
type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product, q?: number) => void;
  update: (id: string, q: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const CartContext = createContext<CartCtx | null>(null);
export const useCart = () => useContext(CartContext)!;
function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("voltix-cart") || "[]");
    } catch {
      return [];
    }
  });
  useEffect(
    () => localStorage.setItem("voltix-cart", JSON.stringify(items)),
    [items],
  );
  const value = useMemo(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.quantity, 0),
      total: items.reduce((s, i) => s + i.quantity * i.product.price, 0),
      add: (p: Product, q = 1) =>
        setItems((c) => {
          const f = c.find((i) => i.product.id === p.id);
          if (f)
            return c.map((i) =>
              i.product.id === p.id
                ? { ...i, quantity: Math.min(i.quantity + q, p.stock) }
                : i,
            );
          return p.stock > 0
            ? [...c, { product: p, quantity: Math.min(q, p.stock) }]
            : c;
        }),
      update: (id: string, q: number) =>
        setItems((c) =>
          q <= 0
            ? c.filter((i) => i.product.id !== id)
            : c.map((i) =>
                i.product.id === id
                  ? { ...i, quantity: Math.min(q, i.product.stock) }
                  : i,
              ),
        ),
      remove: (id: string) => setItems((c) => c.filter((i) => i.product.id !== id)),
      clear: () => setItems([]),
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export default function App() {
  return (
    <AuthProvider>
     <WishlistProvider>
      <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/about" element={<ContentPage kind="about" />} />
          <Route path="/mission" element={<ContentPage kind="mission" />} />
          <Route path="/blog" element={<ContentPage kind="blog" />} />
          <Route path="/contact" element={<ContentPage kind="contact" />} />
          <Route path="/help" element={<ContentPage kind="help" />} />
          <Route path="/shipping" element={<ContentPage kind="shipping" />} />
          <Route path="/returns" element={<ContentPage kind="returns" />} />
          <Route path="/privacy" element={<ContentPage kind="privacy" />} />
          <Route path="/terms" element={<ContentPage kind="terms" />} />
          <Route path="/support" element={<Navigate to="/help" replace />} />
          <Route path="/newsletter" element={<Navigate to="/" replace />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoader label="Loading admin..." />}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </CartProvider>
     </WishlistProvider>
    </AuthProvider>
  );
}
