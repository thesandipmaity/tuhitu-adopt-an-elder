import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const workerPath = path.join(projectRoot, "dist", "server", "index.js");
const hostingPath = path.join(projectRoot, "dist", ".openai", "hosting.json");

try {
  await access(workerPath);
} catch {
  console.error("Missing Sites Worker entry: dist/server/index.js");
  process.exit(66);
}

try {
  await access(hostingPath);
} catch {
  console.error("Missing packaged Sites manifest: dist/.openai/hosting.json");
  process.exit(66);
}

JSON.parse(await readFile(hostingPath, "utf8"));

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);

if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error(
    "dist/server/index.js must have an ESM default export with fetch(request, env, ctx)",
  );
}

console.log(
  "Validated Sites artifact: ESM Worker default.fetch and hosting manifest are present.",
);
