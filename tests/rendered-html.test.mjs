import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const loadWorker = async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
};

const renderPath = async (worker, pathname) => {
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
};

test("renders development preview metadata", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/");
  assert.match(html, developmentPreviewMeta);
});

test("keeps the homepage sections and renders four navigation choices plus two priority actions", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/");
  const navigation = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/i)?.[0] ?? "";

  assert.doesNotMatch(navigation, />How It Works</i);
  assert.doesNotMatch(navigation, />FAQs</i);
  assert.match(navigation, /class="nav-dropdown-trigger"[\s\S]*About/i);
  assert.match(navigation, /href="\/about\/our-model"/i);
  assert.match(navigation, /href="\/sponsor"/i);
  assert.match(navigation, /href="\/partner-with-us"/i);
  assert.match(navigation, /href="\/care-homes"[^>]*>Care Homes</i);
  assert.doesNotMatch(navigation, /href="\/volunteer"/i);
  assert.doesNotMatch(navigation, /href="\/donate"/i);
  assert.doesNotMatch(navigation, />Contact</i);
  const actions = html.match(/<div class="header-actions">[\s\S]*?<\/div>/i)?.[0] ?? "";
  assert.match(actions, /href="\/volunteer"[^>]*>[\s\S]*Become a Companion/i);
  assert.match(actions, /href="\/donate"[^>]*>[\s\S]*Donate/i);
  assert.match(html, /id="how"/i);
  assert.match(html, /id="faq"/i);
});

test("keeps Volunteer and Donate exclusively in the priority action group on every route", async () => {
  const worker = await loadWorker();
  const paths = [
    "/",
    "/about",
    "/about/our-model",
    "/about/impact",
    "/about/stories",
    "/about/governance",
    "/volunteer",
    "/sponsor",
    "/donate",
    "/donation-details",
    "/partner-with-us",
    "/care-homes",
  ];

  for (const path of paths) {
    const html = await renderPath(worker, path);
    const navigation = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/i)?.[0] ?? "";
    const actions = html.match(/<div class="header-actions">[\s\S]*?<\/div>/i)?.[0] ?? "";

    assert.doesNotMatch(navigation, /href="\/volunteer"/i, `${path} repeats Volunteer in the text navigation`);
    assert.doesNotMatch(navigation, /href="\/donate"/i, `${path} repeats Donate in the text navigation`);
    assert.match(actions, /Become a Companion/i, `${path} is missing the companion action`);
    assert.match(actions, />Donate<\/span>/i, `${path} is missing the donation action`);
  }
});

test("renders the approved launch, trust, donation and contact updates", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/");

  assert.match(html, /Adopt an Elder\. Restore Dignity\. Renew Hope\./i);
  assert.match(html, /true service begins with[\s\S]*Satya/i);
  assert.match(html, /class="satya-focus">Satya<\/strong>/i);
  assert.match(html, /Service begins 21 August 2026/i);
  assert.match(html, /name="donationCurrency"/i);
  assert.match(html, /80G Tax Benefit Available/i);
  assert.match(html, /Federation of Digital Health Sciences/i);
  assert.match(html, /connect@tuhitu\.org/i);
  assert.match(html, /\+91 95996 61292/i);
  assert.match(html, /Gurgaon · Chandigarh · Pune/i);
  assert.match(html, /International contact:<\/strong> Dubai/i);
  assert.doesNotMatch(html, /> Oceania</i);
  assert.match(html, /Middle East[\s\S]*South Asia/i);
  assert.match(html, /class="hero-stats-strip"[\s\S]*data-count="12400"[\s\S]*Elders Associated/i);
  assert.match(html, /data-count="18"[\s\S]*Countries with Associated Partners/i);
  assert.match(html, /data-count="9600"[\s\S]*Registered Volunteers/i);
  assert.match(html, /data-count="150000"[\s\S]*Calls &amp; Visits in Process/i);
});

