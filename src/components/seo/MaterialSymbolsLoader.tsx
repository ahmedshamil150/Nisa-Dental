"use client"

import { useEffect } from "react"

export function MaterialSymbolsLoader() {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1&display=swap"
    document.head.appendChild(link)
  }, [])
  return null
}