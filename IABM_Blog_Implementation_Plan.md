# I Am Buzz Maker --- Blog Implementation Plan

**Document type:** Engineering Implementation Plan\
**Website:** I Am Buzz Maker\
**Feature:** Blog / Insights\
**Status:** Ready for implementation\
**Scope:** Implementation only --- approved blog content must NOT be
rewritten, replaced, or expanded as part of this task.

------------------------------------------------------------------------

## 1. Objective

Implement the approved I Am Buzz Maker blog experience as a scalable
website feature while preserving:

-   The existing IABM website visual language.
-   The approved blog categories and article content.
-   The existing global Header and Footer.
-   The IABM Web Engineering Master Standard.
-   SEO, accessibility, performance, analytics, and maintainability
    requirements.
-   The existing website architecture wherever it already provides an
    equivalent solution.

The implementation must make it possible to add future articles by
adding content, not by rebuilding the blog UI.

------------------------------------------------------------------------

## 2. Content Lock Rule

### IMPORTANT

**Do not change the approved blogs.**

This implementation plan does not authorize:

-   Rewriting article titles.
-   Rewriting article body copy.
-   Changing article meaning.
-   Adding unsupported claims.
-   Removing approved sections.
-   Changing approved categories.
-   Inventing authors, credentials, statistics, testimonials, case
    studies, or proof.
-   Creating new blog topics unless separately approved.
-   Changing publication or update dates without editorial approval.

The developer's responsibility is to implement the supplied/approved
content correctly.

If a content problem is discovered during implementation:

1.  Do not silently edit the article.
2.  Record the issue.
3.  Flag it for content/editorial approval.
4.  Continue implementation using the approved source content.

This follows the IABM content-separation principle: business content
belongs in the content layer rather than being scattered through
presentation components. The master standard explicitly places blog
content under `src/content/blog/`.

------------------------------------------------------------------------

## 3. Source of Truth

Implementation must follow this priority order:

1.  **Latest approved IABM website/source code** --- visual and
    technical source of truth.
2.  **Approved blog content** --- content source of truth.
3.  **IABM Blog Page Design Specification** --- blog UX and component
    requirements.
4.  **IABM Web Engineering Master Standard v1.0** --- engineering
    governance.
5.  **IABM Website AI Context** --- brand, SEO, analytics, content and
    publishing guardrails.

The existing website must be inspected before implementation. Do not
assume routes, components, styling tokens, analytics setup, CMS, or
content architecture.

------------------------------------------------------------------------

## 4. Approved Blog Architecture

The blog uses the existing approved three-category structure:

``` text
All
├── Senior Care
├── Tech for Seniors
└── Bridging Generations
```

The category architecture should be implemented exactly as approved.

### Category slugs

``` text
senior-care
tech-for-seniors
bridging-generations
```

Do not create additional categories without approval.

------------------------------------------------------------------------

# 5. Route Architecture

## Required routes

``` text
/blogs
/blogs/[slug]
```

### Blog listing

``` text
/blogs
```

Responsibilities:

-   Display the blog introduction/hero.
-   Display category navigation.
-   Display approved articles.
-   Support the approved filtering behavior.
-   Display featured content if already specified/approved.
-   Display pagination when required by the approved design.
-   Link to article detail pages.

### Article detail

``` text
/blogs/[slug]
```

Responsibilities:

-   Resolve the article by slug.
-   Render the approved article content.
-   Render article metadata.
-   Render featured image.
-   Render related articles.
-   Render the existing global CTA/footer structure where approved.
-   Generate article-specific SEO metadata and structured data.

------------------------------------------------------------------------

# 6. Recommended Repository Structure

Follow the IABM engineering architecture.

``` text
src/
├── app/
│   └── blogs/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
│
├── components/
│   ├── sections/
│   │   ├── BlogHero.tsx
│   │   ├── BlogCategoryNav.tsx
│   │   ├── FeaturedBlog.tsx
│   │   ├── BlogGrid.tsx
│   │   ├── BlogCard.tsx
│   │   ├── BlogPagination.tsx
│   │   └── RelatedBlogs.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   └── ui/
│
├── content/
│   └── blog/
│       ├── categories.ts
│       ├── posts.ts
│       └── tags.ts
│
├── lib/
│   └── seo/
│
├── config/
│
├── types/
│   └── blog.ts
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

If the existing project already has equivalent files or architecture,
reuse them rather than restructuring the project unnecessarily.

------------------------------------------------------------------------

# 7. Content Layer

The blog content must remain separate from presentation.

## Recommended files

``` text
src/content/blog/categories.ts
src/content/blog/posts.ts
src/content/blog/tags.ts
```

### Category model

``` ts
export type BlogCategory =
  | "senior-care"
  | "tech-for-seniors"
  | "bridging-generations";
