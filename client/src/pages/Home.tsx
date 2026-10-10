import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Gift,
  Headphones,
  Heart,
  Mail,
  MessageCircle,
  Music,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { money } from "../lib/format";
import { ProductSkeletons, SafeImg, Spinner } from "../components/Loaders";
import { supabase } from "../lib/supabase";
import { CATEGORIES, shopLink } from "../lib/categories";
import type { Product } from "../types";

/* ---------------- static content (edit freely) ---------------- */
const IMG = {
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&h=700&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&h=700&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&h=700&q=80",
  home: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=700&h=700&q=80",
};

const SLIDES = [
  { eyebrow: "New Arrival", t1: "Smart Tech", t2: "Collection 2026",
    sub: "Smart. Stylish. Connected.",
    text: "Discover the latest gadgets with innovative features and premium designs.",
    cta: "Shop Now", to: shopLink("Wearables"), img: IMG.watch, fb: "/images/watch.svg" },
  { eyebrow: "Work / Create", t1: "Power That", t2: "Travels With You",
    sub: "Performance. Portability. Precision.",
    text: "Premium laptops built for creators, students and professionals on the move.",
    cta: "Explore Laptops", to: shopLink("Laptops"), img: IMG.laptop, fb: "/images/laptop.svg" },
  { eyebrow: "Listen / Feel", t1: "Sound With", t2: "More Depth",
    sub: "Immersive. Wireless. Effortless.",
    text: "Headphones and speakers tuned for everything you love to hear.",
    cta: "Explore Audio", to: shopLink("Audio"), img: IMG.audio, fb: "/images/headphones.svg" },
];

const ORBIT = [Music, Heart, MessageCircle, Cloud, Activity, Headphones];

const FEATURES = [
  { icon: Truck, t: "Free Shipping", s: "On orders over ₹2,500" },
  { icon: ShieldCheck, t: "Secure Payment", s: "100% secure payment" },
  { icon: RotateCcw, t: "Easy Returns", s: "30 days return policy" },
  { icon: Gift, t: "Gift Cards", s: "The perfect gift" },
  { icon: Headphones, t: "24/7 Support", s: "We're here to help" },
];

const CURATED = [
  { cls: "blue", k: "WORK / CREATE", t: "Power that travels with you.", to: shopLink("Laptops"), label: "Explore laptops", img: IMG.laptop, fb: "/images/laptop.svg" },
  { cls: "purple", k: "LISTEN / FEEL", t: "Sound with more depth.", to: shopLink("Audio"), label: "Explore audio", img: IMG.audio, fb: "/images/headphones.svg" },
  { cls: "green", k: "LIVE / CONNECT", t: "A smarter home awaits.", to: shopLink("Smart Home"), label: "Explore smart home", img: IMG.home, fb: "/images/camera.svg" },
];

