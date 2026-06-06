import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    const rows = await db.select({ category: products.category }).from(products);

    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }

    const data = Object.entries(counts).map(([name, count]) => ({ name, count }));
    return Response.json({ success: true, data });
  } catch (e) {
    console.error("[categories]", e);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/categories",
};
