import type { Config } from "@netlify/functions";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

const ok = (data: unknown, extra?: Record<string, unknown>, status = 200) =>
  Response.json({ success: true, ...extra, data }, { status });

const fail = (message: string, status = 400) =>
  Response.json({ success: false, message }, { status });

const hashPwd = (pwd: string) => createHash("sha256").update(pwd).digest("hex");

export default async (req: Request) => {
  const pathname = new URL(req.url).pathname;

  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    // POST /api/auth/register
    if (req.method === "POST" && pathname === "/api/auth/register") {
      const { name, email, password, phone } = await req.json();
      if (!name || !email || !password) return fail("name, email and password required");

      const [existing] = await db.select().from(users).where(eq(users.email, email));
      if (existing) return fail("Email already registered", 409);

      const [user] = await db
        .insert(users)
        .values({ name, email, phone: phone || "", passwordHash: hashPwd(password) })
        .returning();

      const { passwordHash: _, ...safeUser } = user;
      return ok(safeUser, { message: "Registered successfully" }, 201);
    }

    // POST /api/auth/login
    if (req.method === "POST" && pathname === "/api/auth/login") {
      const { email, password } = await req.json();
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user || user.passwordHash !== hashPwd(password)) {
        return fail("Invalid credentials", 401);
      }

      const { passwordHash: _, ...safeUser } = user;
      const token = `token_${safeUser.id}_${Date.now()}`;
      return ok(safeUser, { message: "Login successful", token });
    }

    return fail("Not found", 404);
  } catch (e) {
    console.error("[auth]", e);
    return fail("Server error", 500);
  }
};

export const config: Config = {
  path: ["/api/auth/register", "/api/auth/login"],
};
