-- Nisa Dental - Product weight, discount %, order status update
-- Run this in Supabase SQL Editor after 003_order_number.sql

-- Add weight and discount_percent to products
alter table public.products add column if not exists weight decimal(10,2) default 0;
alter table public.products add column if not exists discount_percent int default 0 check (discount_percent >= 0 and discount_percent <= 100);

-- Update order_status check constraint
alter table public.orders drop constraint if exists orders_order_status_check;
alter table public.orders add constraint orders_order_status_check
  check (order_status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'requested_return'));

-- Add delivery rate setting if not exists
insert into public.site_settings (key, value) values ('delivery_rate_per_kg', '150')
on conflict (key) do nothing;

-- Update existing delivery_charge and tax_rate to PKR defaults
update public.site_settings set value = '150' where key = 'delivery_charge' and value = '5.99';

-- Function to decrement stock safely
create or replace function public.decrement_stock(pid uuid, qty int)
returns void
language sql
as $$
  update public.products set stock_quantity = stock_quantity - qty where id = pid and stock_quantity >= qty;
$$;
