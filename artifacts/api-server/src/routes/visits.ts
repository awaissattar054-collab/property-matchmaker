import { Router, type IRouter } from "express";
import { db, visitsTable, propertiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ScheduleVisitBody,
  CancelVisitParams,
  ListVisitsResponse,
  CancelVisitResponse,
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

function toVisit(v: typeof visitsTable.$inferSelect) {
  return {
    ...v,
    createdAt: v.createdAt ? v.createdAt.toISOString() : undefined,
  };
}

router.get("/visits", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(visitsTable)
    .leftJoin(propertiesTable, eq(visitsTable.propertyId, propertiesTable.id))
    .orderBy(visitsTable.visitDate);

  const visits = rows.map((row) => ({
    ...toVisit(row.visits),
    property: row.properties ? toProperty(row.properties) : undefined,
  }));

  res.json(ListVisitsResponse.parse(visits));
});

router.post("/visits", async (req, res): Promise<void> => {
  const parsed = ScheduleVisitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [visit] = await db
    .insert(visitsTable)
    .values(parsed.data)
    .returning();

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, visit.propertyId));

  res.status(201).json({
    ...toVisit(visit),
    property: property ? toProperty(property) : undefined,
  });
});

router.delete("/visits/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelVisitParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [updated] = await db
    .update(visitsTable)
    .set({ status: "cancelled" })
    .where(eq(visitsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Visit not found" });
    return;
  }

  const [property] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, updated.propertyId));

  res.json(CancelVisitResponse.parse({
    ...toVisit(updated),
    property: property ? toProperty(property) : undefined,
  }));
});

export default router;
