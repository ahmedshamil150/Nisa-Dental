"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { AddToCartButton } from "@/components/shop/AddToCartButton"

function calcPrice(product: any) {
  const price = Number(product?.price) || 0
  const percent = Number(product?.discount_percent) || 0
  if (percent > 0) {
    const sale = price * (100 - percent) / 100
    return { original: price, sale: Math.round(sale), percent }
  }
  return { original: price, sale: null, percent: 0 }
}

export function FeaturedProducts({ products }: { products: any[] }) {
  const items = (Array.isArray(products) ? products : []).filter((p) => p && typeof p === "object")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  if (items.length === 0) return null

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 10)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10)
  }

  function scroll(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-section-gap overflow-hidden">
      <div className="max-w-container-max mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Featured Products</h2>
            <p className="text-on-surface-variant">Handpicked essentials for your practice and patients.</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-1 text-primary font-label-md text-label-md hover:underline">
            View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="relative group/carousel">
          {!atStart && (
            <button onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-surface shadow-md border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll products left">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
          )}

          <div ref={scrollRef} onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
            style={{ scrollbarWidth: "none" }}>
            {items.map((product: any) => {
              const price = calcPrice(product)
              return (
                <div key={product.id}
                  className="flex-shrink-0 w-[260px] snap-start bg-surface border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                  <Link href={`/shop/${product.slug}`} className="block aspect-square overflow-hidden bg-surface-container relative">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill sizes="260px" className="object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[50px] text-outline-variant/50">inventory_2</span>
                      </div>
                    )}
                    {price.percent > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{price.percent}%</span>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-label-md text-label-md text-on-surface mb-1 line-clamp-1">{product.name}</h3>
                    </Link>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div>
                        {price.sale ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-on-surface-variant line-through">{price.original.toLocaleString()}</span>
                            <span className="font-headline-md text-headline-md text-primary">{price.sale.toLocaleString()}</span>
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

          {!atEnd && (
            <button onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-surface shadow-md border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all opacity-0 group-hover/carousel:opacity-100"
              aria-label="Scroll products right">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          )}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/shop" className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline">
            View All Products <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
