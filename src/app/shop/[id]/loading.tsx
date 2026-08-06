import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <Skeleton className="h-5 w-32 mb-8" />

      <div className="grid gap-12 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />

        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4 mt-4" />
          <div className="flex items-baseline gap-3 mt-6">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-full mt-6" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-2" />
          <Skeleton className="h-5 w-40 mt-6" />
          <Skeleton className="h-14 w-full rounded-lg mt-8" />
          <Skeleton className="h-14 w-full rounded-lg mt-3" />
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-outline-variant/30">
        <Skeleton className="h-7 w-56" />
        <div className="space-y-6 mt-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full mt-3" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
