// Stamps each app file's content hash into the links that load it, so every
// release reaches browsers as one matching set of files (and the offline
// worker knows a new version exists).
//   node tools/stamp.mjs           update the stamps after changing app files
//   node tools/stamp.mjs --check   exit with an error if the stamps are out of date
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const hash = (f) => createHash("sha256").update(readFileSync(join(root, f))).digest("hex").slice(0, 10);
const check = process.argv.includes("--check");
const changed = [];
function put(file, text) { if (read(file) !== text) { changed.push(file); if (!check) writeFileSync(join(root, file), text); } }
const stampIn = (text, file, v) => text.replace(new RegExp('(["(])' + file.replace(/[./]/g, "\\$&") + '(\\?v=\\w+)?(["\\)])', "g"), "$1" + file + "?v=" + v + "$3");

// 1. The sign-in library is loaded by platform.js only when accounts are on.
put("platform.js", stampIn(read("platform.js"), "vendor/supabase.js", hash("vendor/supabase.js")));
// 2. The page loads the app's files with their stamps.
const files = ["styles.css", "fonts/fonts.css", "platform.js", "app.js"];
const stamps = Object.fromEntries(["vendor/supabase.js", ...files].map((f) => [f, hash(f)]));
if (check) stamps["platform.js"] = hash("platform.js");
let index = read("index.html");
files.forEach((f) => { index = stampIn(index, f, stamps[f]); });
put("index.html", index);
// 3. The offline worker keeps exactly these versions, and changes when any of them does.
let sw = read("sw.js");
[...files, "vendor/supabase.js"].forEach((f) => { sw = stampIn(sw, f, stamps[f]); });
const release = createHash("sha256").update(JSON.stringify(stamps) + read("index.html") + read("config.js").length).digest("hex").slice(0, 10);
sw = sw.replace(/const VERSION = "[^"]*";/, `const VERSION = "${release}";`);
put("sw.js", sw);

if (check) {
  if (changed.length) { console.error("Out of date: " + changed.join(", ") + ". Run: node tools/stamp.mjs"); process.exit(1); }
  console.log("Stamps are up to date.");
} else console.log(changed.length ? "Stamped " + changed.join(", ") : "Nothing to stamp.");
