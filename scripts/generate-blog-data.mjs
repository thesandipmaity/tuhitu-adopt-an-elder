import fs from "node:fs";
import path from "node:path";

const sourcePath =
  "C:\\Users\\Sandip\\.codex\\attachments\\7f0c167c-1530-43e7-9e87-baf75778919b\\pasted-text.txt";
const outputPath = path.resolve(
  "src",
  "app",
  "blogs",
  "blog-data.generated.ts",
);

const raw = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

const blocks = raw
  .split(/=+\nBLOG \d+\n/)
  .slice(1)
  .map((block) => block.trim())
  .filter(Boolean);

const categoryMap = new Map();

const titleRewriteMap = {
  "what-does-adopt-an-elder-mean": {
    title: "Adopt an Elder in India: Meaning, Benefits and Boundaries",
    seoTitle: "Adopt an Elder in India: Meaning and Boundaries | TuHiTu Cares",
  },
  "how-to-volunteer-with-elderly-in-india": {
    title: "How to Volunteer With Senior Citizens in India",
    seoTitle: "How to Volunteer With Senior Citizens in India | TuHiTu Cares",
  },
  "elder-companionship-in-india": {
    title: "Elder Companionship in India: What It Is and Why It Matters",
    seoTitle: "Elder Companionship in India: What It Is | TuHiTu Cares",
  },
  "activities-with-senior-citizens": {
    title: "Activities for Senior Citizens: Meaningful Ideas for Connection",
    seoTitle: "Activities for Senior Citizens: Meaningful Ideas | TuHiTu Cares",
  },
  "how-tuhitu-cares-matches-elders-and-companions": {
    title: "How TuHiTu Cares Matches Elders and Companions",
    seoTitle: "How TuHiTu Cares Matches Elders and Companions",
  },
  "volunteer-boundaries-elder-friendship": {
    title: "Volunteer Boundaries With Senior Citizens: A Practical Guide",
    seoTitle: "Volunteer Boundaries With Senior Citizens | TuHiTu Cares",
  },
  "support-elder-social-isolation": {
    title: "How to Support Social Isolation in Older Adults",
    seoTitle: "How to Support Social Isolation in Older Adults | TuHiTu Cares",
  },
  "consistency-in-elder-volunteering": {
    title: "Why Consistency Matters in Elder Volunteering",
    seoTitle: "Why Consistency Matters in Elder Volunteering | TuHiTu Cares",
  },
  "intergenerational-friendship": {
    title: "Intergenerational Friendship: Benefits for Older Adults and Volunteers",
    seoTitle: "Intergenerational Friendship: Benefits and Meaning | TuHiTu Cares",
  },
  "conversation-starters-with-elders": {
    title: "Conversation Starters for Seniors: Meaningful Questions to Ask",
    seoTitle: "Conversation Starters for Seniors | TuHiTu Cares",
  },
  "helping-seniors-with-technology": {
    title: "Helping Seniors With Technology: A Practical Guide",
    seoTitle: "Helping Seniors With Technology | TuHiTu Cares",
  },
  "festival-volunteering-with-senior-citizens": {
    title: "Festival Volunteering With Senior Citizens: Ideas and Best Practices",
    seoTitle: "Festival Volunteering With Senior Citizens | TuHiTu Cares",
  },
  "care-home-volunteer-companionship-programme": {
    title: "Care Home Volunteer Programmes: Building Meaningful Companionship",
    seoTitle: "Care Home Volunteer Programmes for Senior Citizens | TuHiTu Cares",
  },
  "college-volunteering-senior-citizens": {
    title: "College Volunteering With Senior Citizens: A Practical Guide",
    seoTitle: "College Volunteering With Senior Citizens | TuHiTu Cares",
  },
  "corporate-volunteering-senior-citizens-india": {
    title: "Corporate Volunteering With Senior Citizens in India",
    seoTitle: "Corporate Volunteering With Senior Citizens in India | TuHiTu Cares",
  },
};

