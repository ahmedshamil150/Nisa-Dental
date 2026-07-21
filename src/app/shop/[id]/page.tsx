import { notFound } from "next/navigation"
import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, ShoppingCart, Check, Package } from "lucide-react"

async function getProduct(slug: string) {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.from("products")
    .select("*, category:product_categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  return data as any
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-gray-50 flex items-center justify-center">
            <div className="text-8xl text-gray-300">🛒</div>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-teal-600">
              {product.category?.name || "Product"}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-teal-600">
                ${product.sale_price || product.price}
              </span>
              {product.sale_price && (
                <span className="text-lg text-gray-400 line-through">${product.price}</span>
              )}
            </div>

            {product.sku && (
              <p className="mt-2 text-sm text-gray-500">SKU: {product.sku}</p>
            )}

            <div className="mt-6 space-y-3">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">Features</h3>
                <ul className="mt-2 space-y-2">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm">
                {product.stock_quantity > 0 ? (
                  <>
                    <Package className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">In Stock</span>
                    <span className="text-gray-400">({product.stock_quantity} units)</span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {product.manufacturer && (
              <p className="mt-4 text-xs text-gray-400">Manufacturer: {product.manufacturer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
