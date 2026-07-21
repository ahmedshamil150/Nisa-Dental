"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params?.id) {
      router.replace(`/track/${params.id}`)
    }
  }, [params?.id, router])

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
      <p className="font-body-lg text-on-surface-variant">Redirecting to order tracking...</p>
    </div>
  )
}
