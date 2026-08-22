# TuHiTu Adopt an Elder — Developer Handoff

This package is the source for the currently published TuHiTu Adopt an Elder website, captured from the final approved production version on 18 August 2026.

Published source revision: `fa340dc6c308c5c4d41d85c09830fc8f8f14706a`

The current header intentionally keeps the standard navigation to four well-spaced links—About, Sponsor, Partner With Us and Care Homes. Companion and Donate do not repeat in that row. They remain the two highlighted actions, with Companion labelled **Become a Companion**.

## Technology

- React 19
- Next.js 16 App Router compiled with Vinext and Vite
- TypeScript for routes and server code
- HTML, CSS and browser JavaScript for the presentation layer
- Cloudflare Worker runtime
- Drizzle ORM with a Cloudflare D1 database

The project is React-based even though the page layouts are deliberately kept in editable HTML templates. This makes visual changes straightforward for a website designer while preserving React/Vinext routing and the full-stack form APIs.

## Main routes

- `/` — Home
- `/about` — About TuHiTu
- `/about/our-model` — Our Model
- `/about/impact` — Impact
- `/about/stories` — Stories
- `/about/governance` — Governance
- `/volunteer` — Companion conversion and application page
- `/sponsor` — Sponsor information and enquiry page
- `/donate` — Focused donation checkout
- `/donation-details` — Detailed donation-information page
- `/partner-with-us` — Partner information and enquiry page
- `/care-homes` — Featured TuHiTu Bliss facility and care-home application page

## Where to edit

- Shared visual styling: `public/css/style.css`
- Shared interactions and form handling: `public/js/script.js`
- Homepage: `app/template.html`
- Other pages: each route's `template.html` under `app/`
- Shared About-page content: `app/about/about-pages.ts`
- Images and logos: `public/images/`
- Form APIs: `app/api/`
- Database schema: `db/schema.ts`
- Database migrations: `drizzle/`

The extra I Am Buzz Maker, Biome+ and One Life Circle logos supplied separately are not part of this TuHiTu website. Only the approved FDHS and TuHiTu Bliss identities used by the live site are included.

## Local setup

Prerequisites:

- Node.js 22.13 or newer
- npm

Install and run:

```bash
npm ci
npm run dev
```

The included `.openai/hosting.json` contains a safe placeholder instead of the live account's project ID. Local development uses its `DB` binding as provided. Before deploying through Sites, replace `YOUR_SITES_PROJECT_ID` by creating or attaching Sandeep's own Sites project.

Quality check:

```bash
npm test
```

Production build:

```bash
npm run build
```

The production artifact is generated under `dist/`.

## Forms and database

The application stores:

- Companion, sponsor, partner, donation-information and care-home enquiries
- Newsletter subscriptions
- Donation checkout requests and gateway references

The database binding is named `DB`. The Drizzle schema and migrations are included. A new host must provision an equivalent database and apply the migrations before accepting production submissions.

## Payment gateway

No payment secret is included in this handoff. The donation checkout is ready for a server-side gateway adapter and uses these runtime variables:

- `DONATION_GATEWAY_API_URL`
- `DONATION_GATEWAY_API_TOKEN`
- `DONATION_GATEWAY_PROVIDER`

Until they are configured, the site records the donation request and clearly states that no payment has been taken. The adapter contract is documented in `README.md` and implemented in `app/api/donations/checkout/route.ts`.

Before activating live payments, the developer must finalise the chosen provider's amount units, supported currencies, recurring-payment mandate, webhook signature verification, refunds, receipts, reconciliation and 80G acknowledgement workflow.

## Deployment note

The package preserves the existing Sites/Cloudflare architecture. If the designer moves it to Vercel or another host, the frontend can remain the same, but the Worker entry, D1 database access and runtime bindings must be adapted to that platform. Do not place payment tokens or other secrets in client-side code or commit them to the repository.

The `dist/` directory is included as the verified production artifact from this source snapshot. A new deployment should still run `npm ci` and `npm test` so the artifact is rebuilt in the destination environment.

## Verification at handoff

- Production build completed successfully on 18 August 2026
- All 12 rendered-site tests passed
- Source archive contains no live hosting project ID, payment token or environment secret
- Runtime caches, dependency folders and Git history are excluded

## Current operational details in the source

- Email: `connect@tuhitu.org`
- Phone: `+91 95996 61292`
- Launch date shown: 21 August 2026
- Donation choices: INR, USD, AED, GBP, EUR, CAD and AUD; one-time or monthly; preset and custom amounts
- The website displays 80G availability messaging subject to applicable law and valid receipt requirements

Review all public statistics, programme claims, legal wording and contact details with management before any future public deployment.