```

### Article model

Use a typed model similar to:

``` ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;

  category: BlogCategory;
  tags: string[];

  featuredImage: string;
  imageAlt: string;

  author?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;

  featured?: boolean;

  seo: {
    title: string;
    description: string;
  };
}
```

If the approved articles require rich article-body content, extend the
model to support the project's chosen Markdown/MDX/content
representation.

Do not introduce a CMS unless the existing project or approved
publishing workflow requires one.

------------------------------------------------------------------------

# 8. Article Content Rendering

The article detail page should render structured content rather than
placing the entire article directly inside a React component.

Supported content structures may include:

``` text
Paragraphs
H2
H3
Lists
Images
Links
Quotes where approved
Callouts where approved
Tables where required
FAQ sections where already part of the approved article
```

The renderer must preserve the approved article's content and hierarchy.

Do not modify article copy to fit the renderer.

If the renderer cannot represent an approved content element, implement
the renderer support rather than changing the article.

------------------------------------------------------------------------

# 9. Blog Listing Implementation

Implement the page in this order:

``` text
Existing Header
        ↓
Blog Hero
        ↓
Category Navigation
        ↓
Featured Article if approved
        ↓
Article Grid
        ↓
Pagination if required
        ↓
Existing CTA if approved
        ↓
Existing Footer
```

The page should remain content-focused.

Do not add unrelated marketing sections simply to make the page longer.

------------------------------------------------------------------------

# 10. Category Filtering

Implement the approved category behavior.

Default:

``` text
/blogs
```

shows all published articles.

Category selection:

``` text
/blogs?category=senior-care
/blogs?category=tech-for-seniors
/blogs?category=bridging-generations
```

If the existing approved implementation uses route-based category pages
instead, follow that architecture.

### Filtering requirements

-   Active category must be visually clear.
-   Filtering must be keyboard accessible.
-   Pagination must reset to page 1 after category changes.
-   Invalid category values must fail safely.
-   Empty categories must have a useful empty state.
-   Existing query parameters must not cause unexpected rendering
    errors.

------------------------------------------------------------------------

# 11. Article Ordering

Default ordering:

``` text
Newest → Oldest
```

Use the approved publication date.

Do not manipulate dates for SEO or artificially make old content appear
new.

If an article has an approved `featured` state, use that state instead
of creating arbitrary prioritisation logic.

------------------------------------------------------------------------

# 12. Article Cards

Each card should support the approved information hierarchy:

``` text
Featured Image
Category
Article Title
Short Excerpt
Published Date
Optional Reading Time
Read Article
```

The exact visual design must inherit the existing IABM design system.

### Card behavior

-   Entire card may be clickable if implemented accessibly.
-   Link destination must be `/blogs/[slug]`.
-   Hover interaction must be subtle.
-   Keyboard focus must be visible.
-   Reduced-motion preferences must be respected.
-   No unnecessary animation libraries should be introduced.

------------------------------------------------------------------------

# 13. Article Detail Architecture

Recommended structure:

``` text
BlogDetailPage
│
├── Existing Header
├── Breadcrumbs
├── ArticleHeader
│   ├── Category
│   ├── H1
│   ├── Published Date
│   ├── Author if approved
│   └── Reading Time if approved
├── ArticleHero
├── ArticleContent
├── RelatedBlogs
├── Approved CTA / Newsletter section
└── Existing Footer
```

Do not create a separate blog-only header/footer unless the existing
architecture explicitly supports such a variant.

------------------------------------------------------------------------

# 14. Related Articles

At the end of each article, display related approved articles when
enough content exists.

Recommended selection order:

``` text
1. Same category
2. Shared tags
3. Similar topic/search intent
4. Recent relevant content
```

Do not recommend unrelated articles merely to fill a fixed number.

Target:

``` text
Approximately 3 related articles
```

when the available content supports it.

------------------------------------------------------------------------

# 15. Search

Search is **not required for the initial implementation** unless it
already exists in the approved design/source.

Do not add a search system simply because it may be useful.

If search is already approved, it should search the appropriate content
fields without changing the article content.

------------------------------------------------------------------------

# 16. Pagination

Implement pagination if required by the approved blog specification or
current article inventory.

Requirements:

-   Clear current-page state.
-   Previous/next controls where applicable.
-   Keyboard accessibility.
-   No broken page states.
-   Category filter state must persist.
-   Pagination should not create duplicate or confusing canonical URLs.

If the current article inventory is small enough that pagination is
unnecessary, do not add complexity solely for pagination.

------------------------------------------------------------------------

# 17. SEO Implementation

Every indexable blog page must have:

``` text
Unique <title>
Unique meta description
Canonical URL
One H1
Logical H2/H3 hierarchy
Open Graph metadata
Social preview image where applicable
```

### Blog listing

Use approved page-level metadata.

### Article pages

Generate metadata from the article's approved SEO fields.

Do not invent SEO claims that are inconsistent with the article.

The IABM standard requires unique titles, useful descriptions, canonical
URLs, correct headings, sitemap/indexation hygiene and appropriate
structured data.

------------------------------------------------------------------------

# 18. Structured Data

For article pages, implement:

``` text
Article
BreadcrumbList
```

where accurate and eligible.

Do not add:

``` text
Review
Rating
FAQ
MedicalProfessional
Person
Organization
```

schema simply for SEO unless the visible page genuinely supports it and
the implementation is approved.

Structured data must match visible content.

------------------------------------------------------------------------

# 19. Sitemap

Ensure all approved public, indexable blog URLs are included in the XML
sitemap.

Example:

``` text
/blogs
/blogs/article-one
/blogs/article-two
/blogs/article-three
```

Exclude:

``` text
Private pages
Duplicate URLs
Noindex pages
Utility states
Invalid article routes
```

Use the existing `sitemap.ts` architecture.

Do not create a second sitemap system.

------------------------------------------------------------------------

# 20. Robots and Canonicals

Verify:

-   `/blogs` is indexable.
-   Approved article pages are indexable.
-   No accidental `noindex` exists.
-   Canonicals point to the preferred public URL.
-   Query-based filtering does not accidentally create unwanted
    canonical/indexation behavior.
-   Invalid slugs return the correct 404 behavior.

Robots.txt must not be used as a substitute for `noindex`.

------------------------------------------------------------------------

# 21. Internal Linking

Every article should have useful internal links where the approved
content supports them.

Target:

``` text
1 primary relevant website/conversion page
+
2–4 genuinely related articles/pages
```

Do not insert links purely to hit a numerical target.

Use descriptive anchor text.

Avoid repeated forced exact-match anchors.

The objective is useful navigation and stronger information
architecture.

------------------------------------------------------------------------

# 22. Analytics

Implement only meaningful blog interactions.

Potential events from the approved blog specification include:

``` text
blog_view
blog_category_click
blog_article_click
blog_pagination_click
blog_related_article_click
blog_search
blog_newsletter_view
blog_newsletter_submit
```

Only implement events that correspond to actual UI behavior.

### Event naming

Use:

``` text
lowercase_snake_case
```

Do not send:

-   Names
-   Email addresses
-   Phone numbers
-   Form text
-   Other personally identifiable information

to GA4 event parameters.

Do not mark routine page views or scrolling as business conversions.

------------------------------------------------------------------------

# 23. Performance

The blog must not become an image-heavy or JavaScript-heavy section.

Requirements:

-   Use `next/image` where applicable.
-   Use WebP/AVIF where practical.
-   Provide meaningful image dimensions.
-   Lazy-load below-the-fold images.
-   Avoid oversized hero assets.
-   Do not load all article-body content on the listing page.
-   Keep client-side JavaScript minimal.
-   Avoid unnecessary animation dependencies.
-   Prevent layout shift.
-   Verify Core Web Vitals impact.

Target the IABM baseline:

``` text
LCP ≤ 2.5s
INP < 200ms
CLS < 0.1
```

at the 75th percentile where measurable.

------------------------------------------------------------------------

# 24. Image Implementation

Use meaningful filenames following the IABM asset convention.

Example:

``` text
blog-tech-seniors-ai-v1.webp
blog-senior-care-community-v1.webp
blog-bridging-generations-conversation-v1.webp
```

Do not use:

``` text
IMG_1234.jpg
new-image-final.png
banner-final-final.jpg
```

Every informative image needs meaningful alt text.

Decorative images should not add unnecessary screen-reader noise.

------------------------------------------------------------------------

# 25. Accessibility

Required baseline:

-   Semantic `<main>`.
-   One logical H1 per page.
-   Correct H2/H3 hierarchy.
-   Keyboard-accessible category controls.
-   Visible focus states.
-   Accessible link/button names.
-   Meaningful alt text.
-   Sufficient contrast.
-   No information conveyed only through color.
-   Reduced-motion support.
-   No horizontal overflow.
-   Readable typography on mobile.
-   Appropriate touch target sizing.

Category filters must work without requiring a mouse.

------------------------------------------------------------------------

# 26. Responsive QA

Verify at minimum:

``` text
1440px
1024px
768px
390px
360px
```

Check:

-   Header.
-   Blog hero.
-   Category navigation.
-   Article cards.
-   Featured article.
-   Pagination.
-   Article detail.
-   Images.
-   Typography.
-   Related articles.
-   CTA.
-   Footer.
-   No horizontal overflow.

Also test on an actual mobile device where available.

------------------------------------------------------------------------

# 27. Component Responsibility

Follow the IABM responsibility model.

### UI components

Generic reusable primitives:

``` text
Button
Badge
Card
Pagination
```

### Layout components

Global shell:

``` text
Header
Footer
Breadcrumbs
Container
```

### Business-facing sections

Blog-specific sections:

``` text
BlogHero
BlogCategoryNav
FeaturedBlog
BlogGrid
BlogCard
BlogPagination
RelatedBlogs
```

### Page files

Pages should compose components.

Avoid putting the following together in one giant page file:

``` text
Content data
Filtering logic
SEO
Analytics
Card UI
Pagination
Article rendering
Footer
```

------------------------------------------------------------------------

# 28. Existing Design System Rule

The blog must use the existing IABM website design system.

Before styling, inspect:

``` text
Primary colors
Secondary colors
Accent colors
Backgrounds
Typography
Spacing
Container widths
Border radius
Shadows
Buttons
Cards
Breakpoints
Focus states
Animation behavior
```

Do not create a separate blog palette.

Do not introduce a new font without approval.

Do not copy the visual identity of any reference website.

The existing IABM website is the visual source of truth.

------------------------------------------------------------------------

# 29. No Unnecessary Refactor

Do not restructure the existing website merely to make the blog
architecture look cleaner.

Before adding a new file:

1.  Search for an existing equivalent.
2.  Reuse it if it fits.
3.  Extend it minimally if necessary.
4.  Create a new component only when responsibility is genuinely
    distinct.

This follows the master standard's principle of preserving working
architecture and avoiding unnecessary rewrites.

------------------------------------------------------------------------

# 30. Development Workflow

Follow the standard workflow:

``` text
Requirement
    ↓
