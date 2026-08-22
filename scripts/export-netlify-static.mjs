import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.join(projectRoot, "dist");
const clientRoot = path.join(distRoot, "client");
const workerPath = path.join(distRoot, "server", "index.js");

const routes = [
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

const copyClientToDistRoot = async () => {
  await cp(clientRoot, distRoot, {
    recursive: true,
    force: true,
    filter(source) {
      const relative = path.relative(clientRoot, source);
      if (!relative) return true;
      if (relative === ".vite") return false;
      if (relative.startsWith(`.vite${path.sep}`)) return false;
      return true;
    },
  });
};

const loadWorker = async () => {
  const workerUrl = pathToFileURL(workerPath);
  workerUrl.searchParams.set("static-export", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  if (!worker || typeof worker.fetch !== "function") {
    throw new Error("dist/server/index.js does not export default.fetch");
  }
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

  if (!response.ok) {
    throw new Error(`Failed to render ${pathname}: ${response.status}`);
  }

  return response.text();
};

const routeToFile = (pathname) => {
  if (pathname === "/") return path.join(distRoot, "index.html");
  const segments = pathname.replace(/^\//, "").split("/");
  return path.join(distRoot, ...segments, "index.html");
};

const writeRouteHtml = async (pathname, html) => {
  const outputFile = routeToFile(pathname);
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, html, "utf8");
};

const writeRedirects = async () => {
  const rules = [
    "/index.html / 301",
    "/about/index.html /about 301",
    "/about/our-model/index.html /about/our-model 301",
    "/about/impact/index.html /about/impact 301",
    "/about/stories/index.html /about/stories 301",
    "/about/governance/index.html /about/governance 301",
    "/volunteer/index.html /volunteer 301",
    "/sponsor/index.html /sponsor 301",
    "/donate/index.html /donate 301",
    "/donation-details/index.html /donation-details 301",
    "/partner-with-us/index.html /partner-with-us 301",
    "/care-homes/index.html /care-homes 301",
  ].join("\n");

  await writeFile(path.join(distRoot, "_redirects"), `${rules}\n`, "utf8");
};

await rm(path.join(distRoot, "about"), { recursive: true, force: true });
await rm(path.join(distRoot, "volunteer"), { recursive: true, force: true });
await rm(path.join(distRoot, "sponsor"), { recursive: true, force: true });
await rm(path.join(distRoot, "donate"), { recursive: true, force: true });
await rm(path.join(distRoot, "donation-details"), { recursive: true, force: true });
await rm(path.join(distRoot, "partner-with-us"), { recursive: true, force: true });
await rm(path.join(distRoot, "care-homes"), { recursive: true, force: true });
await rm(path.join(distRoot, "index.html"), { force: true });
await rm(path.join(distRoot, "_redirects"), { force: true });

await copyClientToDistRoot();

const worker = await loadWorker();
for (const route of routes) {
  const html = await renderPath(worker, route);
  await writeRouteHtml(route, html);
}

await writeRedirects();

console.log("Exported Netlify-ready static pages into dist/.");
