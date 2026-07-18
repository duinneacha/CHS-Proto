/**
 * Remigrate a single .aspx path into its existing Markdown file (by oldPath).
 * Usage: node scripts/remigrate-one.js "Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx"
 */
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

// Load migrate helpers by evaluating the module after exporting — instead, duplicate minimal call via require patch.
const migratePath = path.join(__dirname, "migrate-aspx.js");
const src = fs.readFileSync(migratePath, "utf8");

// If migrate isn't exported, run inline extraction using the same file's functions via vm.
// Simpler: spawn the full migrate is too heavy. Inline the needed bits by requiring after adding exports.

const BACKUP = path.resolve(
  __dirname,
  "..",
  "..",
  "website_backup_04072026",
  "OneDrive_1_04-07-2026"
);
const OUT_CONTENT = path.resolve(__dirname, "..", "src", "content");

// Require migrate by temporarily appending exports — use child_process to run node -e importing functions.
// Easiest path: exec the migrate functions from a copied require.

function loadMigrateFns() {
  const code = fs.readFileSync(migratePath, "utf8");
  // Strip the main() invocation at the end if present
  const withoutMain = code
    .replace(/\nif\s*\(require\.main\s*===\s*module\)\s*\{[\s\S]*\}\s*$/, "")
    .replace(/\nmain\(\);\s*$/, "");
  const mod = { exports: {} };
  const wrapper = `${withoutMain}\nmodule.exports = { extractMainContent, stripServerNoise, extractTitle, extractDescription, cleanPermalinkFromRel, rewriteAssetSrc };`;
  // eslint-disable-next-line no-new-func
  const fn = new Function("module", "exports", "require", "__dirname", "__filename", wrapper);
  fn(mod, mod.exports, require, __dirname, migratePath);
  return mod.exports;
}

function findMdByOldPath(oldPath) {
  const target = oldPath.replace(/\\/g, "/").toLowerCase();
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        const hit = walk(p);
        if (hit) return hit;
      } else if (e.name.endsWith(".md")) {
        const t = fs.readFileSync(p, "utf8");
        const m = t.match(/^oldPath:\s*"([^"]+)"/m);
        if (m && m[1].replace(/\\/g, "/").toLowerCase() === target) return p;
      }
    }
    return null;
  }
  return walk(OUT_CONTENT);
}

function main() {
  const rel = process.argv[2];
  if (!rel) {
    console.error("Usage: node scripts/remigrate-one.js <rel.aspx>");
    process.exit(1);
  }
  const abs = path.join(BACKUP, rel);
  if (!fs.existsSync(abs)) {
    console.error("Not found:", abs);
    process.exit(1);
  }
  const { extractMainContent, stripServerNoise, extractTitle, extractDescription } =
    loadMigrateFns();
  const html = fs.readFileSync(abs, "utf8");
  const pageDir = path.posix.dirname(rel.replace(/\\/g, "/"));
  const body = stripServerNoise(extractMainContent(html), pageDir);
  const oldPath = "/" + rel.replace(/\\/g, "/");
  const mdPath = findMdByOldPath(oldPath);
  if (!mdPath) {
    console.error("No markdown with oldPath", oldPath);
    process.exit(1);
  }
  const existing = fs.readFileSync(mdPath, "utf8");
  const fm = existing.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    console.error("No front matter in", mdPath);
    process.exit(1);
  }
  const title = extractTitle(html, rel);
  const desc = extractDescription(html);
  let front = fm[1];
  if (title) front = front.replace(/^title:.*$/m, `title: ${JSON.stringify(title)}`);
  if (desc) {
    if (/^description:/m.test(front)) {
      front = front.replace(/^description:.*$/m, `description: ${JSON.stringify(desc)}`);
    } else {
      front += `\ndescription: ${JSON.stringify(desc)}`;
    }
  }
  const out = `---\n${front}\n---\n\n${body}\n`;
  fs.writeFileSync(mdPath, out);
  console.log("Updated", mdPath, "bytes", body.length);
}

main();
