# TuHiTu Adopt an Elder — Approved Design System

This file documents the founder-approved visual system already implemented in
the website. Existing UI and supplied brand assets remain authoritative. New
routes must extend these patterns rather than introduce a new theme.

## Brand Character

- Warm, dignified, trustworthy and human
- Premium community-initiative presentation; never clinical, childish or loud
- Emotion-led messaging supported by clear safeguards and operational proof
- Spacious editorial layouts with rounded cards and restrained animation

## Colour Tokens

| Role | Token | Value |
| --- | --- | --- |
| Deep background | `--navy-950` | `#081428` |
| Primary navy | `--navy-900` | `#0B1F3A` |
| Secondary navies | `--navy-800` / `--navy-700` | `#142E52` / `#1E3A63` |
| Primary accent | `--amber-500` | `#F2A93B` |
| Accent hover | `--amber-600` | `#E0921F` |
| Light accent | `--amber-100` | `#FDEACB` |
| Warm surface | `--cream` | `#FBF8F2` |
| White surface | `--white` | `#FFFFFF` |
| Main text | `--ink` | `#1B2130` |
| Secondary text | `--ink-muted` | `#5B6472` |
| Border | `--border` | `#E7E1D4` |
| Success | `--success` | `#2E7D5B` |

Use semantic CSS variables. Do not replace the navy–amber–cream palette or add
new brand colours without explicit approval.

## Typography

- Display and headings: `Poppins`, weight 500–700
- Body and form copy: `Inter`, weight 400–700
- Body size is at least 16px on mobile with a 1.5–1.7 line height
- Eyebrows use uppercase Poppins, restrained tracking and an amber rule
- Long paragraphs remain within a readable measure

## Layout and Components

- Main content width: `1180px` plus responsive 24px gutters
- Section spacing: 96px desktop, 64px mobile
- Radius scale: 10px, 16px and 28px
- Cards use white or cream surfaces, subtle borders and navy-tinted shadows
- Primary buttons are amber pills with navy text
- Secondary buttons are navy, white or transparent according to surface
- All interactive targets are at least 44px high and have visible focus states
- Photography uses rounded crops and depicts respectful intergenerational
  connection; no decorative stock imagery that undermines authenticity
- Use the existing Font Awesome icon family consistently; no emoji icons

## Header and Navigation

The global order is:

1. About dropdown
2. Companion
3. Sponsor
4. Donate
5. Partner With Us
6. Care Homes

The right side retains `Become a Companion`, `Donate`, and the prominent 80G
benefit badge. The logo always links to `/`. Contact remains in the footer, not
the primary navigation. The full menu remains single-line on wide screens and
uses the existing accessible drawer at `1320px` and below.

The About dropdown routes independently to:

- `/about`
- `/about/our-model`
- `/about/impact`
- `/about/stories`
- `/about/governance`

## Page System

- Dark navy hero with subtle dot grid and restrained amber decoration
- Emotion or outcome first, then a practical explanation and primary CTA
- Evidence, process, safeguards and qualification appear before conversion forms
- Forms use visible labels, inline errors, semantic input types and live status
- Donate is a focused checkout route; `/donation-details` is the information and
  enquiry route
- Care Homes presents TuHiTu Bliss as the featured founding facility, followed
  by due diligence, operational checks and registration
- Companion leads with the human reason to act; recognition and incentives come
  only after purpose, role choice and safeguarding

## Motion and Accessibility

- Transitions: 150–300ms, primarily opacity and transform
- Respect `prefers-reduced-motion`
- Maintain AA contrast, logical heading order, keyboard navigation, skip links,
  explicit form labels, `aria-live` feedback and predictable browser back paths
- No horizontal scrolling or content hidden beneath the sticky header
- The homepage alone may show the dismissible launch notice; conversion forms
  and routed information pages must remain unobstructed

## Trust and Claims

- Preserve required 80G qualification language and do not imply universal tax
  eligibility
- Do not claim a completed donation until the authorised gateway confirms it
- Do not collect card, UPI PIN, bank credentials, medical records or resident
  identity documents in TuHiTu forms
- Care-home registration is not automatic approval, funding or public listing
- Association figures must remain labelled as supplied association,
  registration or activity figures rather than audited outcomes
- Preserve FDHS initiative attribution in the footer

## Final QA

- Verify every route at desktop and responsive breakpoints
- Confirm About disclosure, mobile drawer, active state, focus order and Escape
- Confirm preset/custom amounts, currency updates and one-time/monthly selection
- Confirm invalid forms focus the first field and show a recovery message
- Confirm images reserve dimensions and below-fold assets lazy-load where useful
- Confirm no page introduces a conflicting palette, font, card or button style
