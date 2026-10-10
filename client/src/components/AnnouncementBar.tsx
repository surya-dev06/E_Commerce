import { Link } from "react-router-dom";
import { Headphones, PackageSearch, RotateCcw, Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="sn-topbar">
      <div className="sn-container sn-topbar-inner">
        <span><Truck size={15} /> Free Delivery on Orders Over ₹2,500</span>
        <span><RotateCcw size={15} /> 30-Day Easy Returns</span>
        <span><Headphones size={15} /> 24/7 Customer Support</span>
        <Link to="/track-order" className="sn-topbar-track">
          <PackageSearch size={15} /> Track Order
        </Link>
      </div>
    </div>
  );
}
