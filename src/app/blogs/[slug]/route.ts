import { createHtmlResponse, renderBlogDetailPage } from "../blog-pages";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const html = renderBlogDetailPage(request.url, slug);

  if (!html) {
    return createHtmlResponse(
      "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Blog Not Found | TuHiTu Satya</title><meta name=\"description\" content=\"The requested TuHiTu Satya blog could not be found.\"><meta name=\"codex-preview\" content=\"development\"><link rel=\"stylesheet\" href=\"/css/style.css\"></head><body><main class=\"section-pad\"><div class=\"container\"><h1>Blog not found</h1><p>The article you requested is not available.</p><a class=\"btn btn-primary\" href=\"/blogs\">Back to blogs</a></div></main></body></html>",
      404,
    );
  }

  return createHtmlResponse(html);
}
