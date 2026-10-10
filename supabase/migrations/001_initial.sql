create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer','admin');
create type public.order_status as enum ('pending','confirmed','processing','shipped','delivered','cancelled');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.payment_record_status as enum ('created','paid','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  brand text not null default 'Voltix',
  description text not null default '',
  short_description text,
  sku text unique not null,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  stock integer not null default 0 check (stock >= 0),
  rating numeric(2,1) not null default 5.0,
  review_count integer not null default 0,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  image_type text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  sku text unique,
  price numeric(12,2),
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(cart_id, product_id, variant_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  line1 text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  order_number text unique not null,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  subtotal numeric(12,2) not null,
  shipping_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  total_price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status public.payment_record_status not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category_id);
create index products_active_idx on public.products(is_active);
create index orders_user_idx on public.orders(user_id);
create index order_items_order_idx on public.order_items(order_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create policy "public read active categories" on public.categories for select using (is_active = true);
create policy "public read active products" on public.products for select using (is_active = true);
create policy "public read product images" on public.product_images for select using (true);
create policy "public read variants" on public.product_variants for select using (true);

create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "users own carts" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users own cart items" on public.cart_items for all
using (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
with check (exists(select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

create policy "users own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "users read own order items" on public.order_items for select
using (exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "users read own payments" on public.payments for select
using (exists(select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- Admin writes are performed by the Node server using its server secret after role validation.
