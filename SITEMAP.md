# Nisa Dental & Surgical - Website & Admin Map

## 🏥 Website Map (Public Pages)

```
/
├── Home (/)                          # Hero, Services, Stats, Featured Products, Testimonials, CTA
├── Services (/services)              # All dental services listing
├── Shop (/shop)                      # Surgical products with category/search filters
│   └── [slug] (/shop/:slug)          # Single product detail
├── Testimonials (/testimonials)      # Patient reviews
├── About (/about)                    # Clinic info, stats, team members
├── Contact (/contact)                # Contact form + clinic info
├── Appointment (/appointment)        # Booking form
├── Cart (/cart)                      # Shopping cart
└── Checkout (/checkout)              # Order checkout
```

## ⚙️ Admin Panel Map (`/admin/`)

```
/admin
├── Dashboard (/)                     # Stats overview (services, products, orders, appointments, messages)
├── Services (/services)              # CRUD dental services
├── Products (/products)              # CRUD surgical products
│   └── [id]                          # Edit product
├── Categories (/categories)          # CRUD product categories
├── Testimonials (/testimonials)      # Manage patient reviews
├── Orders (/orders)                  # View/manage orders
│   └── [id]                          # Order details
├── Appointments (/appointments)      # View/manage bookings
├── Team (/team)                      # CRUD team members
├── Messages (/messages)              # Contact form submissions
└── Settings (/settings)              # Site settings (key-value)
```

## 🗄️ Database Tables (Supabase/PostgreSQL)

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (linked to auth.users) |
| `services` | Dental treatments & services |
| `testimonials` | Patient reviews & ratings |
| `product_categories` | Product category tree |
| `products` | Surgical/dental products inventory |
| `team_members` | Doctor/staff profiles |
| `appointments` | Patient booking requests |
| `orders` | Customer orders |
| `order_items` | Individual line items per order |
| `contacts` | Contact form submissions |
| `site_settings` | Key-value configuration |
| `carts` | Shopping cart sessions |
| `cart_items` | Items in each cart |

## 🔐 Auth / RLS

- **Public** can read: active services, approved testimonials, active products/categories, team members
- **Anyone** can insert: appointments, contacts, orders
- **Admin** (role='admin') can CRUD everything
- **Users** can view/edit own profile
- Auto-creates profile row via `handle_new_user` trigger on signup

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Version Control:** GitHub

## 📝 Setup Steps

1. Create Supabase project and run the SQL migration
2. Copy `.env.local.example` to `.env.local` and fill in Supabase URL & anon key
3. Run `npm install`
4. Run `npm run dev`
5. Push to GitHub
6. Deploy on Vercel (add env vars in Vercel dashboard)
