import { blogCategories, blogPosts, type BlogPost } from "./blog-data.generated";

const primaryOrigin = "https://tuhitu.org";

const imagePool = [
  {
    src: "/images/mission-companionship.webp",
    alt: "An elder and a companion sharing an outdoor walk and conversation",
  },
  {
    src: "/images/hero-weekly-call.webp",
    alt: "An elder smiling during a weekly video or phone companionship call",
  },
  {
    src: "/images/community-stories.webp",
    alt: "Companions and elders sharing stories and laughter together",
  },
  {
    src: "/images/news-letter-exchange.webp",
    alt: "An elder and a volunteer exchanging letters and thoughtful conversation",
  },
  {
    src: "/images/news-community-partnership.webp",
    alt: "A community-led elder engagement session with volunteers and organisers",
  },
];

const imageBySlug: Record<string, (typeof imagePool)[number]> = {
  "what-does-adopt-an-elder-mean": imagePool[0],
  "how-to-volunteer-with-elderly-in-india": imagePool[2],
  "elder-companionship-in-india": imagePool[0],
  "activities-with-senior-citizens": imagePool[2],
  "how-tuhitu-cares-matches-elders-and-companions": imagePool[4],
  "volunteer-boundaries-elder-friendship": imagePool[1],
  "support-elder-social-isolation": imagePool[3],
  "consistency-in-elder-volunteering": imagePool[1],
  "intergenerational-friendship": imagePool[0],
  "conversation-starters-with-elders": imagePool[3],
  "helping-seniors-with-technology": imagePool[3],
  "festival-volunteering-with-senior-citizens": imagePool[2],
  "care-home-volunteer-companionship-programme": imagePool[4],
  "college-volunteering-senior-citizens": imagePool[2],
  "corporate-volunteering-senior-citizens-india": imagePool[4],
};

const linkMap: Record<string, string> = {
  "/adopt-an-elder/": "/about/our-model",
  "/volunteer-with-elders/": "/volunteer#volunteer-enquiry",
  "/for-elders-and-families/": "/?action=elder-registration",
  "/safety-and-safeguarding/": "/about/governance#safeguarding",
  "/locations/": "/about/impact",
  "/companionship-for-elderly/": "/blogs/elder-companionship-in-india",
  "/resources/community-csr/festival-volunteering-with-senior-citizens/":
    "/blogs/festival-volunteering-with-senior-citizens",
  "/csr-partnerships/": "/sponsor",
  "/impact/": "/about/impact",
  "/community-experiences/": "/about/stories",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeJsonForScript(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function getOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return primaryOrigin;
  }
}

function normalizeInternalLink(href: string) {
  const normalized = linkMap[href] ?? href;
  return normalized === "/volunteer" ? "/volunteer#volunteer-enquiry" : normalized;
}

function getImageForPost(index: number) {
  const post = blogPosts[index];
  return (post && imageBySlug[post.slug]) || imagePool[index % imagePool.length];
}

function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

function getCategoryLabel(slug: string | null) {
  if (!slug) return "All Articles";
  return blogCategories.find((category) => category.slug === slug)?.label ?? "All Articles";
}

function parseArticleBlocks(raw: string) {
  return raw
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const bulletLines = lines.filter((line) => line.startsWith("•"));
      if (bulletLines.length === lines.length) {
        return [{ type: "list" as const, items: bulletLines.map((line) => line.replace(/^•\s*/, "").replace(/;$/, "")) }];
      }

      if (bulletLines.length > 0) {
        const introLines = lines.filter((line) => !line.startsWith("•"));
        return [
          ...(introLines.length
            ? [{ type: "paragraph" as const, text: introLines.join(" ") }]
            : []),
          { type: "list" as const, items: bulletLines.map((line) => line.replace(/^•\s*/, "").replace(/;$/, "")) },
        ];
      }

      if (lines.length === 1 && lines[0].split(/\s+/).length <= 12 && !/[.:]$/.test(lines[0])) {
        return [{ type: "heading" as const, text: lines[0] }];
      }

      if (lines.length === 1 && /^\d+\.\s+/.test(lines[0])) {
        return [{ type: "heading" as const, text: lines[0] }];
      }

      return [{ type: "paragraph" as const, text: lines.join(" ") }];
    });
}

