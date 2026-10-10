import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Truck,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
const data: any = {
  about: {
    k: "OUR STORY",
    title: "Technology should feel effortless.",
    text: "Voltix is a modern electronics marketplace focused on thoughtful products, transparent service and a checkout experience that gets out of your way.",
  },
  mission: {
    k: "OUR MISSION",
    title: "Make better technology easier to choose.",
    text: "We combine curated products, useful guidance and reliable support so customers can buy with confidence.",
  },
  blog: {
    k: "THE VOLTIX JOURNAL",
    title: "Ideas, guides & smarter tech.",
    text: "Practical articles about devices, productivity, gaming and building a better digital life.",
  },
  help: {
    k: "HELP CENTER",
    title: "We are here when you need us.",
    text: "Find answers about accounts, payments, shipping, returns and orders.",
  },
  shipping: {
    k: "SHIPPING INFO",
    title: "Fast, trackable delivery.",
    text: "Orders over ₹2,500 qualify for free standard shipping. Delivery estimates are shown during checkout.",
  },
  privacy: {
    k: "PRIVACY POLICY",
    title: "Your data stays yours.",
    text: "We only collect the information needed to process orders and support you. We never sell personal data, and payments are handled securely by Razorpay.",
  },
  terms: {
    k: "TERMS & CONDITIONS",
    title: "Clear terms for every order.",
    text: "By placing an order you agree to our pricing, shipping, return and warranty policies described across this website.",
  },
  returns: {
    k: "RETURNS & REFUNDS",
    title: "Simple returns, clear policies.",
    text: "Eligible products can be requested for return within 30 days of delivery, subject to product condition and category rules.",
  },
};
export default function ContentPage({ kind }: { kind: string }) {
  if (kind === "contact") return <Contact />;
  const d = data[kind] || data.about;
  return (
    <div className="content-page">
      <section className="page-hero editorial">
        <span className="eyebrow">{d.k}</span>
        <h1>{d.title}</h1>
        <p>{d.text}</p>
      </section>
      {kind === "blog" ? (
        <div className="article-grid">
          {[
            "How to choose your next laptop",
            "The 2026 desk setup checklist",
            "Smart shopping: specs that matter",
          ].map((x, i) => (
            <motion.article whileHover={{ y: -8 }} key={x}>
              <img
                src={
                  [
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
                  ][i]
                }
              />
              <span>GUIDE · 6 MIN READ</span>
              <h3>{x}</h3>
              <Link to="/contact">
                Read more <ArrowRight size={15} />
              </Link>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="info-grid">
          {[
            ["Quality first", ShieldCheck],
            ["Fast delivery", Truck],
            ["Easy returns", RefreshCcw],
          ].map(([t, I]: any) => (
            <div className="info-card" key={t}>
              <I />
              <h3>{t}</h3>
              <p>Designed around a clear, customer-first experience.</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Contact() {
  const [sent, setSent] = useState(false);
  async function submit(e: any) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await supabase
      .from("contact_messages")
      .insert({
        name: f.get("name"),
        email: f.get("email"),
        message: f.get("message"),
      });
    setSent(true);
  }
  return (
    <div className="content-page">
      <section className="page-hero editorial">
        <span className="eyebrow">CONTACT US</span>
        <h1>Let's talk.</h1>
        <p>Questions, feedback or partnership ideas? Send us a message.</p>
      </section>
      <div className="contact-grid">
        <div className="contact-info">
          <div>
            <MapPin /> Bengaluru, India
          </div>
          <div>
            <Mail /> support@voltix.store
          </div>
          <div>
            <Phone /> +91 90000 00000
          </div>
          <Link className="primary-btn" to="/help">
            Visit Help Center
          </Link>
        </div>
        {sent ? (
          <div className="success-box">
            <h2>Message received ✓</h2>
            <p>Our team will get back to you shortly.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={submit}>
            <input name="name" required placeholder="Your name" />
            <input
              name="email"
              required
              type="email"
              placeholder="Email address"
            />
            <textarea
              name="message"
              required
              rows={6}
              placeholder="How can we help?"
            />
            <button className="primary-btn">
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