test("makes the homepage self-explanatory, video-led and action-routed", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/");

  assert.match(html, /Every elder deserves a[\s\S]*companion[\s\S]*not just a caregiver/i);
  assert.match(html, /youtube-nocookie\.com\/embed\/sl61pbDv-t0/i);
  assert.match(html, /Voices from Panchkula/i);
  assert.match(html, /Three pillars turn empathy into consistent action/i);
  assert.match(html, /This is companionship(?:&mdash;|—)not caregiving/i);
  assert.match(html, /From Interest to Connection/i);
  assert.match(html, /Volunteer preparation/i);
  assert.match(html, /Recognition &amp; growth/i);
  assert.match(html, /Our long-term direction/i);

  const main = html.match(/<main id="top">[\s\S]*?<\/main>/i)?.[0] ?? "";
  for (const route of [
    "/about",
    "/about/our-model",
    "/about/stories",
    "/about/governance",
    "/about/impact",
    "/volunteer",
    "/sponsor",
    "/donate",
    "/donation-details",
    "/partner-with-us",
    "/care-homes",
  ]) {
    assert.match(main, new RegExp(`href=["']${route.replaceAll("/", "\\/")}`));
  }
});

test("renders the dedicated Sponsor prospect journey and enquiry form", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/sponsor");

  assert.match(html, /Turn your organisation’s support/i);
  assert.match(html, /Proof &amp; Due Diligence/i);
  assert.match(html, /value="sponsor"/i);
  assert.match(html, /data-prospect-form/i);
});

test("renders the dedicated Partner With Us journey and enquiry form", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/partner-with-us");

  assert.match(html, /Bring free, structured companionship/i);
  assert.match(html, /Clear Responsibilities/i);
  assert.match(html, /value="partner"/i);
  assert.match(html, /data-prospect-form/i);
});

test("renders the emotionally led volunteer journey and application", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/volunteer");

  assert.match(html, /Someone’s grandparent is waiting/i);
  assert.match(html, /An elder’s loneliness may be quiet/i);
  assert.match(html, /I Can Give 30 Minutes a Week/i);
  assert.match(html, /No one is matched just because they submit a form/i);
  assert.match(html, /Family Circle Benefit/i);
  assert.match(html, /25[\s\S]*verified hours[\s\S]*or[\s\S]*20[\s\S]*approved calls/i);
  assert.match(html, /Verified Certificate/i);
  assert.match(html, /value="volunteer"/i);
  assert.match(html, /name="availability"/i);
  assert.match(html, /data-prospect-form/i);
});

test("renders the focused donation checkout with preset and recurring choices", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/donate");

  assert.match(html, /Secure Donation Checkout/i);
  assert.match(html, /id="donationCheckoutForm"/i);
  assert.match(html, /value="500"[\s\S]*₹500/i);
  assert.match(html, /value="1000"[\s\S]*₹1,000/i);
  assert.match(html, /value="2000"[\s\S]*₹2,000/i);
  assert.match(html, /value="5000"[\s\S]*₹5,000/i);
  assert.match(html, /value="custom"/i);
  assert.match(html, /value="one-time"/i);
  assert.match(html, /value="monthly"/i);
  assert.match(html, /Proceed to Secure Payment/i);
  assert.match(html, /href="\/donation-details"/i);
});

test("keeps the detailed donation-information journey separate from checkout", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/donation-details");
  assert.match(html, /Understand the programme before/i);
  assert.match(html, /Continue to Secure Checkout/i);
  assert.match(html, /Need More Information/i);
  assert.match(html, /data-prospect-form/i);
});

test("renders the featured TuHiTu Club Bliss care-home pathway and readiness form", async () => {
  const worker = await loadWorker();
  const html = await renderPath(worker, "/care-homes");
  assert.match(html, /TuHiTu Club Bliss, Panchkula/i);
  assert.match(html, /Your Facility Can Be Next/i);
  assert.match(html, /No automatic grant or donation is promised/i);
  assert.match(html, /value="care-home"/i);
  assert.match(html, /name="licenceStatus"/i);
  assert.match(html, /name="safeguardingReadiness"/i);
  assert.match(html, /data-prospect-form/i);
});

test("renders each About dropdown destination as a separate route", async () => {
  const worker = await loadWorker();
  const expectations = [
    ["/about", /A community built so no elder feels forgotten/i],
    ["/about/our-model", /Kindness becomes dependable/i],
    ["/about/impact", /Growth matters only when/i],
    ["/about/stories", /The work becomes real/i],
    ["/about/governance", /Trust is a system, not a badge/i],
  ];
  for (const [path, pattern] of expectations) {
    const html = await renderPath(worker, path);
    assert.match(html, pattern);
    assert.match(html, /class="nav-dropdown-trigger active"/i);
  }
});
