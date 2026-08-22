import { getDb } from "@/server/db";
import { newsletterSubscriptions } from "@/server/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedLanguages = new Set(["en", "es", "fr", "hi", "zh", "ar"]);

type NewsletterPayload = {
  email?: unknown;
  language?: unknown;
  sourceUrl?: unknown;
  website?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as NewsletterPayload;

    if (clean(payload.website, 120)) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const email = clean(payload.email, 160).toLowerCase();
    const languageCandidate = clean(payload.language, 8);
    const language = allowedLanguages.has(languageCandidate)
      ? languageCandidate
      : "en";
    const sourceUrl = clean(payload.sourceUrl, 500);

    if (!emailPattern.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(newsletterSubscriptions)
      .values({ email, language, sourceUrl })
      .onConflictDoNothing({ target: newsletterSubscriptions.email });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const publicMessage =
      message.includes("no such table") || message.includes("D1 binding")
        ? "Subscriptions are temporarily unavailable. Please try again later."
        : "We could not save your subscription right now.";
    return Response.json({ error: publicMessage }, { status: 500 });
  }
}
