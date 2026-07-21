"use client"

import { useCart } from "@/lib/cart-context"

export function AddToCartLargeButton({ product }: { product: { id: string; name: string; price: number; slug: string; sale_price?: number } }) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ id: product.id, name: product.name, price: +(product.sale_price || product.price), slug: product.slug })}
      className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4"
    >
      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
      Add to Cart
    </button>
  )
}
