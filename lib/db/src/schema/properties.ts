import { pgTable, serial, text, integer, numeric, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  area: text("area").notNull(),
  city: text("city").notNull(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  priceFormatted: text("price_formatted").notNull(),
  type: text("type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  sizeSqFt: integer("size_sq_ft").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  phase: text("phase"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, createdAt: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
