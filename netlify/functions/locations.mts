import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { locations } from "../../db/schema.js";

const ok = (data: unknown, status = 200) =>
  Response.json({ success: true, data }, { status });

const fail = (message: string, status = 400) =>
  Response.json({ success: false, message }, { status });

export default async (req: Request, context: Context) => {
  const id = context.params.id;

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    // GET /api/locations
    if (req.method === "GET" && !id) {
      const rows = await db.select().from(locations);
      return ok(rows);
    }

    // GET /api/locations/:id
    if (req.method === "GET" && id) {
      const [location] = await db.select().from(locations).where(eq(locations.id, id));
      if (!location) return fail("Location not found", 404);
      return ok(location);
    }

    return fail("Method not allowed", 405);
  } catch (e) {
    console.error("[locations]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/locations", "/api/locations/:id"],
};
