import { pgTable, serial, text, integer, timestamp, jsonb, numeric } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  nameHi: text("name_hi").notNull().default(""),
  category: text().notNull().default("electronics"),
  price: integer().notNull(),
  original: integer().notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull().default("4.0"),
  reviews: integer().notNull().default(0),
  discount: integer().notNull().default(0),
  badge: text().notNull().default("new"),
  emoji: text().notNull().default("📦"),
  stock: integer().notNull().default(100),
  description: text().notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  seller: text().notNull().default(""),
  sellerLocation: text("seller_location").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  phone: text().notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  items: jsonb("items").$type<Array<{ id: number; qty: number }>>().notNull().default([]),
  customer: jsonb("customer").$type<Record<string, string>>().notNull().default({}),
  address: jsonb("address").$type<Record<string, string>>().notNull().default({}),
  paymentMethod: text("payment_method").notNull().default("COD"),
  total: integer().notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  shipping: jsonb("shipping").$type<Record<string, unknown>>().notNull().default({}),
  status: text().notNull().default("placed"),
  shipmentEvents: jsonb("shipment_events")
    .$type<Array<{ status: string; title: string; timestamp: string }>>()
    .notNull()
    .default([]),
  placedAt: timestamp("placed_at").defaultNow(),
  estimatedDelivery: timestamp("estimated_delivery"),
  updatedAt: timestamp("updated_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

export const addresses = pgTable("addresses", {
  id: serial().primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  line1: text("line1").notNull().default(""),
  line2: text("line2").notNull().default(""),
  city: text().notNull().default(""),
  state: text().notNull().default(""),
  pin: text().notNull().default(""),
  country: text().notNull().default("India"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial().primaryKey(),
  orderId: integer("order_id").notNull(),
  method: text().notNull(),
  amount: integer().notNull(),
  status: text().notNull().default("pending"),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const locations = pgTable("locations", {
  id: text().primaryKey(),
  city: text().notNull(),
  state: text().notNull(),
  pin: text().notNull(),
  courier: text().notNull(),
  deliveryDays: text("delivery_days").notNull(),
});
