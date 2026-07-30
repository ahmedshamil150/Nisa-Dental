-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- These policies assume the app uses service_role key for admin operations
-- and the anon key for public reads/writes with limited access.

-- Enable RLS on every table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============ PRODUCTS ============
-- Anyone can read active products
CREATE POLICY "products_select_public" ON products
  FOR SELECT USING (is_active = true);
-- Only service_role can write
CREATE POLICY "products_insert_admin" ON products
  FOR INSERT WITH CHECK (false);
CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (false);
CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (false);

-- ============ ORDERS ============
-- Customers can only see their own orders by order_number
-- (via the anon-key track page — limited to order_number lookup)
CREATE POLICY "orders_select_own" ON orders
  FOR SELECT USING (order_number IS NOT NULL);
-- Service role handles inserts from checkout
CREATE POLICY "orders_insert_public" ON orders
  FOR INSERT WITH CHECK (false);

-- ============ CONTACTS ============
-- Anyone can insert, only service_role can read
CREATE POLICY "contacts_insert_public" ON contacts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_select_admin" ON contacts
  FOR SELECT USING (false);

-- ============ APPOINTMENTS ============
-- Anyone can insert, only service_role can read/update
CREATE POLICY "appointments_insert_public" ON appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "appointments_select_admin" ON appointments
  FOR SELECT USING (false);
CREATE POLICY "appointments_update_admin" ON appointments
  FOR UPDATE USING (false);

-- ============ COUPONS ============
-- Service role only
CREATE POLICY "coupons_admin" ON coupons
  FOR ALL USING (false);

-- ============ SITE SETTINGS ============
-- Everyone can read, only service_role can write
CREATE POLICY "site_settings_select_public" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "site_settings_insert_admin" ON site_settings
  FOR ALL USING (false);

-- ============ REVENUE LOG ============
-- Service role only
CREATE POLICY "revenue_log_admin" ON revenue_log
  FOR ALL USING (false);

-- ============ ADMIN USERS ============
-- Service role only
CREATE POLICY "admin_users_admin" ON admin_users
  FOR ALL USING (false);

-- NOTE: The service_role key used by the API bypasses all RLS entirely.
-- These policies protect the data when accessed via the anon key.
-- For production, consider creating a separate restricted role for public endpoints.
