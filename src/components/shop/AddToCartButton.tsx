"use client"

import { useCart } from "@/lib/cart-context"

export function AddToCartButton({ product }: { product: { id: string; name: string; price: number; slug: string; sale_price?: number; discount_percent?: number; weight?: number; stock_quantity?: number } }) {
  const { addItem } = useCart()
  const stock = product.stock_quantity ?? 99
  const weight = product.weight ?? 0
  const price = product.sale_price || product.price

  if (stock < 1) return null

  return (
    <button
      onClick={() => addItem({ id: product.id, name: product.name, price: +price, weight, stock_quantity: stock, slug: product.slug })}
      className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 active:scale-90 transition-all"
      title="Add to Cart"
    >
      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
    </button>
  )
}
