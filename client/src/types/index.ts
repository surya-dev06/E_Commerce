export type Product = {
  id: string;
  category_id?: string | null;
  name: string;
  slug: string;
  brand: string;
  description: string;
  short_description?: string | null;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  image_url?: string | null;
  category?: { name: string; slug: string } | null;
};
export type CartItem = { product: Product; quantity: number };
export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
};
export type Wishlist = { id: string; product_id: string; product?: Product };
