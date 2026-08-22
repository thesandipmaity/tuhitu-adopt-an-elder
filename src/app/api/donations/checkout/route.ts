import { eq } from "drizzle-orm";
import { getDb, getRuntimeEnv } from "@/server/db";
import { donationCheckouts } from "@/server/db/schema";

const allowedCurrencies = new Set(["INR", "USD", "AED", "GBP", "EUR", "CAD", "AUD"]);
const allowedFrequencies = new Set(["one-time", "monthly"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutPayload = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  donationCurrency?: unknown;
  donationAmount?: unknown;
  donationFrequency?: unknown;
  consent?: unknown;
  sourceUrl?: unknown;
  website?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const validHttpsUrl = (value: unknown) => {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    if (clean(payload.website, 120)) return Response.json({ ok: true }, { status: 201 });

    const fullName = clean(payload.fullName, 100);
    const email = clean(payload.email, 160).toLowerCase();
    const phone = clean(payload.phone, 24);
    const country = clean(payload.country, 80);
    const currency = clean(payload.donationCurrency, 8).toUpperCase();
    const frequency = clean(payload.donationFrequency, 24);
    const sourceUrl = clean(payload.sourceUrl, 500);
    const amount = Number(payload.donationAmount);
    const consent = payload.consent === true;

    if (!fullName) return Response.json({ error: "Full name is required." }, { status: 400 });
    if (!emailPattern.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (phone.replace(/\D/g, "").length < 7) return Response.json({ error: "Enter a valid phone or WhatsApp number." }, { status: 400 });
    if (!country) return Response.json({ error: "Country is required." }, { status: 400 });
    if (!allowedCurrencies.has(currency)) return Response.json({ error: "Choose a supported payment currency." }, { status: 400 });
    if (!allowedFrequencies.has(frequency)) return Response.json({ error: "Choose one-time or monthly giving." }, { status: 400 });
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 10_000_000) return Response.json({ error: "Enter a valid donation amount." }, { status: 400 });
    if (!consent) return Response.json({ error: "Please accept the donation and privacy terms." }, { status: 400 });

    const db = getDb();
    const [saved] = await db.insert(donationCheckouts).values({
      fullName,
      email,
      phone,
      country,
      currency,
      amount,
      frequency,
      consent,
      sourceUrl,
    }).returning({ id: donationCheckouts.id });

    const reference = `THT-DON-${String(saved.id).padStart(6, "0")}`;
    const env = getRuntimeEnv();
    const gatewayApiUrl = validHttpsUrl(env.DONATION_GATEWAY_API_URL);
    const gatewayToken = env.DONATION_GATEWAY_API_TOKEN?.trim();
    const gatewayProvider = env.DONATION_GATEWAY_PROVIDER?.trim().slice(0, 50) || "configured-provider";

    if (!gatewayApiUrl || !gatewayToken) {
      return Response.json({
        ok: true,
        gatewayReady: false,
        reference,
        message: "Online payment activation is in progress. Your donation request has been saved, but no payment has been taken.",
      }, { status: 202 });
    }

    const origin = new URL(request.url).origin;
    const gatewayResponse = await fetch(gatewayApiUrl, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${gatewayToken}`,
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        reference,
        amountMajorUnit: amount,
        currency,
        frequency,
        donor: { fullName, email, phone, country },
        returnUrl: `${origin}/donate?payment=return&reference=${encodeURIComponent(reference)}`,
        cancelUrl: `${origin}/donate?payment=cancelled&reference=${encodeURIComponent(reference)}`,
      }),
    });

    const gatewayResult = await gatewayResponse.json().catch(() => ({})) as Record<string, unknown>;
    const checkoutUrl = validHttpsUrl(gatewayResult.checkoutUrl);
    if (!gatewayResponse.ok || !checkoutUrl) {
      await db.update(donationCheckouts).set({ status: "gateway_error", updatedAt: new Date().toISOString() }).where(eq(donationCheckouts.id, saved.id));
      return Response.json({ error: "The payment gateway could not start. No payment was taken.", reference }, { status: 502 });
    }

    await db.update(donationCheckouts).set({
      status: "gateway_created",
      gatewayProvider,
      gatewayReference: clean(gatewayResult.gatewayReference, 160),
      updatedAt: new Date().toISOString(),
    }).where(eq(donationCheckouts.id, saved.id));

    return Response.json({ ok: true, gatewayReady: true, reference, checkoutUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const publicMessage = message.includes("no such table") || message.includes("D1 binding")
      ? "Donation checkout is temporarily unavailable. Please email connect@tuhitu.org."
      : "We could not start the secure payment process. No payment was taken.";
    return Response.json({ error: publicMessage }, { status: 500 });
  }
}
