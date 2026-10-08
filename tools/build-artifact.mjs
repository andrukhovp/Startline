// Builds the single-file version of Startline that runs inside claude.ai
// (as a claude.ai artifact) from the same files the web app uses.
//   node tools/build-artifact.mjs [output.html]
// The web-only pieces (platform.js, config.js, supabase.js, the manifest and
// the service worker) are left out; inside claude.ai the host page provides
// storage and sign-in instead.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const index = read("index.html");
const fonts = [...index.matchAll(/^<link rel="(?:preconnect|stylesheet)" href="https:\/\/fonts\.[^\n]*$/gm)].map((m) => m[0]);
const start = index.indexOf("</noscript>\n") + "</noscript>\n".length;
const end = index.indexOf('\n\n<script src="vendor/supabase.js">');
if (start < 20 || end < start) throw new Error("index.html layout changed; update tools/build-artifact.mjs");
const markup = index.slice(start, end);
const out = ["<title>Startline</title>", ...fonts, "<style>", read("styles.css").trimEnd(), "</style>", "", markup, "", "<script>", read("app.js").trimEnd(), "</script>", ""].join("\n");
const file = process.argv[2] || join(root, "startline-claude.html");
writeFileSync(file, out);
console.log("Wrote " + file + " (" + out.length + " bytes)");
