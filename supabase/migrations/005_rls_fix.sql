-- Nisa Dental - Fix RLS policies for admin panel (password-based auth)
-- Run this in Supabase SQL Editor

-- Drop admin policies that require auth.uid()
drop policy if exists "Admin all on services" on public.services;
drop policy if exists "Admin all on testimonials" on public.testimonials;
drop policy if exists "Admin all on categories" on public.product_categories;
drop policy if exists "Admin all on products" on public.products;
drop policy if exists "Admin all on team" on public.team_members;
drop policy if exists "Admin all on appointments" on public.appointments;
drop policy if exists "Admin all on orders" on public.orders;
drop policy if exists "Admin all on order_items" on public.order_items;
drop policy if exists "Admin all on contacts" on public.contacts;
drop policy if exists "Admin all on settings" on public.site_settings;
drop policy if exists "Admin all on carts" on public.carts;
drop policy if exists "Admin all on cart_items" on public.cart_items;

-- Drop old public policies that restrict to active=true
drop policy if exists "Public can view active services" on public.services;
drop policy if exists "Public can view approved testimonials" on public.testimonials;
drop policy if exists "Public can view active categories" on public.product_categories;
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Public can view active team members" on public.team_members;
drop policy if exists "Public can view site settings" on public.site_settings;

-- Allow anon full access to all admin tables
create policy "anon_all_services" on public.services for all using (true) with check (true);
create policy "anon_all_testimonials" on public.testimonials for all using (true) with check (true);
create policy "anon_all_product_categories" on public.product_categories for all using (true) with check (true);
create policy "anon_all_products" on public.products for all using (true) with check (true);
create policy "anon_all_team_members" on public.team_members for all using (true) with check (true);
create policy "anon_all_appointments" on public.appointments for all using (true) with check (true);
create policy "anon_all_orders" on public.orders for all using (true) with check (true);
create policy "anon_all_order_items" on public.order_items for all using (true) with check (true);
create policy "anon_all_contacts" on public.contacts for all using (true) with check (true);
create policy "anon_all_site_settings" on public.site_settings for all using (true) with check (true);
create policy "anon_all_carts" on public.carts for all using (true) with check (true);
create policy "anon_all_cart_items" on public.cart_items for all using (true) with check (true);

-- Also allow anon all on coupons, invoices, revenue_log, profiles
drop policy if exists "anon_all_coupons" on public.coupons;
create policy "anon_all_coupons" on public.coupons for all using (true) with check (true);
drop policy if exists "anon_all_invoices" on public.invoices;
create policy "anon_all_invoices" on public.invoices for all using (true) with check (true);
drop policy if exists "anon_all_revenue_log" on public.revenue_log;
create policy "anon_all_revenue_log" on public.revenue_log for all using (true) with check (true);
drop policy if exists "anon_all_profiles" on public.profiles;
create policy "anon_all_profiles" on public.profiles for all using (true) with check (true);
