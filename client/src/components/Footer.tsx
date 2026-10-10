import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.svg";

function SocialIcon({ type }: { type: "instagram" | "facebook" | "twitter" | "linkedin" }) {
  const labels = {
    instagram: "IG",
    facebook: "f",
    twitter: "X",
    linkedin: "in",
  };

  return (
    <span className={`footer-social-icon footer-social-${type}`} aria-hidden="true">
      {labels[type]}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow footer-glow-one" />
      <div className="footer-glow footer-glow-two" />

      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-link" aria-label="Voltix home">
              <img className="footer-logo" src={logo} alt="Voltix" />
            </Link>
            <p>Innovative electronics for a smarter, brighter tomorrow.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><SocialIcon type="instagram" /></a>
              <a href="#" aria-label="Facebook"><SocialIcon type="facebook" /></a>
              <a href="#" aria-label="Twitter"><SocialIcon type="twitter" /></a>
              <a href="#" aria-label="LinkedIn"><SocialIcon type="linkedin" /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/shop">Laptops</Link>
            <Link to="/shop">Smartphones</Link>
            <Link to="/shop">Audio</Link>
            <Link to="/shop">Wearables</Link>
            <Link to="/shop">Gaming</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Our Mission</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/support">Help Center</Link>
            <Link to="/support">Shipping Info</Link>
            <Link to="/support">Returns & Refunds</Link>
            <Link to="/track-order">Track Order</Link>
          </div>

          <div className="footer-contact">
            <h4>Get in touch</h4>
            <a href="mailto:support@voltix.com"><Mail size={15} /> support@voltix.com</a>
            <a href="tel:+919999999999"><Phone size={15} /> +91 99999 99999</a>
            <span><MapPin size={15} /> Bengaluru, India</span>
          </div>
        </div>

        <div className="footer-newsletter">
          <div>
            <span className="footer-eyebrow">THE VOLTIX COMMUNITY</span>
            <h3>Join for new drops & better tech tips.</h3>
          </div>
          <Link to="/newsletter" className="footer-community-btn">Join Community <span>→</span></Link>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Voltix. All rights reserved.</span>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
