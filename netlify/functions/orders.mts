import type { Config, Context } from "@netlify/functions";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { orders, products, locations } from "../../db/schema.js";

const ok = (data: unknown, status = 200) =>
  Response.json(
    Array.isArray(data)
      ? { success: true, count: (data as unknown[]).length, data }
      : { success: true, data },
    { status }
  );

const fail = (message: string, status = 400) =>
  Response.json({ success: false, message }, { status });

const PAYMENT_METHODS = ["COD", "UPI", "Credit Card", "Debit Card", "NetBanking", "Wallet"];
const VALID_STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

export default async (req: Request, context: Context) => {
  const id = context.params.id ? parseInt(context.params.id, 10) : null;
  const pathname = new URL(req.url).pathname;

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    // GET /api/orders
    if (req.method === "GET" && !id) {
      const rows = await db.select().from(orders);
      return ok(rows);
    }

    // GET /api/orders/:id/track
    if (req.method === "GET" && id && pathname.endsWith("/track")) {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return fail("Order not found", 404);
      return ok({
        trackingId: (order.shipping as Record<string, unknown>)?.trackingId,
        status: order.status,
        shipmentEvents: order.shipmentEvents,
        estimatedDelivery: order.estimatedDelivery,
      });
    }

    // GET /api/orders/:id
    if (req.method === "GET" && id) {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return fail("Order not found", 404);
      return ok(order);
    }

    // POST /api/orders
    if (req.method === "POST") {
      const body = await req.json();
      const { items, customer, address, paymentMethod } = body;
      if (!items || !items.length) return fail("No items in order");

      // Validate stock and compute total inside a transaction
      const result = await db.transaction(async (tx) => {
        let total = 0;
        for (const item of items) {
          const [product] = await tx.select().from(products).where(eq(products.id, item.id));
          if (!product) return { error: `Product ${item.id} not found`, status: 404 };
          if (product.stock < item.qty) return { error: `Insufficient stock for ${product.name}`, status: 400 };
          total += product.price * item.qty;
        }

        // Deduct stock
        for (const item of items) {
          await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${item.qty}` })
            .where(eq(products.id, item.id));
        }

        const method = paymentMethod || "COD";
        const now = new Date().toISOString();

        // Determine courier from pin
        const deliveryLocations = await tx.select().from(locations);
        const loc = deliveryLocations.find((l) => l.pin === (address?.pin || "110001"));

        const trackingId = `TRK${Date.now()}`;
        const estimatedDelivery = new Date(Date.now() + 5 * 24 * 3600 * 1000);

        const [order] = await tx
          .insert(orders)
          .values({
            items,
            customer: customer || {},
            address: address || {},
            paymentMethod: method,
            total,
            paymentStatus: method === "COD" ? "pending" : "paid",
            shipping: {
              origin: "Noida, UP",
              destination: address?.city || address?.town || "Unknown",
              courier: loc?.courier || "Ecom Express",
              cost: 99,
              trackingId,
            },
            status: "placed",
            shipmentEvents: [{ status: "placed", title: "Order received", timestamp: now }],
            estimatedDelivery,
          })
          .returning();

        return { order };
      });

      if ("error" in result) return fail(result.error as string, result.status as number);
      return ok(result.order, 201);
    }

    // PATCH /api/orders/:id/status
    if (req.method === "PATCH" && id && pathname.endsWith("/status")) {
      const { status: newStatus } = await req.json();
      if (!VALID_STATUSES.includes(newStatus)) return fail("Invalid status");

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return fail("Order not found", 404);

      const now = new Date().toISOString();
      const events = [...(order.shipmentEvents as Array<{ status: string; title: string; timestamp: string }>)];

      const updates: Partial<typeof orders.$inferInsert> = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (newStatus === "shipped") {
        updates.shippedAt = new Date();
        events.push({ status: "shipped", title: "Shipped from warehouse", timestamp: now });
      }
      if (newStatus === "delivered") {
        updates.deliveredAt = new Date();
        events.push({ status: "delivered", title: "Delivered to destination", timestamp: now });
      }
      if (newStatus === "cancelled") {
        events.push({ status: "cancelled", title: "Order cancelled", timestamp: now });
      }

      updates.shipmentEvents = events;

      const [updated] = await db.update(orders).set(updates).where(eq(orders.id, id)).returning();
      return ok(updated);
    }

    return fail("Method not allowed", 405);
  } catch (e) {
    console.error("[orders]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/orders", "/api/orders/:id", "/api/orders/:id/status", "/api/orders/:id/track"],
};
