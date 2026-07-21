-- Nisa Dental - Order number sequence
-- Run this in Supabase SQL Editor after 002_coupons_invoices.sql

create sequence if not exists public.order_number_seq start 1;

alter table public.orders add column if not exists order_number text;

create or replace function public.generate_order_number()
returns text
language sql
as $$
  select 'NISA-' || lpad(nextval('public.order_number_seq')::text, 8, '0');
$$;

create or replace function public.increment_coupon_usage(coupon_id uuid)
returns void
language sql
as $$
  update public.coupons set used_count = coalesce(used_count, 0) + 1 where id = coupon_id;
$$;
