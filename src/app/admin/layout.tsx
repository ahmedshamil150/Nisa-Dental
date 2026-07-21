import type { Metadata } from "next"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export const metadata: Metadata = {
  title: "Admin Panel - Nisa Dental & Surgical",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
