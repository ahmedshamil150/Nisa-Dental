"use client"

import { useCart } from "@/lib/cart-context"

export function AddToCartButton({ product }: { product: { id: string; name: string; price: number; slug: string; sale_price?: number } }) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem({ id: product.id, name: product.name, price: +(product.sale_price || product.price), slug: product.slug })}
      className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2"
    >
      Add to Cart <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
    </button>
  )
}
