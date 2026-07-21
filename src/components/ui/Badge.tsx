import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-surface-variant text-on-surface-variant": variant === "default",
          "bg-secondary-container text-on-secondary-container": variant === "success",
          "bg-error-container text-on-error-container": variant === "warning",
          "bg-error-container text-on-error": variant === "danger",
          "bg-primary-fixed text-on-primary-fixed": variant === "info",
        },
        className
      )}
      {...props}
    />
  )
}
