import type { Config, Context } from "@netlify/functions";
import { and, eq, like } from "drizzle-orm";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

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

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    if (req.method === "GET" && !id) {
      const url = new URL(req.url);
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");
      const sort = url.searchParams.get("sort");

      const conditions: ReturnType<typeof eq>[] = [];
      if (category && category !== "all") conditions.push(eq(products.category, category));
      if (search) conditions.push(like(products.name, `%${search}%`));

      let rows = await db
        .select()
        .from(products)
        .where(conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions));

      if (sort === "price_asc") rows = rows.sort((a, b) => a.price - b.price);
      else if (sort === "price_desc") rows = rows.sort((a, b) => b.price - a.price);
      else if (sort === "rating") rows = rows.sort((a, b) => parseFloat(String(b.rating)) - parseFloat(String(a.rating)));

      return ok(rows);
    }

    if (req.method === "GET" && id) {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      if (!product) return fail("Product not found", 404);
      return ok(product);
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { name, nameHi, category, price, original, emoji, description, seller, sellerLocation } = body;
      if (!name || !price) return fail("name and price required");
      const numPrice = Number(price);
      const numOriginal = Number(original || price);
      const [product] = await db
        .insert(products)
        .values({
          name,
          nameHi: nameHi || name,
          category: category || "electronics",
          price: numPrice,
          original: numOriginal,
          discount: numOriginal > numPrice ? Math.round((1 - numPrice / numOriginal) * 100) : 0,
          badge: "new",
          emoji: emoji || "📦",
          stock: 100,
          description: description || "",
          seller: seller || "",
          sellerLocation: sellerLocation || "",
        })
        .returning();
      return ok(product, 201);
    }

    if (req.method === "PUT" && id) {
      const body = await req.json();
      const [existing] = await db.select().from(products).where(eq(products.id, id));
      if (!existing) return fail("Product not found", 404);
      const [updated] = await db.update(products).set(body).where(eq(products.id, id)).returning();
      return ok(updated);
    }

    if (req.method === "DELETE" && id) {
      const [existing] = await db.select().from(products).where(eq(products.id, id));
      if (!existing) return fail("Product not found", 404);
      await db.delete(products).where(eq(products.id, id));
      return Response.json({ success: true, message: "Product deleted" });
    }

    return fail("Method not allowed", 405);
  } catch (e) {
    console.error("[products]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/products", "/api/products/:id"],
};
