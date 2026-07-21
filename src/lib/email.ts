import nodemailer from "nodemailer"

const getTransport = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com"
  const port = parseInt(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function siteUrl() {
  return process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

export async function sendOrderConfirmation(order: any, orderNumber: string) {
  const transport = getTransport()
  if (!transport) return

  const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER

  const itemsHtml = (order.order_items || [])
    .map((i: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e1e3e3;">${i.product_name}</td><td style="padding:8px;border-bottom:1px solid #e1e3e3;text-align:center;">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #e1e3e3;text-align:right;">PKR ${i.unit_price}</td><td style="padding:8px;border-bottom:1px solid #e1e3e3;text-align:right;">PKR ${i.total_price}</td></tr>`)
    .join("")

  const address = order.shipping_address || {}
  const total = order.total || 0

  const html = `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#191c1c;max-width:600px;margin:auto;padding:20px;">
  <div style="border-bottom:2px solid #3f625f;padding-bottom:16px;margin-bottom:24px;">
    <h1 style="color:#3f625f;font-size:24px;margin:0;">NISA DENTAL</h1>
    <p style="color:#717977;margin:4px 0 0;">Order Confirmation</p>
  </div>
  <p style="font-size:16px;">Hi <strong>${order.customer_name}</strong>,</p>
  <p>Your order <strong style="color:#3f625f;">${orderNumber}</strong> has been placed successfully!</p>
  <p style="color:#717977;">We'll confirm it shortly. Track your order here:</p>
  <p style="text-align:center;margin:24px 0;">
    <a href="${siteUrl()}/track/${orderNumber}" style="background:#3f625f;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">Track Order</a>
  </p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <thead><tr style="background:#f3f4f4;"><th style="padding:8px;text-align:left;font-size:12px;text-transform:uppercase;color:#717977;">Item</th><th style="padding:8px;text-align:center;font-size:12px;text-transform:uppercase;color:#717977;">Qty</th><th style="padding:8px;text-align:right;font-size:12px;text-transform:uppercase;color:#717977;">Price</th><th style="padding:8px;text-align:right;font-size:12px;text-transform:uppercase;color:#717977;">Total</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div style="border-top:2px solid #3f625f;padding-top:12px;text-align:right;font-size:16px;font-weight:bold;color:#3f625f;">Total: PKR ${total}</div>
  ${address.line1 ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e1e3e3;"><p style="font-weight:600;margin:0 0 4px;">Shipping To:</p><p style="color:#717977;margin:0;">${address.line1}<br/>${address.city || ''}, ${address.state || ''} ${address.zip || ''}</p></div>` : ''}
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e1e3e3;text-align:center;color:#717977;font-size:12px;">
    <p>NISA DENTAL CLINIC — Premium Oral Healthcare</p>
  </div>
</body></html>`

  // Send to customer
  if (order.customer_email) {
    try {
      await transport.sendMail({
        from: `"Nisa Dental" <${process.env.SMTP_USER}>`,
        to: order.customer_email,
        subject: `Order Confirmed — ${orderNumber}`,
        html,
      })
    } catch (e) {
      console.error("Failed to send customer email:", e)
    }
  }

  // Send to admin
  if (adminEmail && adminEmail !== order.customer_email) {
    try {
      await transport.sendMail({
        from: `"Nisa Dental" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Order — ${orderNumber}`,
        html: html.replace("Order Confirmation", "New Order Received"),
      })
    } catch (e) {
      console.error("Failed to send admin email:", e)
    }
  }
}

export async function sendOrderStatusUpdate(order: any, orderNumber: string, oldStatus: string, newStatus: string) {
  const transport = getTransport()
  if (!transport || !order.customer_email) return

  const statusLabels: Record<string, string> = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    requested_return: "Return Requested",
  }

  const html = `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#191c1c;max-width:600px;margin:auto;padding:20px;">
  <div style="border-bottom:2px solid #3f625f;padding-bottom:16px;margin-bottom:24px;">
    <h1 style="color:#3f625f;font-size:24px;margin:0;">NISA DENTAL</h1>
    <p style="color:#717977;margin:4px 0 0;">Order Update</p>
  </div>
  <p style="font-size:16px;">Hi <strong>${order.customer_name}</strong>,</p>
  <p>Your order <strong style="color:#3f625f;">${orderNumber}</strong> status has been updated.</p>
  <p style="text-align:center;margin:24px 0;">
    <span style="color:#717977;">${statusLabels[oldStatus] || oldStatus}</span>
    <span style="margin:0 12px;color:#3f625f;">→</span>
    <span style="font-weight:bold;color:#3f625f;font-size:18px;">${statusLabels[newStatus] || newStatus}</span>
  </p>
  <p style="text-align:center;margin:24px 0;">
    <a href="${siteUrl()}/track/${orderNumber}" style="background:#3f625f;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;">View Order</a>
  </p>
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e1e3e3;text-align:center;color:#717977;font-size:12px;">
    <p>NISA DENTAL CLINIC — Premium Oral Healthcare</p>
  </div>
</body></html>`

  try {
    await transport.sendMail({
      from: `"Nisa Dental" <${process.env.SMTP_USER}>`,
      to: order.customer_email,
      subject: `Order ${statusLabels[newStatus] || newStatus} — ${orderNumber}`,
      html,
    })
  } catch (e) {
    console.error("Failed to send status update email:", e)
  }
}

export async function sendAppointmentConfirmation(appointment: any) {
  const transport = getTransport()
  if (!transport) return

  const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER

  const html = `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#191c1c;max-width:600px;margin:auto;padding:20px;">
  <div style="border-bottom:2px solid #3f625f;padding-bottom:16px;margin-bottom:24px;">
    <h1 style="color:#3f625f;font-size:24px;margin:0;">NISA DENTAL</h1>
    <p style="color:#717977;margin:4px 0 0;">Appointment Request</p>
  </div>
  <p style="font-size:16px;">Hi <strong>${appointment.patient_name}</strong>,</p>
  <p>Your appointment request has been received!</p>
  <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}<br/>
  <strong>Time:</strong> ${appointment.appointment_time?.slice(0, 5)}</p>
  <p style="color:#717977;">We will review your request and confirm your appointment within 24 hours. You will receive a confirmation email once it's approved.</p>
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e1e3e3;text-align:center;color:#717977;font-size:12px;">
    <p>NISA DENTAL CLINIC — Premium Oral Healthcare</p>
  </div>
</body></html>`

  if (appointment.patient_email) {
    try {
      await transport.sendMail({
        from: `"Nisa Dental" <${process.env.SMTP_USER}>`,
        to: appointment.patient_email,
        subject: "Appointment Request Received — Nisa Dental",
        html,
      })
    } catch (e) {
      console.error("Failed to send appointment email to customer:", e)
    }
  }

  if (adminEmail) {
    try {
      await transport.sendMail({
        from: `"Nisa Dental" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Appointment — ${appointment.patient_name}`,
        html: html.replace("Appointment Request", "New Appointment Request"),
      })
    } catch (e) {
      console.error("Failed to send appointment email to admin:", e)
    }
  }
}
