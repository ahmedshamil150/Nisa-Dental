"use client"

import { useCart } from "@/lib/cart-context"
import { useToast } from "@/lib/toast-context"

export function AddToCartLargeButton({ product }: { product: { id: string; name: string; price: number; slug: string; sale_price?: number; discount_percent?: number; weight?: number; stock_quantity?: number } }) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const stock = product.stock_quantity ?? 99
  const weight = product.weight ?? 0
  const price = product.sale_price || product.price

  return (
    <button
      onClick={() => {
        addItem({ id: product.id, name: product.name, price: +price, weight, stock_quantity: stock, slug: product.slug })
        addToast(`${product.name} added to cart`)
      }}
      disabled={stock < 1}
      className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
      {stock > 0 ? "Add to Cart" : "Out of Stock"}
    </button>
  )
}
