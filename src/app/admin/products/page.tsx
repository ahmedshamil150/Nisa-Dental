import { getSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

async function getProducts() {
  const sb = getSupabase()
  if (!sb) return []
  const { data } = await sb.from("products").select("*, category:product_categories(*)").order("created_at", { ascending: false })
  return (data || []) as any[]
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/api/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Featured</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.category?.name || "-"}</td>
                  <td className="px-6 py-4">${p.sale_price || p.price}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.stock_quantity > 0 ? "success" : "danger"}>
                      {p.stock_quantity}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.sku || "-"}</td>
                  <td className="px-6 py-4">{p.is_featured ? <Badge variant="success">Yes</Badge> : "No"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.is_active ? "success" : "danger"}>
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
