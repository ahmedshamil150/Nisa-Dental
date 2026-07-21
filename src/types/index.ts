export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'customer' | 'admin' | 'staff'
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  icon: string | null
  image_url: string | null
  price: number | null
  duration_minutes: number | null
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  patient_name: string
  patient_title: string | null
  patient_image: string | null
  content: string
  rating: number
  is_featured: boolean
  is_approved: boolean
  created_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  short_description: string | null
  features: string[]
  specifications: Record<string, any>
  price: number
  sale_price: number | null
  stock_quantity: number
  sku: string | null
  image_url: string | null
  image_urls: string[]
  manufacturer: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ProductCategory
}

export interface TeamMember {
  id: string
  name: string
  title: string | null
  bio: string | null
  image_url: string | null
  specialties: string[]
  education: string[]
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Appointment {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string | null
  service_id: string | null
  appointment_date: string
  appointment_time: string
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  service?: Service
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: Record<string, any>
  billing_address: Record<string, any>
  payment_method: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  shipping_cost: number
  total: number
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  updated_at: string
}

export interface Cart {
  id: string
  session_id: string | null
  user_id: string | null
  created_at: string
  updated_at: string
  items?: CartItem[]
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}
