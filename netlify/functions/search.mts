import type { Config } from "@netlify/functions";
import { or, like } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    const q = new URL(req.url).searchParams.get("q");
    if (!q) return Response.json({ success: true, data: [] });

    const rows = await db
      .select()
      .from(products)
      .where(
        or(
          like(products.name, `%${q}%`),
          like(products.category, `%${q}%`)
        )
      );

    return Response.json({ success: true, count: rows.length, data: rows });
  } catch (e) {
    console.error("[search]", e);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/search",
};