function renderArticleBody(raw: string) {
  return parseArticleBlocks(raw)
    .map((block) => {
      if (block.type === "heading") {
        return `<h2>${escapeHtml(block.text)}</h2>`;
      }

      if (block.type === "list") {
        return `<ul class="blog-article-list">${block.items
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${escapeHtml(block.text)}</p>`;
    })
    .join("");
}

function renderRelatedPosts(post: BlogPost) {
  const related = blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((left, right) => {
      if (left.categorySlug === post.categorySlug && right.categorySlug !== post.categorySlug) return -1;
      if (right.categorySlug === post.categorySlug && left.categorySlug !== post.categorySlug) return 1;
      return left.id.localeCompare(right.id);
    })
    .slice(0, 3);

  return related
    .map((relatedPost) => {
      const index = blogPosts.findIndex((candidate) => candidate.slug === relatedPost.slug);
      const image = getImageForPost(index);
      return `
        <article class="blog-card related-blog-card">
          <a class="blog-card-thumb" href="/blogs/${relatedPost.slug}">
            <img src="${image.src}" alt="${escapeHtml(image.alt)}" width="1584" height="990" loading="lazy" decoding="async">
          </a>
          <div class="blog-card-body">
            <span class="blog-chip">${escapeHtml(relatedPost.category)}</span>
            <h3><a href="/blogs/${relatedPost.slug}">${escapeHtml(relatedPost.title)}</a></h3>
            <p>${escapeHtml(relatedPost.excerpt)}</p>
            <a class="blog-link" href="/blogs/${relatedPost.slug}">Read Article <i class="fa-solid fa-arrow-right"></i></a>
          </div>
        </article>`;
    })
    .join("");
}

function renderSidebarBlogLinks(post: BlogPost) {
  const links = blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((left, right) => {
      if (left.categorySlug === post.categorySlug && right.categorySlug !== post.categorySlug) return -1;
      if (right.categorySlug === post.categorySlug && left.categorySlug !== post.categorySlug) return 1;
      return left.id.localeCompare(right.id);
    })
    .slice(0, 6);

  return links
    .map(
      (item) => `<li>
        <a href="/blogs/${item.slug}">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.excerpt)}</span>
        </a>
      </li>`,
    )
    .join("");
}

function renderListCards(posts: BlogPost[], activeCategory: string | null) {
  if (!posts.length) {
    return `<div class="blog-empty-state"><h2>No articles in this category yet.</h2><p>Try another category or browse all approved TuHiTu Satya articles.</p><a class="btn btn-primary" href="/blogs">View all blogs</a></div>`;
  }

  return posts
    .map((post) => {
      const index = blogPosts.findIndex((candidate) => candidate.slug === post.slug);
      const image = getImageForPost(index);
      return `
        <article class="blog-card">
          <a class="blog-card-thumb" href="/blogs/${post.slug}">
            <img src="${image.src}" alt="${escapeHtml(image.alt)}" width="1584" height="990" loading="lazy" decoding="async">
          </a>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span class="blog-chip">${escapeHtml(post.category)}</span>
              <span class="blog-meta-note">${escapeHtml(activeCategory ? "Filtered view" : "Approved draft")}</span>
            </div>
            <h2><a href="/blogs/${post.slug}">${escapeHtml(post.title)}</a></h2>
            <p>${escapeHtml(post.excerpt)}</p>
            <div class="blog-card-footer">
              <span>${escapeHtml(post.primaryKeyword)}</span>
              <a class="blog-link" href="/blogs/${post.slug}">Read Article <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </article>`;
    })
    .join("");
}

function renderCategoryNav(activeCategory: string | null) {
  const allChip = `<a class="blog-filter${activeCategory ? "" : " active"}" href="/blogs">All</a>`;
  const categoryChips = blogCategories
    .map((category) => {
      const isActive = category.slug === activeCategory;
      return `<a class="blog-filter${isActive ? " active" : ""}" href="/blogs?category=${category.slug}">${escapeHtml(category.label)}</a>`;
    })
    .join("");

  return `${allChip}${categoryChips}`;
}

function renderHead(
  title: string,
  description: string,
  canonical: string,
  pageType = "website",
) {
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="theme-color" content="#0B1F3A"><meta name="codex-preview" content="development"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="${escapeHtml(pageType)}"><meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:image" content="${escapeHtml(primaryOrigin)}/images/community-stories.webp"><link rel="canonical" href="${escapeHtml(canonical)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"><link rel="stylesheet" href="/css/style.css"><link rel="icon" type="image/png" href="https://res.cloudinary.com/s1yfknfm/image/upload/v1788437799/TuHiTu_Satya_Fav_Icon.png">`;
}

function renderHeader() {
  const aboutTrigger = `<div class="nav-dropdown">
        <button class="nav-dropdown-trigger" type="button" aria-expanded="false" aria-controls="aboutMenu">
          About <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="nav-dropdown-menu" id="aboutMenu">
          <a href="/about">About TuHiTu Satya</a>
          <a href="/about/our-model">Our Mission &amp; Model</a>
          <a href="/about/impact">Impact &amp; Reach</a>
          <a href="/about/stories">Stories &amp; Updates</a>
          <a href="/about/governance">Governance &amp; Safeguarding</a>
        </div>
      </div>`;

  return `<header class="site-header" id="siteHeader">
  <div class="container nav-wrap">
    <a href="/" class="brand" aria-label="TuHiTu Satya home">
      <img src="https://res.cloudinary.com/s1yfknfm/image/upload/v1788437799/TuHiTu_Satya_Logo.png" alt="TuHiTu Satya logo" class="header-logo" style="width: 100%; max-width: 250px; height: auto; display: block; border-radius: 4px;" loading="eager" decoding="async">
    </a>
    <nav class="main-nav" id="mainNav" aria-label="Primary navigation">
      ${aboutTrigger}
      <a href="/sponsor">Sponsor</a>
      <a href="/partner-with-us">Partner With Us</a>
      <a href="/care-homes">Care Homes</a>
      <div class="nav-btn" style="display: flex; align-items: center;"><a href="/?action=elder-registration" data-elder-registration-trigger class="btn btn-primary btn-sm"><i class="fa-solid fa-user-plus"></i><span>Register an Elder</span></a></div>
    </nav>
    <div class="header-actions">
      <a href="/volunteer#volunteer-enquiry" class="btn btn-ghost btn-sm"><i class="fa-solid fa-user-plus"></i><span>Become a Companion</span></a>
      <span class="donate-action">
        <a href="/donate" class="btn btn-primary btn-sm"><i class="fa-solid fa-heart"></i><span>Donate</span></a>
        <span class="tax-note">
          <i class="fa-solid fa-certificate" aria-hidden="true"></i>
          <span class="tax-label-full">80G Tax Benefit Available*</span>
          <span class="tax-label-short">80G Available*</span>
        </span>
      </span>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
        <i class="fa-solid fa-bars"></i>
      </button>
    </div>
  </div>
</header>
<div class="nav-backdrop" id="navBackdrop"></div>`;
}

function renderFooter() {
  return `<footer class="site-footer" id="contact"><div class="container"><div class="footer-grid"><div class="footer-brand">
      <a href="/" class="brand"><img src="https://res.cloudinary.com/s1yfknfm/image/upload/v1788437799/TuHiTu_Satya_Logo.png" alt="TuHiTu Satya logo" class="header-logo" style="width: 100%; max-width: 250px; height: auto; display: block; border-radius: 4px;" loading="lazy" decoding="async"></a>
      <a href="https://fdhs.in/" target="_blank" rel="noopener noreferrer" class="initiative-block" style="text-decoration: none;"><span>An initiative by FDHS</span><img src="https://res.cloudinary.com/dfb2esugz/image/upload/v1787512877/fdhs-logo_y6q1nc.png" alt="Federation of Digital Health Sciences" width="393" height="162" loading="lazy" decoding="async"></a>
    </div><div class="footer-col"><h4>Get Involved</h4>
        <ul>
          <li><a href="/volunteer#volunteer-enquiry">Become a Companion</a></li>
          <li><a href="/sponsor">Become a Sponsor</a></li>
          <li><a href="/donate">Donate</a></li>
          <li><a href="/partner-with-us">Partner With Us</a></li>
          <li><a href="/?action=elder-registration" data-elder-registration-trigger>Register an Elder</a></li>
          <li><a href="/care-homes">Care Homes</a></li>
        </ul></div><div class="footer-col"><h4>About</h4><ul><li><a href="/about">About TuHiTu Satya</a></li><li><a href="/about/our-model">Our Model</a></li><li><a href="/about/impact">Impact &amp; Reach</a></li><li><a href="/about/stories">Stories &amp; Updates</a></li><li><a href="/blogs">Blogs</a></li><li><a href="/about/governance">Governance &amp; Safeguarding</a></li></ul></div><div class="footer-col footer-contact"><h4>Contact</h4><ul><li><i class="fa-solid fa-envelope"></i><a href="mailto:connect@tuhitu.org">connect@tuhitu.org</a></li><li><i class="fa-solid fa-phone"></i><a href="tel:+919599661292">+91 9218191502</a></li><li><i class="fa-solid fa-location-dot"></i><span><strong>India:</strong> Gurgaon · Chandigarh · Pune</span></li><li><i class="fa-solid fa-earth-asia"></i><span><strong>International contact:</strong> Dubai</span></li></ul></div></div><div class="footer-compliance"><p><strong>Programme notice:</strong> Registration does not guarantee matching, approval, funding or participation.</p><p><strong>80G:</strong> Eligible Indian donations may qualify, subject to applicable law and a valid receipt.</p></div><div class="footer-bottom"><span>© 2026 TuHiTu Satya. All rights reserved.</span><div class="legal-links"><a href="/about/governance#privacy">Privacy Policy</a><a href="/?content=terms">Terms of Use</a><a href="/about/governance#safeguarding">Safeguarding</a><a href="/about/governance#donations">Donation Policy</a><a href="/about/governance#grievance">Grievance &amp; Complaints</a></div></div><p class="footer-credit">Made by <a href="https://iambuzzmaker.com/" target="_blank" rel="noopener noreferrer">I AM BUZZ MAKER</a></p></div></footer><button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button><div class="toast" id="toast" role="status" aria-live="polite"><i class="fa-solid fa-circle-info"></i><span id="toastMsg"></span></div><script src="/js/script.js"></script><script src="/js/form.js"></script>`;
}

export function renderBlogsIndexPage(requestUrl: string) {
  const url = new URL(requestUrl);
  const category = url.searchParams.get("category");
  const validCategory = blogCategories.some((item) => item.slug === category) ? category : null;
  const filteredPosts = validCategory
    ? blogPosts.filter((post) => post.categorySlug === validCategory)
    : blogPosts;
  const featuredPost = filteredPosts[0] ?? blogPosts[0];
  const featuredIndex = blogPosts.findIndex((post) => post.slug === featuredPost.slug);
  const featuredImage = getImageForPost(featuredIndex);
  const origin = getOrigin(requestUrl);
  const canonical = validCategory
    ? `${origin}/blogs?category=${validCategory}`
    : `${origin}/blogs`;

  return `<!DOCTYPE html><html lang="en"><head>${renderHead(
    "Blogs | TuHiTu Satya",
    "Explore TuHiTu Satya blogs on elder companionship, volunteering, care-home engagement and intergenerational connection.",
    canonical,
  )}</head><body class="blog-page blog-index-page"><a class="skip-link" href="#main-content">Skip to main content</a>${renderHeader()}<main id="main-content"><section class="blog-hero"><div class="dot-grid" aria-hidden="true"></div><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><i class="fa-solid fa-chevron-right"></i><span>Blogs</span></nav><div class="blog-hero-grid"><div class="blog-hero-copy reveal"><span class="eyebrow">TuHiTu Satya Blogs</span><h1>Stories, guidance and dignity-first thinking for elder companionship.</h1><p>These 15 publication-ready articles bring together TuHiTu Satya guidance on volunteering, elder companionship, care-home engagement and responsible intergenerational connection.</p><div class="blog-hero-points"><span><i class="fa-solid fa-book-open"></i> 15 approved drafts</span><span><i class="fa-solid fa-layer-group"></i> ${escapeHtml(getCategoryLabel(validCategory))}</span><span><i class="fa-solid fa-shield-heart"></i> Site theme and safeguards preserved</span></div></div><aside class="blog-hero-card reveal"><span class="mini-label">Featured article</span><h2>${escapeHtml(featuredPost.title)}</h2><p>${escapeHtml(featuredPost.excerpt)}</p><a class="btn btn-primary" href="/blogs/${featuredPost.slug}">Read Featured Article</a></aside></div></div></section><section class="blog-filter-bar"><div class="container"><div class="blog-filter-shell"><span class="blog-filter-label">Browse by topic</span><div class="blog-filter-list">${renderCategoryNav(validCategory)}</div></div></div></section><section class="section-pad blog-featured-section"><div class="container"><div class="blog-featured-card reveal"><a class="blog-featured-media" href="/blogs/${featuredPost.slug}"><img src="${featuredImage.src}" alt="${escapeHtml(featuredImage.alt)}" width="1584" height="990" loading="eager" decoding="async"></a><div class="blog-featured-copy"><span class="blog-chip">${escapeHtml(featuredPost.category)}</span><h2>${escapeHtml(featuredPost.title)}</h2><p>${escapeHtml(featuredPost.excerpt)}</p><div class="blog-featured-meta"><span><i class="fa-solid fa-bullseye"></i> ${escapeHtml(featuredPost.primaryKeyword)}</span><span><i class="fa-solid fa-sparkles"></i> ${escapeHtml(featuredPost.searchIntent)}</span></div><div class="section-actions"><a class="btn btn-primary" href="/blogs/${featuredPost.slug}">Read article</a><a class="text-link" href="/volunteer#volunteer-enquiry">Become a Companion <i class="fa-solid fa-arrow-right"></i></a></div></div></div></div></section><section class="section-pad blog-grid-section"><div class="container"><div class="section-head center reveal"><span class="eyebrow">All Articles</span><h2>Guidance built for real companionship work.</h2><p>Each article is organised to be useful for volunteers, families, care homes, institutions and CSR teams without drifting away from the TuHiTu Satya mission.</p></div><div class="blog-grid reveal-stagger reveal">${renderListCards(filteredPosts, validCategory)}</div></div></section></main>${renderFooter()}</body></html>`;
}

export function renderBlogDetailPage(requestUrl: string, slug: string) {
  const post = getPostBySlug(slug);
  if (!post) {
    return null;
  }

  const index = blogPosts.findIndex((item) => item.slug === post.slug);
  const image = getImageForPost(index);
  const origin = getOrigin(requestUrl);
  const canonical = `${origin}/blogs/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: [`${origin}${image.src}`],
    articleSection: post.category,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: "TuHiTu Satya",
      url: origin,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${origin}/blogs` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return `<!DOCTYPE html><html lang="en"><head>${renderHead(
    post.seoTitle,
    post.metaDescription,
    canonical,
    "article",
  )}<script type="application/ld+json">${escapeJsonForScript(
    articleJsonLd,
  )}</script><script type="application/ld+json">${escapeJsonForScript(
    breadcrumbJsonLd,
  )}</script></head><body class="blog-page blog-detail-page"><a class="skip-link" href="#main-content">Skip to main content</a>${renderHeader()}<main id="main-content"><article><section class="blog-article-hero"><div class="dot-grid" aria-hidden="true"></div><div class="container"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><i class="fa-solid fa-chevron-right"></i><a href="/blogs">Blogs</a><i class="fa-solid fa-chevron-right"></i><span>${escapeHtml(post.title)}</span></nav><div class="blog-article-head reveal"><span class="blog-chip">${escapeHtml(post.category)}</span><h1>${escapeHtml(post.title)}</h1><p class="blog-article-dek">${escapeHtml(post.excerpt)}</p><div class="blog-article-facts"><span><i class="fa-solid fa-bullseye"></i> ${escapeHtml(post.primaryKeyword)}</span><span><i class="fa-solid fa-layer-group"></i> ${escapeHtml(post.searchIntent)}</span><span><i class="fa-solid fa-file-lines"></i> Publication-ready master draft</span></div></div></div></section><section class="section-pad blog-article-shell"><div class="container blog-article-layout"><div class="blog-article-main"><figure class="blog-article-image"><img src="${image.src}" alt="${escapeHtml(image.alt)}" width="1584" height="990" loading="eager" decoding="async"></figure><div class="blog-article-content">${renderArticleBody(post.articleBody)}</div><section class="blog-inline-cta"><div><span class="eyebrow">Next Step</span><h2>${escapeHtml(post.primaryCta)}</h2><p>${escapeHtml(post.ctaBody)}</p></div><div class="about-cta-links"><a class="btn btn-primary" href="${normalizeInternalLink(post.internalLinks[0] ?? "/volunteer")}">${escapeHtml(post.primaryCta)}</a><a class="btn btn-ghost" href="${normalizeInternalLink(post.internalLinks[1] ?? "/blogs")}">${escapeHtml(post.secondaryCta)}</a></div></section><section class="blog-related-section"><div class="section-head"><span class="eyebrow">Related Articles</span><h2>Keep exploring the blog library.</h2></div><div class="blog-grid blog-related-grid">${renderRelatedPosts(post)}</div></section></div><aside class="blog-article-sidebar"><div class="blog-sidebar-stack"><div class="blog-sidebar-card blog-sidebar-panel"><div class="blog-sidebar-section"><span class="mini-label">More from this blog</span><h2>Read more articles on TuHiTu Satya</h2><ul class="blog-sidebar-links blog-sidebar-blog-links">${renderSidebarBlogLinks(post)}</ul></div></div><a class="blog-sidebar-action" href="/blogs">Browse all blogs <i class="fa-solid fa-arrow-right"></i></a></div></aside></div></section></article></main>${renderFooter()}</body></html>`;
}

export function createHtmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
}
