import type { Metadata } from "next"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export const metadata: Metadata = {
  title: "Admin Panel - Nisa Dental & Surgical",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 min-h-screen">
        <div className="p-4 md:p-6 pt-16 lg:pt-6">{children}</div>
      </div>
    </div>
  )
}
