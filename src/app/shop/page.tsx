import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { AddToCartButton } from "@/components/shop/AddToCartButton"

async function getCategories() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("product_categories").select("*").eq("is_active", true).order("sort_order")
  return data || []
}

async function getProducts(searchParams: { category?: string; search?: string }) {
  const sb = getSupabase()
  if (!sb) return []
  let query = sb.from("products").select("*, category:product_categories(*)").eq("is_active", true)

  if (searchParams.category) {
    query = query.eq("category:product_categories.slug", searchParams.category)
  }
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }

  const { data } = await query.order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const [categories, products] = await Promise.all([getCategories(), getProducts(params)])

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[353px] flex items-center overflow-hidden bg-primary-container">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full opacity-40 bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80')"
          }} />
        </div>
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <h1 className="font-headline-xl text-headline-xl text-on-primary-container max-w-2xl">Elevate Your Daily Ritual</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container/80 mt-4 max-w-lg">
            Curated professional-grade dental care products recommended by our clinical experts for a healthier smile at home.
          </p>
        </div>
      </section>

      {/* Shop Container */}
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-6">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="flex items-center gap-3 cursor-pointer group">
                  <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${!params.category ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                    {!params.category && <span className="w-2 h-2 rounded-sm bg-white" />}
                  </span>
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">All Products</span>
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={`/shop?category=${cat.slug}`} className="flex items-center gap-3 cursor-pointer group">
                    <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${params.category === cat.slug ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                      {params.category === cat.slug && <span className="w-2 h-2 rounded-sm bg-white" />}
                    </span>
                    <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-surface-container-low border border-outline-variant/30">
            <h4 className="font-label-md text-label-md text-primary mb-2">Expert Advice</h4>
            <p className="text-caption font-caption text-on-surface-variant">Not sure what&apos;s right for you? Consult with our dentists during your next visit or chat with us online.</p>
            <Link href="/appointment" className="mt-4 text-primary font-label-md text-label-md flex items-center gap-2 hover:gap-3 transition-all">
              Chat Now <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant/30 pb-4">
            <span className="font-body-md text-on-surface-variant">Showing {products.length} products</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-outline-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">inventory_2</span>
              <p className="font-body-md text-on-surface-variant mt-4">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <div key={product.id} className="group relative bg-white border border-outline-variant/30 p-6 flex flex-col transition-all hover:shadow-lg hover:shadow-primary/5">
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative aspect-square mb-6 overflow-hidden bg-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-[60px] text-outline-variant/50">inventory_2</span>
                    </div>
                  </Link>
                  {product.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-white font-label-md text-[10px] px-2 py-1 uppercase tracking-tighter">Bestseller</span>
                    </div>
                  )}
                  <div className="flex-grow">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-caption font-caption text-on-surface-variant mb-4 uppercase tracking-widest">{product.category?.name || "Product"}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{product.short_description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">${product.sale_price || product.price}</span>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-label-md text-label-md">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors font-label-md text-label-md">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors font-label-md text-label-md">3</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