/* ---------------- small pieces ---------------- */
function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  // deal ends at the end of the coming Sunday
  const end = new Date();
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  let s = Math.max(0, Math.floor((end.getTime() - now) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  const cells: [number, string][] = [[d, "Days"], [h, "Hrs"], [m, "Mins"], [s, "Secs"]];
  return (
    <div className="sn-count">
      {cells.map(([v, l]) => (
        <div key={l}><b>{String(v).padStart(2, "0")}</b><small>{l}</small></div>
      ))}
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="sn-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} fill={i <= Math.round(value) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

/* ---------------- page ---------------- */
export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState<"featured" | "bestseller" | "latest">("featured");
  const [page, setPage] = useState(0);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinErr, setJoinErr] = useState("");

  useEffect(() => {
    supabase
      .from("products")
      .select("*,category:categories(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(40)
      .then(({ data }) => setProducts((data || []) as Product[]));
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  const all = products || [];
  const lists = useMemo(() => {
    const fill = (first: Product[]) => {
      const ids = new Set(first.map((p) => p.id));
      return [...first, ...all.filter((p) => !ids.has(p.id))];
    };
    return {
      featured: fill(all.filter((p) => p.is_featured)),
      bestseller: [...all].sort((a, b) => b.review_count - a.review_count),
      latest: all,
    };
  }, [products]); // eslint-disable-line
  const PAGE = 8;
  const list = lists[tab];
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const visible = list.slice(page * PAGE, page * PAGE + PAGE);
  const topRated = useMemo(() => [...all].sort((a, b) => b.rating - a.rating).slice(0, 6), [products]); // eslint-disable-line
  const deal = useMemo(() => {
    const disc = (p: Product) => (p.compare_at_price ? p.compare_at_price - p.price : 0);
    return [...all].sort((a, b) => disc(b) - disc(a))[0];
  }, [products]); // eslint-disable-line

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setJoining(true);
    setJoinErr("");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" });
    setJoining(false);
    if (error) setJoinErr("Could not subscribe. Please try again.");
    else setJoined(true);
  }

  const s = SLIDES[slide];

  return (
    <div className="sn-home sn-container">
      {/* ---------- 1. sidebar + hero ---------- */}
      <section className="sn-hero-row">
        <aside className="sn-sidecats">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to={shopLink(c.name)}>
              <c.icon size={17} /> <span>{c.name}</span>
            </Link>
          ))}
          <Link to="/shop" className="more"><span>More Categories</span> <ArrowRight size={15} /></Link>
        </aside>

        <div
          className="sn-hero"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              className="sn-hero-slide"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
            >
              <div className="sn-hero-copy">
                <span className="sn-hero-eyebrow">{s.eyebrow}</span>
                <h1>{s.t1}<br /><em>{s.t2}</em></h1>
                <h3>{s.sub}</h3>
                <p>{s.text}</p>
                <Link className="sn-btn" to={s.to}>{s.cta} <ArrowRight size={16} /></Link>
              </div>
              <div className="sn-hero-art">
                <div className="sn-orbit">
                  {ORBIT.map((I, i) => (
                    <i key={i} style={{ ["--a" as any]: `${i * 60}deg` }}>
                      <span><I size={16} /></span>
                    </i>
                  ))}
                </div>
                <div className="sn-hero-photo">
                  <SafeImg src={s.img} fallback={s.fb} alt={s.t1} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="sn-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={i === slide ? "on" : ""}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 2. feature strip ---------- */}
      <section className="sn-features">
        {FEATURES.map(({ icon: I, t, s: sub }) => (
          <div key={t}>
            <span><I size={20} /></span>
            <p><b>{t}</b><small>{sub}</small></p>
          </div>
        ))}
      </section>

      {/* ---------- 3. promo + deal + popular products ---------- */}
      <section className="sn-main-row">
        <div className="sn-side">
          <Link to={shopLink("Wearables")} className="sn-offer">
            <small>EXCLUSIVE OFFER</small>
            <h3>Smartwatch<br />Best Choice</h3>
            <span className="sn-btn sm">Shop Now</span>
            <SafeImg src={IMG.watch} fallback="/images/watch.svg" alt="" />
          </Link>

          <div className="sn-deal">
            <h3>Deal Of The Day</h3>
            <Countdown />
            {deal ? (
              <Link to={`/product/${deal.slug}`} className="sn-deal-product">
                <SafeImg src={deal.image_url || ""} alt={deal.name} />
                <b>{deal.name}</b>
                <Stars value={deal.rating} />
                <span>
                  <strong>{money(deal.price)}</strong>
                  {deal.compare_at_price && <del>{money(deal.compare_at_price)}</del>}
                </span>
              </Link>
            ) : (
              <div className="sn-skel sn-skel-img" data-loading="true" />
            )}
          </div>
        </div>

        <div className="sn-popular">
          <div className="sn-section-head">
            <h2>Popular Products</h2>
            <div className="sn-tabs">
              {(["featured", "bestseller", "latest"] as const).map((t) => (
                <button
                  key={t}
                  className={tab === t ? "on" : ""}
                  onClick={() => { setTab(t); setPage(0); }}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
              <span className="sn-arrows">
                <button disabled={pages < 2} onClick={() => setPage((p) => (p - 1 + pages) % pages)} aria-label="Previous"><ChevronLeft size={16} /></button>
                <button disabled={pages < 2} onClick={() => setPage((p) => (p + 1) % pages)} aria-label="Next"><ChevronRight size={16} /></button>
              </span>
            </div>
          </div>
          <div className="sn-product-grid">
            {products === null ? (
              <ProductSkeletons count={8} />
            ) : visible.length ? (
              visible.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="empty-box">Run the included Supabase seed to populate products.</div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- 4. promo banners + categories ---------- */}
      <section className="sn-promo-row">
        <Link to="/shop?deals=1" className="sn-mega">
          <Gift size={150} className="sn-mega-art" />
          <small>MEGA SALE</small>
          <span>UP TO</span>
          <strong>50% OFF</strong>
          <p>On All Categories</p>
          <b className="sn-btn light sm">Shop Now</b>
        </Link>

        <div className="sn-banner">
          <div>
            <small>Modern Workspace</small>
            <h3>New Laptop Range</h3>
            <p>Stylish &amp; Powerful</p>
            <Link className="sn-btn sm" to={shopLink("Laptops")}>Explore Now</Link>
          </div>
          <SafeImg src={IMG.laptop} fallback="/images/laptop.svg" alt="" />
        </div>

        <div className="sn-banner warm">
          <div>
            <small>Audio Essentials</small>
            <h3>New Arrivals 2026</h3>
            <p>Up to 40% Discount</p>
            <Link className="sn-btn sm" to={shopLink("Audio")}>Explore Now</Link>
          </div>
          <SafeImg src={IMG.audio} fallback="/images/headphones.svg" alt="" />
        </div>

        <div className="sn-shopcats">
          <div className="sn-section-head">
            <h2>Shop By Category</h2>
            <Link to="/shop" className="sn-viewall">View all</Link>
          </div>
          <div className="sn-cat-row">
            {CATEGORIES.map((c) => (
              <Link key={c.name} to={shopLink(c.name)} className="sn-cat">
                <span className="sn-cat-img">
                  <SafeImg src={c.img} fallback={c.fallback} alt={c.name} />
                </span>
                <span className="sn-cat-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 5. curated ---------- */}
      <section className="sn-curated">
        <div className="sn-section-head">
          <h2>Curated for modern life</h2>
          <Link to="/shop" className="sn-viewall">Shop collection <ArrowRight size={14} /></Link>
        </div>
        <div className="sn-curated-grid">
          {CURATED.map((c) => (
            <motion.div key={c.cls} whileHover={{ y: -4 }} className={`sn-curated-card ${c.cls}`}>
              <div>
                <small>{c.k}</small>
                <h3>{c.t}</h3>
                <Link to={c.to}>{c.label} <ArrowRight size={15} /></Link>
              </div>
              <SafeImg src={c.img} fallback={c.fb} alt="" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- 6. top rated ---------- */}
      <section className="sn-toprated">
        <div className="sn-section-head"><h2>Top Rated Products</h2></div>
        <div className="sn-mini-grid">
          {products === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="sn-skel sn-skel-mini" key={i} data-loading="true" />
              ))
            : topRated.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="sn-mini">
                  <SafeImg src={p.image_url || ""} alt={p.name} />
                  <b>{p.name}</b>
                  <Stars value={p.rating} />
                  <strong>{money(p.price)}</strong>
                </Link>
              ))}
        </div>
      </section>

      {/* ---------- 7. newsletter ---------- */}
      <section className="sn-newsletter">
        <span className="sn-news-icon"><Mail size={24} /></span>
        <div>
          <h3>Subscribe To Our Newsletter</h3>
          <p>Get the latest updates on new arrivals, offers &amp; more.</p>
        </div>
        {joined ? (
          <div className="joined">You're on the list ✓</div>
        ) : (
          <form onSubmit={join}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            <button disabled={joining}>
              {joining ? <Spinner size={16} /> : "Subscribe"}
            </button>
          </form>
        )}
        {joinErr && <p className="error sn-news-err">{joinErr}</p>}
      </section>
    </div>
  );
}
