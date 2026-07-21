-- Nisa Dental - Coupons, Invoices & Revenue tables
-- Run this in Supabase SQL Editor after 001_schema.sql

-- ==============================
-- COUPONS
-- ==============================
create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value decimal(10,2) not null,
  min_order_amount decimal(10,2) default 0,
  max_uses int,
  used_count int default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- INVOICES
-- ==============================
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  invoice_number text not null unique,
  subtotal decimal(10,2) default 0,
  tax_rate decimal(5,2) default 0,
  tax_amount decimal(10,2) default 0,
  delivery_charge decimal(10,2) default 0,
  discount_amount decimal(10,2) default 0,
  coupon_code text,
  total decimal(10,2) default 0,
  status text default 'paid',
  paid_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ==============================
-- REVENUE LOG (for tracking)
-- ==============================
create table public.revenue_log (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  amount decimal(10,2) not null,
  source text not null default 'order',
  description text,
  recorded_at timestamptz default now()
);

-- ==============================
-- INDEXES
-- ==============================
create index idx_coupons_code on public.coupons(code);
create index idx_coupons_active on public.coupons(is_active);
create index idx_invoices_order on public.invoices(order_id);
create index idx_invoices_number on public.invoices(invoice_number);
create index idx_revenue_date on public.revenue_log(recorded_at);

-- ==============================
-- RLS
-- ==============================
alter table public.coupons enable row level security;
alter table public.invoices enable row level security;
alter table public.revenue_log enable row level security;

-- Public can read active coupons (for validation)
create policy "Anyone can read active coupons" on public.coupons for select using (is_active = true);

-- Admin full access
create policy "Admin all on coupons" on public.coupons for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on invoices" on public.invoices for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on revenue_log" on public.revenue_log for all using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Customers can view own invoices
create policy "Customers view own invoices" on public.invoices for select using (
  order_id in (select id from public.orders where customer_email = auth.email())
);

-- Seed settings for delivery and tax
insert into public.site_settings (key, value) values
  ('delivery_charge', '5.99'),
  ('tax_rate', '8.00')
on conflict (key) do nothing;
