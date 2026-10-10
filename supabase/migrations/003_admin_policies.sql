create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "admins manage categories" on public.categories;
drop policy if exists "admins manage products" on public.products;
drop policy if exists "admins manage product images" on public.product_images;
drop policy if exists "admins read profiles" on public.profiles;
drop policy if exists "admins read all orders" on public.orders;
drop policy if exists "admins update orders" on public.orders;
drop policy if exists "admins read order items" on public.order_items;

create policy "admins manage categories" on public.categories for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage products" on public.products for all using(public.is_admin()) with check(public.is_admin());
create policy "admins manage product images" on public.product_images for all using(public.is_admin()) with check(public.is_admin());
create policy "admins read profiles" on public.profiles for select using(auth.uid()=id or public.is_admin());
create policy "admins read all orders" on public.orders for select using(auth.uid()=user_id or public.is_admin());
create policy "admins update orders" on public.orders for update using(public.is_admin()) with check(public.is_admin());
create policy "admins read order items" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_admin())));
