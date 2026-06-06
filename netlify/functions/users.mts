import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, addresses } from "../../db/schema.js";

const ok = (data: unknown, status = 200) =>
  Response.json(
    Array.isArray(data)
      ? { success: true, count: (data as unknown[]).length, data }
      : { success: true, data },
    { status }
  );

const fail = (message: string, status = 400) =>
  Response.json({ success: false, message }, { status });

export default async (req: Request, context: Context) => {
  const id = context.params.id ? parseInt(context.params.id, 10) : null;
  const pathname = new URL(req.url).pathname;
  const isAddresses = pathname.endsWith("/addresses");

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    if (!id) return fail("User ID required", 400);

    // GET /api/users/:id/addresses
    if (req.method === "GET" && isAddresses) {
      const rows = await db.select().from(addresses).where(eq(addresses.userId, id));
      return ok(rows);
    }

    // POST /api/users/:id/addresses
    if (req.method === "POST" && isAddresses) {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) return fail("User not found", 404);

      const body = await req.json();
      const [address] = await db
        .insert(addresses)
        .values({ userId: id, ...body })
        .returning();
      return ok(address, 201);
    }

    // GET /api/users/:id
    if (req.method === "GET") {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      if (!user) return fail("User not found", 404);
      const { passwordHash: _, ...safeUser } = user;
      return ok(safeUser);
    }

    return fail("Method not allowed", 405);
  } catch (e) {
    console.error("[users]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/users/:id", "/api/users/:id/addresses"],
};
