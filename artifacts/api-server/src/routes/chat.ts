import { Router, type IRouter } from "express";
import { db, propertiesTable } from "@workspace/db";
import { and, gte, lte, eq, type SQL } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function formatPrice(price: number): string {
  if (price >= 10000000) {
    const crore = price / 10000000;
    return `${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
  } else if (price >= 100000) {
    const lac = price / 100000;
    return `${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`;
  }
  return `PKR ${price.toLocaleString()}`;
}

function toProperty(p: typeof propertiesTable.$inferSelect) {
  return {
    ...p,
    price: Number(p.price),
    features: Array.isArray(p.features) ? p.features : [],
  };
}

router.post("/chat/message", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, budget, area, city, propertyType, bedrooms } = parsed.data;

  try {
    const systemPrompt = `You are an expert Pakistani real estate assistant. Help users find properties in Pakistan (DHA, Bahria Town, Gulberg, etc.). 

When a user describes what they want, extract search criteria and respond helpfully. Always reply in the same language as the user (Urdu or English).

Extract from user messages:
- budget (in PKR - if they say "1 Crore" that's 10000000, "50 Lac" = 5000000)
- area/neighborhood (DHA Phase 5, Bahria Town Phase 8, Gulberg, etc.)
- city (Lahore, Karachi, Islamabad, etc.)
- property type (House, Apartment, Plot, Commercial)
- bedrooms count

Always be warm, professional, and helpful. Format responses as JSON:
{
  "reply": "your conversational reply",
  "intent": "search|greeting|clarify|schedule|other",
  "extracted": {
    "budget": number or null,
    "area": string or null,
    "city": string or null,
    "propertyType": string or null,
    "bedrooms": number or null
  }
}`;

    const contextNote = [
      budget ? `Current budget: PKR ${budget.toLocaleString()}` : "",
      area ? `Area preference: ${area}` : "",
      city ? `City: ${city}` : "",
      propertyType ? `Property type: ${propertyType}` : "",
      bedrooms ? `Bedrooms: ${bedrooms}` : "",
    ].filter(Boolean).join(", ");

    const userContent = contextNote
      ? `Context: ${contextNote}\n\nUser message: ${message}`
      : message;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
    });

    const aiText = completion.choices[0]?.message?.content || "{}";

    let aiData: {
      reply: string;
      intent: string;
      extracted: {
        budget?: number | null;
        area?: string | null;
        city?: string | null;
        propertyType?: string | null;
        bedrooms?: number | null;
      };
    };

    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      aiData = JSON.parse(jsonMatch ? jsonMatch[0] : aiText);
    } catch {
      aiData = { reply: aiText, intent: "other", extracted: {} };
    }

    const extracted = aiData.extracted || {};
    const effectiveBudget = extracted.budget ?? budget;
    const effectiveArea = extracted.area ?? area;
    const effectiveCity = extracted.city ?? city;
    const effectivePropertyType = extracted.propertyType ?? propertyType;
    const effectiveBedrooms = extracted.bedrooms ?? bedrooms;

    let matchedProperties: typeof propertiesTable.$inferSelect[] = [];

    if (aiData.intent === "search" || effectiveBudget || effectiveArea || effectiveCity) {
      const conditions: SQL[] = [];
      if (effectiveCity) conditions.push(eq(propertiesTable.city, effectiveCity));
      if (effectiveArea) {
        const parts = effectiveArea.split(/\s+/);
        if (parts.length > 0) {
          conditions.push(eq(propertiesTable.area, effectiveArea));
        }
      }
      if (effectivePropertyType) conditions.push(eq(propertiesTable.type, effectivePropertyType));
      if (effectiveBedrooms) conditions.push(eq(propertiesTable.bedrooms, effectiveBedrooms));
      if (effectiveBudget) {
        conditions.push(lte(propertiesTable.price, String(effectiveBudget * 1.15)));
        conditions.push(gte(propertiesTable.price, String(effectiveBudget * 0.5)));
      }

      matchedProperties = await db
        .select()
        .from(propertiesTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(4);

      if (matchedProperties.length === 0 && conditions.length > 0) {
        const relaxed: SQL[] = [];
        if (effectiveCity) relaxed.push(eq(propertiesTable.city, effectiveCity));
        if (effectiveBudget) {
          relaxed.push(lte(propertiesTable.price, String(effectiveBudget * 1.5)));
        }

        matchedProperties = await db
          .select()
          .from(propertiesTable)
          .where(relaxed.length > 0 ? and(...relaxed) : undefined)
          .limit(4);
      }
    }

    const response = SendChatMessageResponse.parse({
      message: aiData.reply || "I'm here to help you find your perfect property!",
      properties: matchedProperties.map(toProperty),
      sessionId: parsed.data.sessionId,
      intent: aiData.intent || "other",
      extractedCriteria: {
        budget: effectiveBudget ?? undefined,
        area: effectiveArea ?? undefined,
        city: effectiveCity ?? undefined,
        propertyType: effectivePropertyType ?? undefined,
        bedrooms: effectiveBedrooms ?? undefined,
      },
    });

    res.json(response);
  } catch (err) {
    req.log.error({ err }, "Chat error");
    res.status(500).json({ error: "Failed to process message" });
  }
});

export default router;
