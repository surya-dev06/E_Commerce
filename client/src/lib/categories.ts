import {
  Gamepad2,
  Headphones,
  House,
  Laptop,
  Monitor,
  Smartphone,
  Watch,
} from "lucide-react";

/** Names must match the `categories.name` values in Supabase (seed.sql). */
export const CATEGORIES = [
  { name: "Laptops", icon: Laptop, fallback: "/images/laptop.svg",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Smartphones", icon: Smartphone, fallback: "/images/phone.svg",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Audio", icon: Headphones, fallback: "/images/headphones.svg",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Wearables", icon: Watch, fallback: "/images/watch.svg",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Gaming", icon: Gamepad2, fallback: "/images/controller.svg",
    img: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Monitors", icon: Monitor, fallback: "/images/monitor.svg",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&h=400&q=80" },
  { name: "Smart Home", icon: House, fallback: "/images/camera.svg",
    img: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=400&h=400&q=80" },
] as const;

export const shopLink = (category?: string) =>
  category ? `/shop?category=${encodeURIComponent(category)}` : "/shop";
