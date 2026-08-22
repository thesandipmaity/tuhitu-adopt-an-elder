import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const database = globalThis.__TUHITU_RUNTIME_ENV__?.DB;
  if (!database) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(database, { schema });
}

export function getRuntimeEnv() {
  const runtime = globalThis.__TUHITU_RUNTIME_ENV__;
  if (!runtime) throw new Error("Runtime environment is unavailable.");
  return runtime;
}
