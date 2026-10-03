import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const check = process.argv.includes("--check");
const html = readFileSync(new URL(check ? "../dist/index.html" : "../index.html", import.meta.url), "utf8");
const schema = html.match(/<script\b[^>]*\bid="portfolio-schema"[^>]*>([\s\S]*?)<\/script>/)?.[1];
if (!schema) throw new Error("Missing portfolio structured data");
JSON.parse(schema);
const hash = `'sha256-${createHash("sha256").update(schema).digest("base64")}'`;
const configPath = new URL("../vercel.json", import.meta.url);
const config = JSON.parse(readFileSync(configPath, "utf8"));
const header = config.headers[0].headers.find(({ key }) => key === "Content-Security-Policy");
if (check) {
  if (!header.value.includes(hash)) throw new Error("Structured data changed: run npm run security:sync before deployment");
} else {
  header.value = header.value.replace(/script-src ([^;]+)/, (_, sources) => `script-src ${sources.replace(/\s*'sha256-[^']+'/g, "")} ${hash}`);
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}
