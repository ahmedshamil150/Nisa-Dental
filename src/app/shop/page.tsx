import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Search, Filter } from "lucide-react"

async function getCategories() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  return data || []
}

async function getProducts(searchParams: { category?: string; search?: string }) {
  const sb = getSupabase()
  if (!sb) return []
  let query = sb.from("products")
    .select("*, category:product_categories(*)")
    .eq("is_active", true)

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
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(params),
  ])

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Surgical Products</h1>
          <p className="mt-2 text-gray-600">
            Premium quality surgical and dental supplies for your practice
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-xl border bg-white p-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">Categories</span>
              </div>
              <nav className="mt-3 space-y-1">
                <Link
                  href="/shop"
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    !params.category
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Products
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      params.category === cat.slug
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-6">
              <form className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={params.search || ""}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </form>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed p-16 text-center">
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: any) => (
                  <Link key={product.id} href={`/shop/${product.slug}`}>
                    <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-teal-200">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center">
                        <div className="text-5xl text-gray-300">🛒</div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-teal-600">
                          {product.category?.name || "Product"}
                        </p>
                        <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {product.short_description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-lg font-bold text-teal-600">
                            ${product.sale_price || product.price}
                          </span>
                          {product.sale_price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        {product.stock_quantity > 0 ? (
                          <p className="mt-2 text-xs text-green-600">In Stock</p>
                        ) : (
                          <p className="mt-2 text-xs text-red-500">Out of Stock</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
