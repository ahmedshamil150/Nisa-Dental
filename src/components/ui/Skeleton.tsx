import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-surface-container-high", className)} {...props} />
}

export function SkeletonText({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4", className)} />
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-28 rounded-lg", className)} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return <Skeleton className={cn("h-40 rounded-xl", className)} />
}

export function SkeletonTable({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <tbody className="divide-y">
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-outline-variant/10">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-4">
              <Skeleton className={cn("h-4", c === 0 ? "w-8" : c === 1 ? "w-32" : "w-24")} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
