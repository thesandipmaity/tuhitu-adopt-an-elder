import { createHtmlResponse, renderBlogsIndexPage } from "./blog-pages";

export async function GET(request: Request) {
  return createHtmlResponse(renderBlogsIndexPage(request.url));
}
