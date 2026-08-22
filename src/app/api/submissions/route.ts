import { getDb } from "@/server/db";
import { submissions } from "@/server/db/schema";

const allowedTypes = new Set(["volunteer", "sponsor", "partner", "donation", "care-home"]);
const allowedLanguages = new Set(["en", "es", "fr", "hi", "zh", "ar"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmissionPayload = {
  submissionType?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  organisation?: unknown;
  availability?: unknown;
  donationAmount?: unknown;
  donationFrequency?: unknown;
  message?: unknown;
  details?: unknown;
  language?: unknown;
  consent?: unknown;
  sourceUrl?: unknown;
  website?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const detailLimits = {
  contactRole: 100,
  interestArea: 80,
  supportRange: 80,
  targetGeography: 120,
  preferredTimeline: 80,
  organisationType: 80,
  elderCount: 40,
  engagementModel: 80,
  donationCurrency: 8,
  licenceStatus: 40,
  safeguardingReadiness: 40,
  consentReadiness: 40,
} as const;

const cleanDetails = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "{}";

  const input = value as Record<string, unknown>;
  const details = Object.fromEntries(
    Object.entries(detailLimits)
      .map(([key, limit]) => [key, clean(input[key], limit)])
      .filter(([, detailValue]) => Boolean(detailValue)),
  );

  return JSON.stringify(details);
};

const publicError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("no such table") || message.includes("D1 binding")) {
    return "The form is temporarily unavailable. Please email connect@tuhitu.org.";
  }
  return "We could not save your request right now.";
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SubmissionPayload;

    // Quietly accept bot submissions that fill the hidden honeypot field.
    if (clean(payload.website, 120)) {
      return Response.json({ ok: true }, { status: 201 });
    }

    const submissionType = clean(payload.submissionType, 30);
    const fullName = clean(payload.fullName, 100);
    const email = clean(payload.email, 160).toLowerCase();
    const phone = clean(payload.phone, 24);
    const country = clean(payload.country, 80);
    const organisation = clean(payload.organisation, 140);
    const availability = clean(payload.availability, 40);
    const donationAmount = clean(payload.donationAmount, 24);
    const donationFrequency = clean(payload.donationFrequency, 24);
    const message = clean(payload.message, 1200);
    const rawDetails = payload.details && typeof payload.details === "object" && !Array.isArray(payload.details)
      ? payload.details as Record<string, unknown>
      : {};
    const details = cleanDetails(rawDetails);
    const languageCandidate = clean(payload.language, 8);
    const language = allowedLanguages.has(languageCandidate)
      ? languageCandidate
      : "en";
    const sourceUrl = clean(payload.sourceUrl, 500);
    const consent = payload.consent === true;

    if (!allowedTypes.has(submissionType)) {
      return Response.json({ error: "Choose a valid request type." }, { status: 400 });
    }
    if (!fullName) {
      return Response.json({ error: "Full name is required." }, { status: 400 });
    }
    if (!emailPattern.test(email)) {
      return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return Response.json({ error: "Enter a valid phone or WhatsApp number." }, { status: 400 });
    }
    if (!country) {
      return Response.json({ error: "Country is required." }, { status: 400 });
    }
    if ((submissionType === "sponsor" || submissionType === "partner" || submissionType === "care-home") && !organisation) {
      return Response.json({ error: "Organisation name is required." }, { status: 400 });
    }
    if (submissionType === "volunteer" && !availability) {
      return Response.json({ error: "Weekly availability is required." }, { status: 400 });
    }
    if (
      submissionType === "donation" &&
      !["one-time", "monthly"].includes(donationFrequency)
    ) {
      return Response.json({ error: "Choose a valid giving frequency." }, { status: 400 });
    }
    if (submissionType === "care-home") {
      const requiredCareHomeDetails = ["contactRole", "organisationType", "targetGeography", "elderCount", "licenceStatus", "safeguardingReadiness", "consentReadiness", "engagementModel"];
      const missingCareHomeDetail = requiredCareHomeDetails.some((key) => !clean(rawDetails[key], detailLimits[key as keyof typeof detailLimits]));
      if (missingCareHomeDetail) {
        return Response.json({ error: "Complete the required care-home readiness fields." }, { status: 400 });
      }
    }
    if (!consent) {
      return Response.json({ error: "Contact consent is required." }, { status: 400 });
    }

    const db = getDb();
    const [saved] = await db
      .insert(submissions)
      .values({
        submissionType,
        fullName,
        email,
        phone,
        country,
        organisation,
        availability,
        donationAmount,
        donationFrequency,
        message,
        details,
        language,
        consent,
        sourceUrl,
      })
      .returning({ id: submissions.id });

    const reference = `THT-${String(saved.id).padStart(6, "0")}`;
    return Response.json({ ok: true, reference }, { status: 201 });
  } catch (error) {
    return Response.json({ error: publicError(error) }, { status: 500 });
  }
}
