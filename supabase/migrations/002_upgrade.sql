create table if not exists public.wishlists(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.products(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(user_id,product_id)
);
create table if not exists public.newsletter_subscribers(
 id uuid primary key default gen_random_uuid(), email text unique not null, created_at timestamptz not null default now()
);
create table if not exists public.contact_messages(
 id uuid primary key default gen_random_uuid(), name text not null, email text not null, message text not null,
 created_at timestamptz not null default now()
);
alter table public.wishlists enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
create policy "users manage own wishlists" on public.wishlists for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "public subscribe newsletter" on public.newsletter_subscribers for insert with check(true);
create policy "public contact insert" on public.contact_messages for insert with check(true);
create index if not exists wishlists_user_idx on public.wishlists(user_id);
create index if not exists wishlists_product_idx on public.wishlists(product_id);