CR / implementation scope
    ↓
Technical impact review
    ↓
Feature branch
    ↓
Development
    ↓
Local verification
    ↓
pnpm verify
    ↓
Staging
    ↓
Content / business review
    ↓
Corrections
    ↓
Approval
    ↓
Merge
    ↓
Production
    ↓
Production verification
    ↓
CHANGELOG / CR closure
```

Suggested branch:

``` text
feature/blog-system
```

or the project's existing naming convention.

------------------------------------------------------------------------

# 31. Recommended Implementation Phases

## Phase 0 --- Inspect Existing Site

-   [ ] Inspect current repository architecture.
-   [ ] Inspect existing routes.
-   [ ] Inspect current Header/Footer.
-   [ ] Inspect design tokens.
-   [ ] Inspect existing SEO utilities.
-   [ ] Inspect sitemap and robots implementation.
-   [ ] Inspect analytics abstraction.
-   [ ] Inspect existing image handling.
-   [ ] Inspect existing content architecture.
-   [ ] Confirm whether MD/MDX/TS/JSON/CMS is already used.

**Do not start by rewriting architecture.**

------------------------------------------------------------------------

## Phase 1 --- Blog Content Model

-   [ ] Create/reuse `BlogPost` type.
-   [ ] Create/reuse category type.
-   [ ] Create/reuse tags structure.
-   [ ] Import the approved blog content unchanged.
-   [ ] Add approved article metadata.
-   [ ] Add approved images and alt text.
-   [ ] Validate slugs for uniqueness.
-   [ ] Validate required fields.

------------------------------------------------------------------------

## Phase 2 --- Blog Listing

-   [ ] Create/reuse `/blogs`.
-   [ ] Implement BlogHero.
-   [ ] Implement category navigation.
-   [ ] Implement article collection.
-   [ ] Implement featured article if approved.
-   [ ] Implement BlogCard.
-   [ ] Implement filtering.
-   [ ] Implement pagination if required.
-   [ ] Implement empty state.
-   [ ] Connect existing Header/Footer.

------------------------------------------------------------------------

## Phase 3 --- Article Detail

-   [ ] Create/reuse `/blogs/[slug]`.
-   [ ] Resolve article by slug.
-   [ ] Implement article header.
-   [ ] Implement article metadata.
-   [ ] Implement featured image.
-   [ ] Implement structured article content rendering.
-   [ ] Implement related articles.
-   [ ] Implement approved CTA/newsletter section.
-   [ ] Implement 404 behavior for invalid slugs.

------------------------------------------------------------------------

## Phase 4 --- SEO

-   [ ] Blog listing metadata.
-   [ ] Article metadata.
-   [ ] Canonical URLs.
-   [ ] Open Graph metadata.
-   [ ] Article schema.
-   [ ] Breadcrumb schema.
-   [ ] Sitemap inclusion.
-   [ ] Robots verification.
-   [ ] Heading hierarchy.
-   [ ] Image alt text.
-   [ ] Internal links.
-   [ ] Validate structured data.

------------------------------------------------------------------------

## Phase 5 --- Analytics

-   [ ] Verify existing analytics implementation.
-   [ ] Add blog events that correspond to real UI actions.
-   [ ] Keep event names lowercase snake_case.
-   [ ] Do not send PII.
-   [ ] Test events in GA4 DebugView/Realtime where applicable.
-   [ ] Confirm events are not duplicated.

------------------------------------------------------------------------

## Phase 6 --- Accessibility + Performance

-   [ ] Keyboard navigation.
-   [ ] Visible focus states.
-   [ ] Screen-reader labels.
-   [ ] Contrast verification.
-   [ ] Reduced motion.
-   [ ] Responsive images.
-   [ ] Lazy loading.
-   [ ] Layout-shift prevention.
-   [ ] Mobile performance.
-   [ ] Core Web Vitals check.

------------------------------------------------------------------------

## Phase 7 --- QA

### Functional

-   [ ] `/blogs` loads.
-   [ ] Every approved article appears correctly.
-   [ ] Every category works.
-   [ ] Category state is preserved as designed.
-   [ ] Article cards open correct URLs.
-   [ ] Article detail pages render correctly.
-   [ ] Invalid slugs return 404.
-   [ ] Pagination works if enabled.
-   [ ] Related articles work.
-   [ ] CTA links work.

### SEO

-   [ ] Unique title.
-   [ ] Meta description.
-   [ ] Canonical.
-   [ ] One H1.
-   [ ] Correct H2/H3 hierarchy.
-   [ ] Open Graph.
-   [ ] Article schema.
-   [ ] Breadcrumb schema.
-   [ ] Sitemap.
-   [ ] Robots.
-   [ ] No accidental noindex.
-   [ ] No broken internal links.

### Technical

-   [ ] No console errors.
-   [ ] No TypeScript errors.
-   [ ] No lint errors.
-   [ ] Production build passes.
-   [ ] `pnpm verify` passes.
-   [ ] No horizontal overflow.
-   [ ] No unexpected layout shifts.
-   [ ] No duplicate analytics events.

### Responsive

-   [ ] 1440px.
-   [ ] 1024px.
-   [ ] 768px.
-   [ ] 390px.
-   [ ] 360px.
-   [ ] Real mobile device where available.

------------------------------------------------------------------------

# 32. Content QA --- Separate From Engineering QA

Because the blogs are locked, content review must be separated from
implementation QA.

### Developer checks

``` text
Correct content loaded
Correct slug
Correct category
Correct image
Correct alt text
Correct metadata
Correct links
Correct rendering
```

### Editorial/business checks

``` text
Copy accuracy
Approved title
Approved article body
Approved CTA
Approved claims
Approved publication date
Approved author/reviewer
```

If an editorial issue is found, do not correct it silently in code.

------------------------------------------------------------------------

# 33. Production Release

Before production:

-   [ ] Staging review completed.
-   [ ] Approved content confirmed.
-   [ ] SEO checked.
-   [ ] Analytics checked.
-   [ ] Mobile QA completed.
-   [ ] Build verified.
-   [ ] Backup/version control confirmed.
-   [ ] Change log updated.
-   [ ] Production deployment approved.

After deployment:

-   [ ] Open `/blogs`.
-   [ ] Open at least one article from each category.
-   [ ] Test category filtering.
-   [ ] Test primary CTA.
-   [ ] Check browser console.
-   [ ] Check page source/metadata.
-   [ ] Verify canonical.
-   [ ] Verify sitemap.
-   [ ] Verify analytics events.
-   [ ] Check Search Console live URL inspection for priority pages when
    appropriate.

------------------------------------------------------------------------

# 34. Definition of Done

The blog implementation is complete only when:

-   [ ] Existing website design language is preserved.
-   [ ] Approved blog content is unchanged.
-   [ ] `/blogs` works.
-   [ ] `/blogs/[slug]` works.
-   [ ] All three approved categories work.
-   [ ] Article cards navigate correctly.
-   [ ] Filtering works as approved.
-   [ ] Pagination works if required.
-   [ ] Related articles work.
-   [ ] Images are optimized.
-   [ ] Alt text is present.
-   [ ] Metadata exists.
-   [ ] Canonicals are correct.
-   [ ] Sitemap contains public blog URLs.
-   [ ] Robots/indexability are correct.
-   [ ] Structured data is valid where applicable.
-   [ ] Internal linking is implemented where content supports it.
-   [ ] Accessibility baseline passes.
-   [ ] Mobile layouts pass.
-   [ ] No horizontal overflow exists.
-   [ ] No console errors exist.
-   [ ] Analytics events are correctly implemented without PII.
-   [ ] Production build passes.
-   [ ] Existing Header/Footer remain consistent.
-   [ ] No external brand identity has been copied.
-   [ ] No unnecessary architecture refactor was introduced.
-   [ ] Change log/CR is updated.

------------------------------------------------------------------------

# 35. Out of Scope

Unless separately approved, this task does **not** include:

-   Rewriting existing blogs.
-   Creating additional blogs.
-   Creating additional categories.
-   Rebranding the website.
-   Rebuilding the global Header/Footer.
-   Replacing the current framework.
-   Introducing a CMS.
-   Introducing a database.
-   Introducing a separate blog design system.
-   Adding advanced search.
-   Adding comments.
-   Adding ratings/reviews.
-   Adding unrelated marketing sections.
-   Adding unsupported SEO claims.
-   Creating fake authors or credentials.
-   Creating fake statistics or testimonials.

------------------------------------------------------------------------

# 36. Final Engineering Principle

The implementation should follow this model:

``` text
APPROVED BLOG CONTENT
        ↓
