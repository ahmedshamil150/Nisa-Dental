"use client"

import { useRef, useEffect, useState } from "react"

type Direction = "up" | "down" | "left" | "right" | "none"

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 30,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  distance?: number
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const dirMap: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }

  const d = dirMap[direction]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) translateY(0)"
          : `translateX(${d.x}px) translateY(${d.y}px)`,
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
