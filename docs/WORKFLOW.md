# E-commerce Workflow

## 1. Storefront
Announcement → Header → Hero → Categories → Featured Collections → Offers → Trending → Benefits → Newsletter → Footer.

## 2. Authentication
Register → Supabase creates auth user → verification email → callback → session.
Google → OAuth provider → callback → session.
Login → session → protected routes.

## 3. Catalogue
React requests active products → Supabase returns product/category data → search/filter/sort locally for the starter → product detail.

## 4. Cart
Add product → local cart persistence → quantity/stock limits → checkout.

## 5. Checkout
Client sends product IDs and quantities to Node.
Node loads trusted prices from Supabase.
Node calculates subtotal + shipping.
Node creates internal order.
Node creates Razorpay order.
Client opens Razorpay Checkout.
Client receives payment response.
Node verifies signature.
Node marks payment/order paid.
Node decrements stock.
Client shows confirmation.

## 6. Admin
Admin login → profile role check → dashboard → product/order/inventory management.

## 7. Deployment
Supabase → database/auth/storage.
Node → API hosting.
Cloudflare Pages → Vite client.
Custom domain → Cloudflare.
Production environment variables → hosting dashboards.