STRUCTURED CONTENT LAYER
        ↓
REUSABLE BLOG COMPONENTS
        ↓
EXISTING IABM DESIGN SYSTEM
        ↓
SEO + ACCESSIBILITY + PERFORMANCE
        ↓
ANALYTICS
        ↓
QA
        ↓
STAGING
        ↓
PRODUCTION
```

The key rule is:

> **Change the implementation to fit the approved content --- never
> change the approved content to make implementation easier.**

------------------------------------------------------------------------

## Source Basis

This implementation plan is based on the uploaded:

-   I Am Buzz Maker Web Engineering Master Standard v1.0.
-   I Am Buzz Maker Website AI Context.
-   IABM Blog Page Design Specification.
-   Approved project blog/content direction available in the project
    context.

The master standard specifically requires separation of content from
presentation and places structured blog content under
`src/content/blog/`. It also defines the standard
route/component/content architecture and staged QA workflow.

The IABM website context requires people-first content, one clear search
intent per article, original value, internal linking, human editorial
review, SEO metadata, canonical/indexability checks, structured data
where accurate, mobile QA and analytics verification.

The existing blog design specification defines the three-category
architecture, `/blogs` and `/blogs/[slug]` routes, reusable blog
components, SEO requirements, accessibility, responsive QA and
definition of done.

**Content remains unchanged. This document defines how the approved
blogs are implemented.**
