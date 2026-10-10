import { useEffect, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { ProductSkeletons } from "../components/Loaders";
import { CATEGORIES } from "../lib/categories";

// small helper: how well does a product match the typed words? (0 = no match)
function score(p: Product, words: string[]) {
  const name = p.name.toLowerCase();
  const brand = (p.brand || "").toLowerCase();
  const cat = (p.category?.name || "").toLowerCase();
  const extra = `${p.sku || ""} ${p.short_description || ""}`.toLowerCase();
  let total = 0;
  for (const w of words) {
    if (name.startsWith(w)) total += 4;
    else if (name.includes(w)) total += 3;
    else if (brand.includes(w) || cat.includes(w)) total += 2;
    else if (extra.includes(w)) total += 1;
    else return 0; // every typed word must match something
  }
  return total;
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [filterOpen, setFilterOpen] = useState(false);

  // The URL is the single source of truth for search / category / deals.
  // Header search, footer links and this page all just change the URL.
  const urlSearch = params.get("search") ?? "";
  const category = params.get("category") ?? "All";
  const dealsOnly = params.get("deals") === "1";

  // local text so typing never lags; it re-syncs whenever the URL changes
  const [text, setText] = useState(urlSearch);
  useEffect(() => setText(urlSearch), [urlSearch]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, category:categories(name,slug)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setProducts((data as Product[]) || []));
  }, []);

  const categories = useMemo(
    () => ["All", ...CATEGORIES.map((c) => c.name)],
    [],
  );

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    // replace + keepScroll => results change instantly, page does not jump
    setParams(sp, { replace: true, state: { keepScroll: true } });
  }

  const filtered = useMemo(() => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = (products || [])
      .map((p) => ({ p, s: words.length ? score(p, words) : 1 }))
      .filter(({ p, s }) => {
        const okCat =
          category === "All" ||
          p.category?.name?.toLowerCase() === category.toLowerCase() ||
          p.category?.slug === category.toLowerCase();
        const okDeal = !dealsOnly || (p.compare_at_price ?? 0) > p.price;
        return s > 0 && okCat && okDeal && p.price <= maxPrice;
      });
    let list = scored;
    if (sort === "relevance" && words.length) list = [...scored].sort((a, b) => b.s - a.s);
    if (sort === "low") list = [...scored].sort((a, b) => a.p.price - b.p.price);
    if (sort === "high") list = [...scored].sort((a, b) => b.p.price - a.p.price);
    if (sort === "rating") list = [...scored].sort((a, b) => b.p.rating - a.p.rating);
    return list.map((x) => x.p);
  }, [products, text, category, dealsOnly, maxPrice, sort]);

  return (
    <div className="page">
      <div className="page-hero">
        <span className="eyebrow">{dealsOnly ? "HOT OFFERS" : "DISCOVER YOUR NEXT DEVICE"}</span>
        <h1>{dealsOnly ? "Today's Best Deals" : category !== "All" ? category : "Shop Everything"}</h1>
        <p>Explore our collection of smart technology.</p>
      </div>
      <div className="shop-layout">
        <aside className={`filters ${filterOpen ? "show" : ""}`}>
          <div className="filter-head"><h3>Filters</h3><button onClick={() => setFilterOpen(false)}><X /></button></div>
          <label>Category</label>
          {categories.map((c) => (
            <button
              key={c}
              className={category.toLowerCase() === c.toLowerCase() ? "filter-active" : ""}
              onClick={() => update({ category: c === "All" ? null : c })}
            >
              {c}
            </button>
          ))}
          <label>Maximum Price: ₹{maxPrice.toLocaleString("en-IN")}</label>
          <input type="range" min="1000" max="200000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          <button className={dealsOnly ? "filter-active" : ""} onClick={() => update({ deals: dealsOnly ? null : "1" })}>
            Only discounted items
          </button>
        </aside>

        <section className="shop-content">
          <div className="shop-toolbar">
            <button className="mobile-filter" onClick={() => setFilterOpen(true)}><Filter /> Filters</button>
            <div className="search-inline">
              <Search />
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  update({ search: e.target.value.trim() ? e.target.value : null });
                }}
                placeholder="Search products..."
              />
              {text && (
                <button className="sn-clear" onClick={() => { setText(""); update({ search: null }); }} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Best match</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
          <p className="results-count">
            {products === null ? "Loading products..." : `${filtered.length} products`}
            {text && ` for "${text}"`}
          </p>
          <div className="product-grid">
            {products === null ? (
              <ProductSkeletons count={8} />
            ) : (
              filtered.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
          {products !== null && !filtered.length && (
            <div className="empty-box">No products found. Try a different search or filter.</div>
          )}
        </section>
      </div>
    </div>
  );
}
