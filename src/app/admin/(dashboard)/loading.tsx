import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-outline-variant/30 bg-surface p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[380px] rounded-xl lg:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
