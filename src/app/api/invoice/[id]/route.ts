import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let invoice: any

  // Try as invoice ID first, then as order ID
  const { data: byInv } = await supabase.from("invoices").select("*, order:orders(*, order_items(*))").eq("id", id).maybeSingle()
  if (byInv) {
    invoice = byInv
  } else {
    const { data: byOrd } = await supabase.from("invoices").select("*, order:orders(*, order_items(*))").eq("order_id", id).maybeSingle()
    if (byOrd) invoice = byOrd
  }

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 })

  const inv = invoice as any
  const order = inv.order || {}
  const items = (order.order_items || []) as any[]

  const rows: string[][] = [
    ["Item", "Qty", "Unit Price", "Total"],
    ...items.map((item: any) => [
      item.product_name || "Product",
      String(item.quantity),
      `PKR ${item.unit_price}`,
      `PKR ${item.total_price}`,
    ]),
  ]

  const subtotal = inv.subtotal || order.subtotal || 0
  const delivery = inv.delivery_charge || order.shipping_cost || 0
  const tax = inv.tax_amount || order.tax || 0
  const discount = inv.discount_amount || 0
  const total = inv.total || order.total || 0

  const shortId = order.id?.toString().replace(/-/g, "").slice(0, 8).toUpperCase() || ""
  const orderNumber = "NISA-" + shortId

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Invoice ${inv.invoice_number}</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #191c1c; padding: 40px; max-width: 800px; margin: auto; }
  h1 { font-size: 28px; color: #3f625f; margin-bottom: 4px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e1e3e3; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { text-align: left; padding: 10px 8px; font-size: 12px; text-transform: uppercase; color: #717977; border-bottom: 1px solid #e1e3e3; }
  td { padding: 10px 8px; border-bottom: 1px solid #f3f4f4; }
  .totals { margin-left: auto; width: 300px; }
  .totals td { padding: 6px 8px; }
  .totals .final td { font-size: 18px; font-weight: bold; color: #3f625f; padding-top: 12px; border-top: 2px solid #3f625f; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e1e3e3; text-align: center; color: #717977; font-size: 12px; }
  .badge { display: inline-block; background: #d2e7e2; color: #0d1f1c; padding: 2px 10px; border-radius: 4px; font-size: 11px; text-transform: uppercase; }
</style></head><body>
  <div class="meta">
    <div>
      <h1>NISA DENTAL</h1>
      <p style="color:#717977;margin-top:4px;">123 Care Street, Suite 500<br/>Healthcare City, HC 12345</p>
    </div>
    <div style="text-align:right;">
      <p style="font-size:24px;font-weight:bold;color:#3f625f;">${inv.invoice_number}</p>
      <p style="color:#717977;">${new Date(inv.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
      <span class="badge">${inv.status}</span>
      <p style="color:#717977;margin-top:4px;">Order: ${orderNumber}</p>
    </div>
  </div>

  <div style="margin-bottom:30px;">
    <p style="font-weight:600;margin-bottom:4px;">Bill To:</p>
    <p style="color:#717977;">${order.customer_name || 'N/A'}<br/>${order.customer_email || ''}</p>
    ${order.shipping_address ? `<p style="color:#717977;">${order.shipping_address.line1 || ''}<br/>${order.shipping_address.city || ''}, ${order.shipping_address.state || ''} ${order.shipping_address.zip || ''}</p>` : ''}
  </div>

  <table>
    <thead><tr>${rows[0].map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>

  <table class="totals">
    <tr><td>Subtotal</td><td style="text-align:right;">PKR ${subtotal}</td></tr>
    <tr><td>Delivery</td><td style="text-align:right;">PKR ${delivery}</td></tr>
    <tr><td>Tax (${inv.tax_rate || 0}%)</td><td style="text-align:right;">PKR ${tax}</td></tr>
    ${discount > 0 ? `<tr><td>Discount</td><td style="text-align:right;color:#ba1a1a;">-PKR ${discount}</td></tr>` : ''}
    ${inv.coupon_code ? `<tr><td>Coupon</td><td style="text-align:right;">${inv.coupon_code}</td></tr>` : ''}
    <tr class="final"><td>Total</td><td style="text-align:right;">PKR ${total}</td></tr>
  </table>

  <div class="footer">
    <p>NISA DENTAL CLINIC &bull; Premium Oral Healthcare</p>
    <p>Thank you for your trust.</p>
  </div>
</body></html>`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="invoice-${inv.invoice_number}.html"`,
    },
  })
}
