"use client"

import { useCart } from "@/lib/cart-context"

export function AddToCartButton({ product }: { product: { id: string; name: string; price: number; slug: string; sale_price?: number; discount_percent?: number; weight?: number; stock_quantity?: number } }) {
  const { addItem } = useCart()
  const stock = product.stock_quantity ?? 99
  const weight = product.weight ?? 0
  const price = product.sale_price || product.price

  return (
    <button
      onClick={() => addItem({ id: product.id, name: product.name, price: +price, weight, stock_quantity: stock, slug: product.slug })}
      disabled={stock < 1}
      className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {stock > 0 ? <>Add to Cart <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span></> : "Out of Stock"}
    </button>
  )
}
