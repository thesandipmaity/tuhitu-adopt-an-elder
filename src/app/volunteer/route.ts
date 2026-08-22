import pageHtml from "./template.html?raw";

export async function GET() {
  return new Response(pageHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
}