function parseField(block, label) {
  const match = block.match(new RegExp(`^${label}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : "";
}

function parseInternalLinks(value) {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSlug(input) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeParagraphs(articleText) {
  return articleText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.every((line) => line.startsWith("•"))) {
        return {
          type: "list",
          items: lines.map((line) => line.replace(/^•\s*/, "").replace(/;$/, "")),
        };
      }

      if (
        lines.length === 1 &&
        lines[0].split(/\s+/).length <= 10 &&
        !lines[0].startsWith("CTA") &&
        !lines[0].startsWith("Editorial") &&
        !/[.:]$/.test(lines[0])
      ) {
        return { type: "heading", text: lines[0] };
      }

      if (lines.length === 1 && /^\d+\.\s+/.test(lines[0])) {
        return { type: "heading", text: lines[0] };
      }

      return {
        type: "paragraph",
        text: lines.join(" "),
      };
    });
}

const posts = blocks.map((block, index) => {
  const lines = block.split("\n").map((line) => line.trim());
  const rawTitle = lines[0];
  const category = parseField(block, "Category");
  const categorySlug = toSlug(category);
  categoryMap.set(categorySlug, category);

  const targetUrl = parseField(block, "Target URL");
  const slugFromTarget = targetUrl
    .split("/")
    .filter(Boolean)
    .at(-1);
  const slug = slugFromTarget || `blog-${index + 1}`;

  const articleMarker = "\n\nCTA\n";
  const articleStart = block.indexOf("ARTICLE\n\n");
  const ctaStart = block.indexOf(articleMarker);

  if (articleStart === -1 || ctaStart === -1) {
    throw new Error(`Could not parse article and CTA for ${title}`);
  }

  const articleBody = block.slice(articleStart + "ARTICLE\n\n".length, ctaStart).trim();

  const afterCta = block.slice(ctaStart + articleMarker.length);
  const editorialMarkers = [
    "\n\nEditorial source guidance\n",
    "\n\nEditorial notes\n",
    "\n\nEditorial note\n",
    "\n\nMASTER EDITORIAL SOURCE NOTES",
    "MASTER EDITORIAL SOURCE NOTES",
  ];
  const editorialMarker =
    editorialMarkers.find((marker) => afterCta.includes(marker)) ?? null;

  const editorialIndex = editorialMarker
    ? afterCta.indexOf(editorialMarker)
    : afterCta.length;
  const ctaBody = afterCta.slice(0, editorialIndex).trim();
  const editorialGuidance = editorialMarker
    ? afterCta.slice(editorialIndex + editorialMarker.length).trim()
    : "";

  const rewrite = titleRewriteMap[slug] ?? null;

  return {
    id: `blog-${String(index + 1).padStart(2, "0")}`,
    title: rewrite?.title ?? rawTitle,
    slug,
    category,
    categorySlug,
    targetUrl,
    primaryKeyword: parseField(block, "Primary keyword"),
    secondaryKeywords: parseField(block, "Secondary keywords")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean),
    searchIntent: parseField(block, "Search intent"),
    seoTitle: rewrite?.seoTitle ?? parseField(block, "SEO title"),
    metaDescription: parseField(block, "Meta description"),
    excerpt: parseField(block, "Suggested excerpt"),
    primaryCta: parseField(block, "Primary CTA"),
    secondaryCta: parseField(block, "Secondary CTA"),
    internalLinks: parseInternalLinks(parseField(block, "Internal links")),
    articleBody: articleBody.trim(),
    ctaBody: ctaBody.trim(),
    editorialGuidance: editorialGuidance.trim(),
    sections: normalizeParagraphs(articleBody.trim()),
  };
});

const categories = Array.from(categoryMap.entries()).map(([slug, label]) => ({
  slug,
  label,
}));

const fileContents = `export type BlogSection =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  targetUrl: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  primaryCta: string;
  secondaryCta: string;
  internalLinks: string[];
  articleBody: string;
  ctaBody: string;
  editorialGuidance: string;
  sections: BlogSection[];
}

export const blogCategories = ${JSON.stringify(categories, null, 2)} as const;

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, fileContents);

console.log(
  JSON.stringify(
    {
      postCount: posts.length,
      categories,
      slugs: posts.map((post) => post.slug),
    },
    null,
    2,
  ),
);
