import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase"
import { AddToCartLargeButton } from "@/components/shop/AddToCartLargeButton"
import { ProductImageCarousel } from "@/components/shop/ProductImageCarousel"
import { ProductReviews } from "@/components/shop/ProductReviews"

async function getProduct(slug: string) {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.from("products").select("*, category:product_categories(*)").eq("slug", slug).eq("is_active", true).single()
  return data as any
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `${product.name} - available at Nisa Dental & Surgical`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || `${product.name} - available at Nisa Dental & Surgical`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const discount = product.discount_percent || 0
  const salePrice = discount > 0 ? Math.round(product.price * (100 - discount) / 100) : null

  const images = [product.image_url, ...(product.image_urls || [])].filter(Boolean) as string[]

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-primary mb-8">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Shop
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        <ProductImageCarousel images={images} productName={product.name} discount={discount} />

        <div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: images,
            sku: product.sku || product.id,
            brand: product.manufacturer ? { "@type": "Brand", name: product.manufacturer } : undefined,
            offers: {
              "@type": "Offer",
              price: salePrice || product.price,
              priceCurrency: "PKR",
              availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `https://nisa-dental.vercel.app/shop/${product.slug}`,
            },
          })}} />
          <p className="text-caption font-caption text-on-surface-variant uppercase tracking-widest mb-2">{product.category?.name || "Product"}</p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            {salePrice ? (
              <>
                <span className="font-headline-xl text-headline-xl text-primary">PKR {salePrice}</span>
                <span className="text-headline-md text-on-surface-variant line-through">PKR {product.price}</span>
              </>
            ) : (
              <span className="font-headline-xl text-headline-xl text-primary">PKR {product.price}</span>
            )}
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant mb-6">{product.description}</p>

          {product.sku && <p className="text-caption text-on-surface-variant mb-2">SKU: {product.sku}</p>}
          {product.manufacturer && <p className="text-caption text-on-surface-variant mb-4">Manufacturer: {product.manufacturer}</p>}

          <div className="flex items-center gap-4 mb-8">
            <span className={`inline-flex items-center gap-1.5 font-label-md text-label-md ${product.stock_quantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
              <span className="material-symbols-outlined text-[18px]">{product.stock_quantity > 0 ? 'check_circle' : 'cancel'}</span>
              {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} units)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock_quantity > 0 && <AddToCartLargeButton product={product} />}
          <Link href="/shop" className="block w-full border border-primary text-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/5 active:scale-95 transition-all text-center">
            Continue Shopping
          </Link>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  )
}
