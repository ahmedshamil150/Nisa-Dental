import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { AddToCartButton } from "@/components/shop/AddToCartButton"

const PAGE_SIZE = 9

async function getCategories() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("product_categories").select("*").eq("is_active", true).order("sort_order")
  return data || []
}

function buildUrl(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  const all = { ...params }
  Object.entries(all).forEach(([k, v]) => { if (v) sp.set(k, v) })
  const qs = sp.toString()
  return `/shop${qs ? `?${qs}` : ""}`
}

async function getProducts(searchParams: { category?: string; search?: string; sort?: string; discounted?: string; page?: string }) {
  const sb = getSupabase()
  if (!sb) return { products: [], totalPages: 1 }
  const page = Math.max(1, parseInt(searchParams.page || "1"))
  const offset = (page - 1) * PAGE_SIZE

  let query = sb.from("products").select("*, category:product_categories(*)", { count: "exact" }).eq("is_active", true)

  if (searchParams.category) {
    query = query.eq("category:product_categories.slug", searchParams.category)
  }
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }
  if (searchParams.discounted === "true") {
    query = query.gt("discount_percent", 0)
  }

  if (searchParams.sort === "price_asc") {
    query = query.order("price", { ascending: true })
  } else if (searchParams.sort === "price_desc") {
    query = query.order("price", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1)
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  return { products: (data || []) as any[], totalPages }
}

function calcPrice(product: any) {
  if (product.discount_percent > 0) {
    const sale = product.price * (100 - product.discount_percent) / 100
    return { original: product.price, sale: Math.round(sale), percent: product.discount_percent }
  }
  return { original: product.price, sale: null, percent: 0 }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; search?: string; sort?: string; discounted?: string; page?: string }> }) {
  const params = await searchParams
  const [categories, { products, totalPages = 1 }] = await Promise.all([getCategories(), getProducts(params)])
  const currentPage = Math.max(1, parseInt(params.page || "1"))

  function PageLink({ p }: { p: number }) {
    return (
      <Link href={buildUrl({ ...params, page: String(p) })}
        className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md text-label-md transition-all ${
          p === currentPage
            ? "bg-primary text-on-primary shadow-sm"
            : "hover:bg-surface-container text-on-surface-variant border border-outline-variant"
        }`}>
        {p}
      </Link>
    )
  }

  return (
    <>
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

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter">
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-6">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className={`flex items-center gap-3 group ${!params.category && !params.search && !params.sort && !params.discounted ? "font-bold text-primary" : ""}`}>
                  <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${!params.category ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                    {!params.category && <span className="w-2 h-2 rounded-sm bg-white" />}
                  </span>
                  <span className="font-body-md text-on-surface group-hover:text-primary transition-colors">All Products</span>
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link href={buildUrl({ ...params, category: cat.slug })} className={`flex items-center gap-3 group ${params.category === cat.slug ? "font-bold text-primary" : ""}`}>
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

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-outline-variant/30 pb-4">
            <span className="font-body-md text-on-surface-variant whitespace-nowrap">Showing {products.length} products</span>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <form action="/shop" method="GET" className="relative flex-1 sm:flex-none">
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {params.sort && <input type="hidden" name="sort" value={params.sort} />}
                {params.discounted && <input type="hidden" name="discounted" value={params.discounted} />}
                {params.page && <input type="hidden" name="page" value={params.page} />}
                <input name="search" defaultValue={params.search} placeholder="Search products..."
                  className="w-full sm:w-52 rounded-lg border border-outline-variant bg-surface px-4 py-2 pl-10 font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
              </form>

              <div className="flex items-center gap-3">
                <Link href={buildUrl({ ...params, discounted: params.discounted === "true" ? undefined : "true" })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-label-md transition-all ${
                    params.discounted === "true"
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}>
                  <span className="material-symbols-outlined text-[16px]">local_offer</span>
                  Discounted
                </Link>

                <div className="relative">
                  <select value={params.sort || ""} onChange={(e) => {
                    const v = e.target.value
                    window.location.href = buildUrl({ ...params, sort: v || undefined })
                  }}
                    className="appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-2 pr-8 font-body-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                    <option value="">Sort: Latest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">unfold_more</span>
                </div>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-outline-variant/30 rounded-xl">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">inventory_2</span>
              <p className="font-body-md text-on-surface-variant mt-4">No products found</p>
              <Link href="/shop" className="mt-4 inline-block text-primary font-label-md text-label-md hover:underline">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const price = calcPrice(product)
                return (
                  <div key={product.id} className="group relative bg-surface border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 duration-300">
                    <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden bg-surface-container">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-[60px] text-outline-variant/50">inventory_2</span>
                        </div>
                      )}
                      {product.image_urls?.[1] && (
                        <img src={product.image_urls[1]} alt="" className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}
                      {price.percent > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white font-label-md text-[11px] px-2.5 py-1 rounded-full font-bold">
                          -{price.percent}%
                        </span>
                      )}
                      {product.is_featured && !price.percent && (
                        <span className="absolute top-3 left-3 bg-primary/90 text-on-primary font-label-md text-[11px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">
                          Bestseller
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-col flex-grow p-5">
                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-1 line-clamp-1">{product.name}</h3>
                      </Link>
                      <p className="text-caption font-caption text-on-surface-variant mb-3 uppercase tracking-widest">{product.category?.name || "Product"}</p>
                      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4 text-sm">{product.short_description}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/20">
                        <div>
                          {price.sale ? (
                            <div className="flex items-baseline gap-2">
                              <span className="font-headline-md text-headline-md text-primary">PKR {price.sale}</span>
                              <span className="font-body-md text-body-md text-on-surface-variant line-through text-sm">PKR {price.original}</span>
                            </div>
                          ) : (
                            <span className="font-headline-md text-headline-md text-primary">PKR {product.price}</span>
                          )}
                        </div>
                        <AddToCartButton product={product} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {currentPage > 1 && (
                <Link href={buildUrl({ ...params, page: String(currentPage - 1) })}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageLink key={p} p={p} />
              ))}
              {currentPage < totalPages && (
                <Link href={buildUrl({ ...params, page: String(currentPage + 1) })}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
