-- Nisa Dental & Surgical - Complete Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ==============================
-- PROFILES (extends auth.users)
-- ==============================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'staff')),
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- SERVICES (dental treatments)
-- ==============================
create table public.services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  icon text,
  image_url text,
  price decimal(10,2),
  duration_minutes int,
  is_featured boolean default false,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- TESTIMONIALS (patient reviews)
-- ==============================
create table public.testimonials (
  id uuid default gen_random_uuid() primary key,
  patient_name text not null,
  patient_title text,
  patient_image text,
  content text not null,
  rating int default 5 check (rating >= 1 and rating <= 5),
  is_featured boolean default false,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- ==============================
-- PRODUCT CATEGORIES
-- ==============================
create table public.product_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ==============================
-- PRODUCTS (surgical/dental products)
-- ==============================
create table public.products (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  features text[] default '{}',
  specifications jsonb default '{}',
  price decimal(10,2) not null,
  sale_price decimal(10,2),
  stock_quantity int default 0,
  sku text,
  image_url text,
  image_urls text[] default '{}',
  manufacturer text,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- TEAM MEMBERS (doctors/staff)
-- ==============================
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  title text,
  bio text,
  image_url text,
  specialties text[] default '{}',
  education text[] default '{}',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ==============================
-- APPOINTMENTS
-- ==============================
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  patient_name text not null,
  patient_email text not null,
  patient_phone text,
  service_id uuid references public.services(id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- ==============================
-- ORDERS
-- ==============================
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb default '{}',
  billing_address jsonb default '{}',
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending' check (order_status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) default 0,
  tax decimal(10,2) default 0,
  shipping_cost decimal(10,2) default 0,
  total decimal(10,2) default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ==============================
-- ORDER ITEMS
-- ==============================
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  quantity int not null default 1,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  created_at timestamptz default now()
);

-- ==============================
-- CONTACT MESSAGES
-- ==============================
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ==============================
-- SITE SETTINGS (key-value)
-- ==============================
create table public.site_settings (
  id uuid default gen_random_uuid() primary key,
  key text not null unique,
  value jsonb default '{}',
  updated_at timestamptz default now()
);

-- ==============================
-- CARTS (for guest/ecommerce)
-- ==============================
create table public.carts (
  id uuid default gen_random_uuid() primary key,
  session_id text,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  cart_id uuid references public.carts(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity int not null default 1,
  created_at timestamptz default now()
);

-- ==============================
-- INDEXES
-- ==============================
create index idx_products_category on public.products(category_id);
create index idx_products_active on public.products(is_active);
create index idx_products_featured on public.products(is_featured);
create index idx_services_active on public.services(is_active);
create index idx_services_featured on public.services(is_featured);
create index idx_appointments_date on public.appointments(appointment_date);
create index idx_appointments_status on public.appointments(status);
create index idx_orders_status on public.orders(order_status);
create index idx_contacts_read on public.contacts(is_read);

-- ==============================
-- ROW LEVEL SECURITY
-- ==============================
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.team_members enable row level security;
alter table public.appointments enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contacts enable row level security;
alter table public.site_settings enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

-- Public read policies
create policy "Public can view active services" on public.services for select using (is_active = true);
create policy "Public can view approved testimonials" on public.testimonials for select using (is_approved = true);
create policy "Public can view active categories" on public.product_categories for select using (is_active = true);
create policy "Public can view active products" on public.products for select using (is_active = true);
create policy "Public can view active team members" on public.team_members for select using (is_active = true);
create policy "Public can view site settings" on public.site_settings for select using (true);

-- Admin full access policies
create policy "Admin all on services" on public.services for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on testimonials" on public.testimonials for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on categories" on public.product_categories for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on products" on public.products for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on team" on public.team_members for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on appointments" on public.appointments for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on orders" on public.orders for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on order_items" on public.order_items for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on contacts" on public.contacts for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on settings" on public.site_settings for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on carts" on public.carts for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "Admin all on cart_items" on public.cart_items for all using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Appointments: users can insert their own
create policy "Anyone can book appointment" on public.appointments for insert with check (true);
create policy "Customers can view own appointments" on public.appointments for select using (patient_email = auth.email());

-- Contacts: anyone can submit
create policy "Anyone can submit contact" on public.contacts for insert with check (true);

-- Orders: customers can view own
create policy "Customers can view own orders" on public.orders for select using (customer_email = auth.email());
create policy "Customers can insert own orders" on public.orders for insert with check (customer_email = auth.email());

-- Profiles: users can view/edit own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ==============================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ==============================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'customer'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================
-- SEED DATA
-- ==============================
-- Default site settings
insert into public.site_settings (key, value) values
  ('clinic_name', '"Nisa Dental & Surgical"'),
  ('clinic_tagline', '"Your Smile, Our Priority"'),
  ('clinic_phone', '"+1 (555) 123-4567"'),
  ('clinic_email', '"info@nisadental.com"'),
  ('clinic_address', '"123 Medical Center Drive, Suite 100"'),
  ('clinic_city', '"New York"'),
  ('clinic_state', '"NY"'),
  ('clinic_zip', '"10001"'),
  ('clinic_hours', '"Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 2:00 PM"'),
  ('social_facebook', '"https://facebook.com/nisadental"'),
  ('social_instagram', '"https://instagram.com/nisadental"'),
  ('social_twitter', '"https://twitter.com/nisadental"'),
  ('about_us', '"At Nisa Dental & Surgical, we combine advanced dental care with premium surgical products. Our clinic offers a full range of dental services using state-of-the-art technology, while our online store provides high-quality surgical supplies for medical professionals."'),
  ('hero_title', '"Advanced Dental Care & Surgical Supplies"'),
  ('hero_subtitle', '"Professional dental services and premium surgical products for your practice."');

-- Sample services
insert into public.services (name, slug, description, short_description, icon, price, duration_minutes, is_featured, sort_order) values
  ('General Dentistry', 'general-dentistry', 'Comprehensive dental exams, cleanings, and preventive care to maintain optimal oral health.', 'Regular checkups & cleanings', 'Tooth', 150.00, 60, true, 1),
  ('Cosmetic Dentistry', 'cosmetic-dentistry', 'Enhance your smile with veneers, bonding, and whitening treatments.', 'Smile makeovers & whitening', 'Sparkles', 300.00, 90, true, 2),
  ('Orthodontics', 'orthodontics', 'Straighten teeth with traditional braces or clear aligners for a perfect smile.', 'Braces & aligners', 'ArrowBigRightDash', 2500.00, 30, true, 3),
  ('Oral Surgery', 'oral-surgery', 'Professional surgical procedures including wisdom teeth removal and implants.', 'Extractions & implants', 'Syringe', 800.00, 120, true, 4),
  ('Pediatric Dentistry', 'pediatric-dentistry', 'Gentle, kid-friendly dental care designed for children of all ages.', 'Children''s dental care', 'Baby', 120.00, 45, false, 5),
  ('Periodontics', 'periodontics', 'Treatment of gum disease and soft tissue management for healthier gums.', 'Gum disease treatment', 'Heart', 200.00, 60, false, 6);

-- Sample product categories
insert into public.product_categories (name, slug, description, sort_order) values
  ('Surgical Instruments', 'surgical-instruments', 'High-quality surgical instruments for medical procedures', 1),
  ('Dental Equipment', 'dental-equipment', 'Professional dental equipment and tools', 2),
  ('Disposables', 'disposables', 'Single-use medical disposables and supplies', 3),
  ('Sterilization', 'sterilization', 'Sterilization equipment and supplies', 4),
  ('Diagnostic Tools', 'diagnostic-tools', 'Diagnostic instruments and examination tools', 5);

-- Sample products
insert into public.products (category_id, name, slug, description, short_description, price, stock_quantity, sku, manufacturer, is_featured) values
  ((select id from public.product_categories where slug = 'surgical-instruments'), 'Surgical Scalpel Set', 'surgical-scalpel-set', 'Premium stainless steel surgical scalpel set with interchangeable blades. Includes 6 handles and 50 blades in various sizes.', 'Complete scalpel set with 6 handles & 50 blades', 89.99, 50, 'SURG-SCLP-001', 'MedPro', true),
  ((select id from public.product_categories where slug = 'surgical-instruments'), 'Tissue Forceps', 'tissue-forceps', 'High-precision tissue forceps with serrated tips for secure grip during surgical procedures.', 'Precision tissue forceps, serrated tip', 34.99, 100, 'SURG-FRCP-001', 'SurgiTech', true),
  ((select id from public.product_categories where slug = 'dental-equipment'), 'Dental Chair Unit', 'dental-chair-unit', 'Modern dental chair with integrated delivery system, LED light, and ergonomic design.', 'Complete dental chair with LED light', 4500.00, 5, 'DENT-CHR-001', 'DentalPro', true),
  ((select id from public.product_categories where slug = 'dental-equipment'), 'Autoclave Sterilizer', 'autoclave-sterilizer', 'Class B autoclave sterilizer with digital display and automatic cycle control. Capacity: 23L.', '23L Class B autoclave, digital control', 1200.00, 10, 'STER-ATCL-001', 'SteriMaster', true),
  ((select id from public.product_categories where slug = 'disposables'), 'Surgical Gloves (Box)', 'surgical-gloves-box', 'Latex-free surgical gloves, powder-free. Box of 100 pairs. Sizes: S, M, L, XL.', 'Latex-free surgical gloves, 100 pairs/box', 24.99, 500, 'DISP-GLV-001', 'SafeHands', true),
  ((select id from public.product_categories where slug = 'disposables'), 'Face Masks (50pk)', 'face-masks-50pk', 'Level 3 surgical face masks with high fluid resistance. 3-ply with ear loops. Box of 50.', 'Level 3 surgical masks, 50-pack', 12.99, 1000, 'DISP-MSK-001', 'ShieldPro', true),
  ((select id from public.product_categories where slug = 'sterilization'), 'Sterilization Pouches (200pk)', 'sterilization-pouches', 'Self-sealing sterilization pouches with indicator. Size: 7" x 13". Pack of 200.', 'Self-sealing sterilization pouches, 200-pack', 29.99, 200, 'STER-PCH-001', 'SteriGuard', false),
  ((select id from public.product_categories where slug = 'diagnostic-tools'), 'Dental Explorer Set', 'dental-explorer-set', 'Set of 6 dental explorers with different tip configurations for diagnostic examination.', '6-piece dental explorer set', 45.99, 75, 'DIAG-EXP-001', 'DiagnosTech', true);

-- Sample testimonials
insert into public.testimonials (patient_name, patient_title, content, rating, is_featured) values
  ('Sarah Johnson', 'Regular Patient', 'Absolutely love Nisa Dental! The team is incredibly professional and made my dental experience comfortable. My smile has never looked better.', 5, true),
  ('Michael Chen', 'New Patient', 'I was nervous about my root canal but the staff put me at ease immediately. State-of-the-art equipment and gentle care. Highly recommended!', 5, true),
  ('Emily Rodriguez', 'Orthodontics Patient', 'The clear aligners have transformed my smile in just 6 months. The digital scanning process was quick and painless. Thank you Nisa!', 5, true),
  ('David Kim', 'Surgery Patient', 'Wisdom teeth removal was smooth and recovery was faster than expected. The team provided excellent post-op care instructions.', 4, true),
  ('Lisa Thompson', 'Cosmetic Patient', 'My veneers look absolutely natural! Dr. Nisa took the time to match the shade perfectly. I smile with confidence now.', 5, false);

-- Sample team members
insert into public.team_members (name, title, bio, specialties, education, sort_order) values
  ('Dr. Aisha Nisa', 'Founder & Lead Dentist', 'Dr. Nisa has over 15 years of experience in dentistry and oral surgery. She is passionate about combining art and science to create beautiful smiles.', '{"Cosmetic Dentistry", "Oral Surgery", "Implants"}', '{"DDS - Columbia University", "Residency - NYU Langone"}', 1),
  ('Dr. James Wilson', 'Orthodontist', 'Dr. Wilson specializes in orthodontic treatments for both adults and children, with expertise in clear aligner therapy.', '{"Orthodontics", "Invisalign", "Pediatric"}', '{"DDS - UCLA", "Orthodontic Residency - USC"}', 2),
  ('Dr. Maria Santos', 'Periodontist', 'Dr. Santos is a board-certified periodontist specializing in gum disease treatment and dental implant placement.', '{"Periodontics", "Implants", "Gum Surgery"}', '{"DMD - Harvard", "Periodontal Residency - UPenn"}', 3),
  ('Nurse Sarah Miller', 'Head Nurse', 'Sarah ensures every patient feels comfortable and cared for. She manages our clinical operations with precision and warmth.', '{"Patient Care", "Surgery Assistance", "Sterilization"}', '{"RN - NYU", "Certified Dental Assistant"}', 4);
