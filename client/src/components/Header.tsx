import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Flame,
  Heart,
  LayoutGrid,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useCart } from "../App";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { CATEGORIES, shopLink } from "../lib/categories";

export default function Header() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const onShop = pathname === "/shop";
  const isAdmin = profile?.role === "admin";

  const [open, setOpen] = useState(false); // mobile menu
  const [catOpen, setCatOpen] = useState(false); // All Categories dropdown
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const catRef = useRef<HTMLDivElement>(null);

  // keep the header search box in sync with the URL (so Shop & Header always agree)
  const urlSearch = params.get("search") ?? "";
  const urlCategory = params.get("category") ?? "All";
  useEffect(() => {
    if (onShop) {
      setQ(urlSearch);
      setCat(urlCategory);
    }
  }, [onShop, urlSearch, urlCategory]);

  // close menus on every route change
  useEffect(() => {
    setOpen(false);
    setCatOpen(false);
  }, [pathname, params]);

  // close dropdown when clicking outside
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node))
        setCatOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function go(nextQ: string, nextCat: string, live: boolean) {
    const sp = new URLSearchParams();
    if (nextQ.trim()) sp.set("search", nextQ);
    if (nextCat !== "All") sp.set("category", nextCat);
    const url = `/shop${sp.toString() ? `?${sp}` : ""}`;
    // live = typing while already on the shop page: update results without jumping
    nav(url, live ? { replace: true, state: { keepScroll: true } } : undefined);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go(q, cat, false);
  }

  /* ---------- ADMIN header: Home, Shop, Admin + profile name ---------- */
  if (isAdmin) {
    const name = profile?.full_name || user?.email || "Admin";
    return (
      <header className="sn-header sn-header-admin">
        <div className="sn-container sn-header-main">
          <Link className="sn-brand" to="/">
            <img src="/images/logo.svg" alt="Voltix" />
          </Link>
          <nav className="sn-admin-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
          <Link className="sn-account" to="/account">
            <span className="avatar">{name[0].toUpperCase()}</span>
            <span className="sn-account-text">
              <b>{name.split(" ")[0]}</b>
              <small>Admin</small>
            </span>
          </Link>
        </div>
      </header>
    );
  }

  /* ---------- CUSTOMER header ---------- */
  return (
    <header className="sn-header">
      <div className="sn-container sn-header-main">
        <Link className="sn-brand" to="/">
          <img src="/images/logo.svg" alt="Voltix" />
        </Link>

        <form className="sn-search" onSubmit={submit}>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              if (onShop) go(e.target.value, cat, true); // live results on /shop
            }}
            placeholder="Search products, brands and more..."
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search"><Search size={19} /></button>
        </form>

        <div className="sn-actions">
          {user ? (
            <Link className="sn-account" to="/account">
              <span className="avatar">
                {(profile?.full_name || user.email || "U")[0].toUpperCase()}
              </span>
              <span className="sn-account-text">
                <b>{profile?.full_name?.split(" ")[0] || "Account"}</b>
                <small>My Account</small>
              </span>
            </Link>
          ) : (
            <Link className="sn-account" to="/login">
              <UserRound size={26} />
              <span className="sn-account-text">
                <b>My Account</b>
                <small>Sign in</small>
              </span>
            </Link>
          )}
          <Link className="head-icon sn-icon-btn" to="/account" aria-label="Wishlist">
            <Heart />
            <b key={`w${wishCount}`} className="sn-pop">{wishCount}</b>
          </Link>
          <Link className="head-icon sn-icon-btn" to="/cart" aria-label="Cart">
            <ShoppingCart />
            <b key={`c${count}`} className="sn-pop">{count}</b>
          </Link>
          <button
            className="sn-burger"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`sn-navbar ${open ? "open" : ""}`}>
        <div className="sn-container sn-navbar-inner">
          <div className="sn-allcats" ref={catRef}>
            <button onClick={() => setCatOpen(!catOpen)} aria-expanded={catOpen}>
              <LayoutGrid size={17} /> All Categories
              <ChevronDown size={16} className={catOpen ? "flip" : ""} />
            </button>
            {catOpen && (
              <div className="sn-catmenu">
                {CATEGORIES.map((c) => (
                  <Link key={c.name} to={shopLink(c.name)}>
                    <c.icon size={17} /> {c.name} <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <nav className="sn-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/shop" end>Shop</NavLink>
            <NavLink to="/blog">Journal</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <Link className="sn-hot" to="/shop?deals=1">
            <Flame size={16} /> Hot Offers
          </Link>
        </div>
      </div>
    </header>
  );
}
