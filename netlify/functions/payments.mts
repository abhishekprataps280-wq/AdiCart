import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { payments, orders } from "../../db/schema.js";

const ok = (data: unknown, status = 200) =>
  Response.json({ success: true, data }, { status });

const fail = (message: string, status = 400) =>
  Response.json({ success: false, message }, { status });

const PAYMENT_METHODS = ["COD", "UPI", "Credit Card", "Debit Card", "NetBanking", "Wallet"];

export default async (req: Request, context: Context) => {
  const id = context.params.id ? parseInt(context.params.id, 10) : null;
  const pathname = new URL(req.url).pathname;

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    // GET /api/payment-methods
    if (req.method === "GET" && pathname === "/api/payment-methods") {
      return ok(PAYMENT_METHODS);
    }

    // GET /api/payments/:id
    if (req.method === "GET" && id) {
      const [payment] = await db.select().from(payments).where(eq(payments.id, id));
      if (!payment) return fail("Payment not found", 404);
      return ok(payment);
    }

    // POST /api/payments
    if (req.method === "POST") {
      const body = await req.json();
      const { orderId, method, amount, details } = body;

      const [order] = await db.select().from(orders).where(eq(orders.id, Number(orderId)));
      if (!order) return fail("Order not found", 404);
      if (!PAYMENT_METHODS.includes(method)) return fail("Invalid payment method");

      const paymentStatus = method === "COD" ? "pending" : "paid";

      const [payment] = await db
        .insert(payments)
        .values({
          orderId: order.id,
          method,
          amount: amount || order.total,
          status: paymentStatus,
          details: details || {},
        })
        .returning();

      // Update order payment status
      await db.update(orders).set({ paymentStatus }).where(eq(orders.id, order.id));

      return ok(payment, 201);
    }

    return fail("Method not allowed", 405);
  } catch (e) {
    console.error("[payments]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/payments", "/api/payments/:id", "/api/payment-methods"],
};
