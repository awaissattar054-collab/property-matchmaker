import { Router, type IRouter } from "express";
import { db, propertiesTable } from "@workspace/db";
import { eq, and, gte, lte, type SQL } from "drizzle-orm";
import {
  ListPropertiesQueryParams,
  GetPropertyParams,
  ListPropertiesResponse,
  GetPropertyResponse,
  GetFeaturedPropertiesResponse,
  GetPropertyStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toProperty(p: typeof propertiesTable.$inferSelect) {
  return {
    ...p,
    price: Number(p.price),
    features: Array.isArray(p.features) ? p.features : [],
    phase: p.phase ?? undefined,
    createdAt: p.createdAt ? p.createdAt.toISOString() : undefined,
  };
}

router.get("/properties", async (req, res): Promise<void> => {
  const parsed = ListPropertiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { city, area, minPrice, maxPrice, type, bedrooms } = parsed.data;

  const conditions: SQL[] = [];
  if (city) conditions.push(eq(propertiesTable.city, city));
  if (area) conditions.push(eq(propertiesTable.area, area));
  if (type) conditions.push(eq(propertiesTable.type, type));
  if (bedrooms) conditions.push(eq(propertiesTable.bedrooms, bedrooms));
  if (minPrice) conditions.push(gte(propertiesTable.price, String(minPrice)));
  if (maxPrice) conditions.push(lte(propertiesTable.price, String(maxPrice)));

  const properties = await db
    .select()
    .from(propertiesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(propertiesTable.createdAt);

  res.json(ListPropertiesResponse.parse(properties.map(toProperty)));
});

router.get("/properties/featured", async (_req, res): Promise<void> => {
  const properties = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.isFeatured, true))
    .limit(6);

  res.json(GetFeaturedPropertiesResponse.parse(properties.map(toProperty)));
});

router.get("/properties/stats", async (_req, res): Promise<void> => {
  const all = await db.select().from(propertiesTable);

  const totalListings = all.length;
  const avgPrice = totalListings > 0
    ? all.reduce((sum, p) => sum + Number(p.price), 0) / totalListings
    : 0;

  const cityMap: Record<string, number> = {};
  const typeMap: Record<string, number> = {};

  for (const p of all) {
    cityMap[p.city] = (cityMap[p.city] || 0) + 1;
    typeMap[p.type] = (typeMap[p.type] || 0) + 1;
  }

  const cityBreakdown = Object.entries(cityMap).map(([city, count]) => ({ city, count }));
  const typeBreakdown = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

  res.json(GetPropertyStatsResponse.parse({ totalListings, avgPrice, cityBreakdown, typeBreakdown }));
});

router.get("/properties/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPropertyParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, params.data.id));

  if (!property) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  res.json(GetPropertyResponse.parse(toProperty(property)));
});

export default router;
