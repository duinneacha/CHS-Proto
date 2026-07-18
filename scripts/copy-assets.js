/**
 * Copy images/PDFs (not huge videos) from backup + recovered St David assets.
 */
const fs = require("fs");
const path = require("path");

const BACKUP = path.resolve(
  __dirname,
  "..",
  "..",
  "website_backup_04072026",
  "OneDrive_1_04-07-2026"
);
const RECOVERED = path.resolve(__dirname, "..", "recovered assets");
const OUT = path.resolve(__dirname, "..", "src", "assets");

const MEDIA_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".pdf",
  ".m4v",
]);

// Skip multi-hundred-MB CIT videos (linked live / YouTube later)
const SKIP_DIRS = new Set(["bin", "obj", "packages", ".vs", "App_Data", "node_modules"]);

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function walkCopy(dir, base) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name) || ent.name.startsWith("__")) continue;
      // Skip CIT videos folder bulk
      const rel = path.relative(base, abs).split(path.sep).join("/");
      if (/^CITInteractive\/Videos$/i.test(rel)) continue;
      n += walkCopy(abs, base);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (!MEDIA_EXT.has(ext)) continue;
      if (ext === ".mp4") continue; // all mp4 skipped for GH Pages size
      const rel = path.relative(base, abs);
      const dest = path.join(OUT, rel);
      copyFile(abs, dest);
      n++;
    }
  }
  return n;
}

function main() {
  ensureDir(OUT);
  const n = walkCopy(BACKUP, BACKUP);
  console.log(`Copied ${n} media files from backup`);

  // St David's recovered images into the expected folder
  const stDest = path.join(
    OUT,
    "Religious of Parish",
    "Parish Churches",
    "St David's"
  );
  ensureDir(stDest);
  if (fs.existsSync(RECOVERED)) {
    for (const f of fs.readdirSync(RECOVERED)) {
      if (!MEDIA_EXT.has(path.extname(f).toLowerCase())) continue;
      copyFile(path.join(RECOVERED, f), path.join(stDest, f));
      console.log("Recovered:", f);
    }
  }

  // jimmap images if present
  const jimImg = path.resolve(__dirname, "..", "..", "jimmap", "assets", "images");
  if (fs.existsSync(jimImg)) {
    const dest = path.join(OUT, "map", "places");
    ensureDir(dest);
    for (const f of fs.readdirSync(jimImg)) {
      copyFile(path.join(jimImg, f), path.join(dest, f));
    }
    console.log("Copied jimmap place images");
  }
}

main();
