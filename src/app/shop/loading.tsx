import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative overflow-hidden bg-primary-container -mt-14 md:mt-0">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 py-16 md:py-20 pt-20 md:pt-20">
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full mt-4" />
        </div>
      </section>

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter">
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div>
            <Skeleton className="h-4 w-28" />
            <ul className="space-y-4 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-24" />
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-surface-container-low border border-outline-variant/30">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full mt-3" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-5 w-20 mt-4" />
          </div>
        </aside>

        <div className="flex-grow">
          <div className="hidden sm:flex items-center justify-between mb-8 border-b border-outline-variant/30 pb-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-56 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="group relative bg-surface border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="flex flex-col flex-grow p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-24 mt-2" />
                  <div className="mt-auto flex items-end justify-between pt-4 border-t border-outline-variant/20">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
