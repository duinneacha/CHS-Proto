/**
 * Migrate ASP.NET .aspx content pages into Eleventy Markdown.
 * Source: André backup under website_backup_04072026
 * - Preserves body prose text
 * - Rewrites hrefs to clean paths
 * - Writes url-map.json (old path → new permalink)
 */
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

const BACKUP = path.resolve(
  __dirname,
  "..",
  "..",
  "website_backup_04072026",
  "OneDrive_1_04-07-2026"
);
const FALLBACK = path.join(BACKUP, "obj", "Release", "Package", "PackageTmp");
const OUT_CONTENT = path.resolve(__dirname, "..", "src", "content");
const OUT_DATA = path.resolve(__dirname, "..", "src", "data");

const SKIP = new Set([
  "blanktest.aspx",
  "menu.aspx",
  "c2h2040voting.aspx",
  "testaspx.aspx",
  "contactus.aspx", // custom Formspree page
  "thankyou.aspx",
]);

const LIVE_CIT_BASE = "https://carrigtwohillhistoricalsociety.com";

function slugPart(s) {
  const split = String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return slugify(split, { lower: true, strict: true, trim: true });
}

function cleanPermalinkFromRel(relPosix) {
  // e.g. Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx
  const noAspx = relPosix.replace(/\.aspx$/i, "");
  const parts = noAspx.split("/").filter(Boolean).map(slugPart);
  return "/" + parts.join("/") + "/";
}

function oldPathVariants(relPosix) {
  const withSlash = "/" + relPosix.replace(/\\/g, "/");
  const encoded = withSlash
    .split("/")
    .map((p) => (p.includes(" ") || p.includes("'") ? encodeURIComponent(p) : p))
    .join("/");
  const variants = new Set([
    withSlash,
    withSlash.replace(/^\//, "\\"),
    encoded,
    withSlash.replace(/ /g, "%20"),
  ]);
  if (/default\.aspx$/i.test(relPosix)) {
    variants.add("/");
    variants.add("/Default.aspx");
    variants.add("/default.aspx");
  }
  return [...variants];
}

function findAspxFiles() {
  const found = new Map(); // relPosix -> absPath (prefer primary over fallback)

  function walk(dir, base) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (["bin", "obj", "packages", ".vs", "App_Data"].includes(ent.name)) continue;
        if (ent.name.startsWith("__")) continue;
        walk(abs, base);
      } else if (/\.aspx$/i.test(ent.name) && !/\.aspx\./i.test(ent.name)) {
        const rel = path.relative(base, abs).split(path.sep).join("/");
        const key = rel.toLowerCase();
        if (SKIP.has(path.basename(rel).toLowerCase())) continue;
        if (rel.toLowerCase().startsWith("test pages/")) continue;
        if (!found.has(key)) found.set(key, { rel, abs });
      }
    }
  }

  walk(BACKUP, BACKUP);
  // Fallback-only pages (Default etc.)
  walk(FALLBACK, FALLBACK);
  return [...found.values()];
}

function extractTitle(html, rel) {
  const m =
    html.match(/Page Title="([^"]+)"/i) ||
    html.match(/<title[^>]*>\s*([^<]+?)\s*<\/title>/i) ||
    html.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  if (m) {
    return m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  return path.basename(rel, ".aspx");
}

function extractDescription(html) {
  const m = html.match(
    /name=["']description["']\s+content=["']([^"']+)["']/i
  );
  return m ? m[1].trim() : "";
}

function extractMainContent(html) {
  // Collect content placeholders; some masters put body in PlaceHolder2 and leave
  // PlaceHolder1 empty (RIC Barracks pages).
  const blocks = [];
  for (const id of ["ContentPlaceHolder1", "ContentPlaceHolder2", "ContentPlaceHolder3"]) {
    const re = new RegExp(
      `ContentPlaceHolderID=["']${id}["'][^>]*>([\\s\\S]*?)<\\/asp:Content>`,
      "i"
    );
    const m = html.match(re);
    if (m && m[1].trim().length > 20) blocks.push(m[1]);
  }
  if (blocks.length) {
    // Prefer the longest substantive block
    return blocks.sort((a, b) => b.length - a.length)[0];
  }
  // Standalone pages
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return body ? body[1] : html;
}

function attr(attrs, name) {
  const dq = attrs.match(new RegExp(`${name}="([^"]*)"`, "i"));
  if (dq) return dq[1];
  const sq = attrs.match(new RegExp(`${name}='([^']*)'`, "i"));
  return sq ? sq[1] : "";
}

function stripServerNoise(html, pageDir) {
  let s = html;
  // asp:Image → img (allow apostrophes inside double-quoted ImageUrl)
  s = s.replace(/<asp:Image\b([^>]*)\/?>/gi, (_, attrs) => {
    const src = attr(attrs, "ImageUrl");
    const alt = attr(attrs, "AlternateText");
    const width = attr(attrs, "Width");
    const id = attr(attrs, "ID");
    const cleanSrc = rewriteAssetSrc(src, pageDir);
    // Do not emit Width — ASP.NET used percent (e.g. 95%); stripping % made 95px thumbnails.
    // Sizing is handled in CSS (.prose img / figure).
    return `<img src="${cleanSrc}" alt="${alt || id}">`;
  });
  // asp:HyperLink
  s = s.replace(
    /<asp:HyperLink\b([^>]*)>([\s\S]*?)<\/asp:HyperLink>/gi,
    (_, attrs, text) => {
      const href = attr(attrs, "NavigateUrl") || "#";
      return `<a href="${rewriteHref(href, pageDir)}">${text}</a>`;
    }
  );
  // Remove other asp controls but keep inner text where possible
  s = s.replace(/<asp:[^>]+ \/>/gi, "");
  s = s.replace(/<\/?asp:[^>]*>/gi, "");
  // Remove script/style blocks from content
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Strip petition/input forms (not migrating write-backs)
  s = s.replace(/<asp:Button\b[^>]*>/gi, "");
  s = s.replace(/<form\b[\s\S]*?<\/form>/gi, "");
  // Rewrite anchors
  s = s.replace(/href="([^"]*)"/gi, (all, href) => {
    if (/^https?:/i.test(href) || href.startsWith("mailto:") || href.startsWith("#")) {
      return all;
    }
    return `href="${rewriteHref(href, pageDir)}"`;
  });
  // Rewrite remaining img src (skip already-absolute /assets/)
  // Trim first: old ASPX had leading spaces before https://paypalobjects.com/...
  s = s.replace(/src="([^"]*)"/gi, (all, src) => {
    const trimmed = src.trim();
    if (
      /^https?:/i.test(trimmed) ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("/assets/")
    ) {
      return `src="${trimmed}"`;
    }
    return `src="${rewriteAssetSrc(trimmed, pageDir)}"`;
  });
  return s.trim();
}

/** Global map built during migration for href rewriting */
let permalinkByOld = new Map();

function normalizeOldKey(href) {
  let h = href.replace(/\\/g, "/").replace(/^\~\//, "/");
  h = decodeURIComponent(h);
  if (!h.startsWith("/")) {
    // leave relative for later resolution — store as-is lower
  }
  return h.replace(/\/+/g, "/");
}

function resolveAgainstPage(ref, pageDir) {
  let h = ref.replace(/\\/g, "/").replace(/^\.\//, "");
  if (h.startsWith("/")) return h.replace(/^\//, "");
  if (h.startsWith("~/")) return h.slice(2);
  // Resolve ../ against page directory
  const baseParts = (pageDir || "").split("/").filter(Boolean);
  const parts = h.split("/");
  for (const p of parts) {
    if (p === "..") baseParts.pop();
    else if (p && p !== ".") baseParts.push(p);
  }
  return baseParts.join("/");
}

function rewriteHref(href, pageDir) {
  if (!href || href === "#") return href;
  if (/^https?:/i.test(href) || href.startsWith("mailto:")) return href;

  let h = href.replace(/\\/g, "/");
  if (h.startsWith("/")) {
    const key = decodeURIComponent(h).toLowerCase();
    if (permalinkByOld.has(key)) return permalinkByOld.get(key);
    if (permalinkByOld.has(key.replace(/^\//, ""))) {
      return permalinkByOld.get(key.replace(/^\//, ""));
    }
  }

  if (/\.aspx$/i.test(h) || h.includes("%20") || h.includes(" ")) {
    const resolved = resolveAgainstPage(decodeURIComponent(h), pageDir);
    const key = ("/" + resolved).toLowerCase();
    if (permalinkByOld.has(key)) return permalinkByOld.get(key);
    return cleanPermalinkFromRel(resolved);
  }

  if (/\.(pdf|jpe?g|png|gif|bmp|svg|mp4|m4v)$/i.test(h)) {
    return rewriteAssetSrc(h, pageDir);
  }
  return href;
}

function rewriteAssetSrc(src, pageDir) {
  if (!src) return src;
  src = String(src).trim();
  if (src.startsWith("/assets/")) return src;
  if (/^https?:/i.test(src)) return src;

  let s = src.replace(/^~\//, "").replace(/\\/g, "/");
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }

  if (s.startsWith("/")) {
    s = s.slice(1);
  } else if (s.startsWith("../") || s.startsWith("./") || !s.includes("/")) {
    // Bare filename or explicit relative path → resolve against page folder
    s = resolveAgainstPage(s, pageDir);
  }
  // else: already a root-relative content path (e.g. "Religious of Parish/...")

  // Avoid /assets/assets/...
  if (s.toLowerCase().startsWith("assets/")) s = s.slice("assets/".length);

  const enc = (seg) => encodeURIComponent(seg).replace(/'/g, "%27");
  if (/^CITInteractive\/Videos\//i.test(s)) {
    return `${LIVE_CIT_BASE}/${s.split("/").map(enc).join("/")}`;
  }
  return `/assets/${s.split("/").map(enc).join("/")}`;
}

function yamlEscape(str) {
  if (!str) return '""';
  if (/[:#{}[\],&*?|>!%@`]/.test(str) || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function main() {
  if (!fs.existsSync(BACKUP)) {
    console.error("Backup not found:", BACKUP);
    process.exit(1);
  }

  const files = findAspxFiles();
  console.log(`Found ${files.length} aspx pages`);

  // Pass 1: compute permalinks
  const pages = [];
  for (const { rel, abs } of files) {
    const permalink =
      /default\.aspx$/i.test(rel) ? "/" : cleanPermalinkFromRel(rel);
    pages.push({ rel, abs, permalink });
    for (const v of oldPathVariants(rel)) {
      permalinkByOld.set(v.toLowerCase(), permalink);
      permalinkByOld.set(decodeURIComponent(v).toLowerCase(), permalink);
    }
    // also key without leading slash
    permalinkByOld.set(rel.toLowerCase(), permalink);
    permalinkByOld.set(("/" + rel).toLowerCase(), permalink);
  }

  ensureDir(OUT_CONTENT);
  ensureDir(OUT_DATA);

  const urlMap = [];
  let written = 0;

  for (const page of pages) {
    // Homepage handled as src/index.md manually — skip writing default into content/
    if (page.permalink === "/") {
      urlMap.push({
        old: "/" + page.rel,
        oldEncoded: "/" + page.rel.replace(/ /g, "%20"),
        new: "/",
        title: "Home",
      });
      continue;
    }

    const raw = fs.readFileSync(page.abs, "utf8");
    const title = extractTitle(raw, page.rel);
    const description = extractDescription(raw);
    let body = extractMainContent(raw);
    const pageDir = path.posix.dirname(page.rel.replace(/\\/g, "/"));
    body = stripServerNoise(body, pageDir === "." ? "" : pageDir);

    // CIT video pages: add live-site note for video content
    if (/^CITInteractive\//i.test(page.rel) && /CIT(?!InteractiveMap|Map|Village)/i.test(path.basename(page.rel))) {
      const live = `${LIVE_CIT_BASE}/${page.rel.split("/").map(encodeURIComponent).join("/")}`;
      if (!/carrigtwohillhistoricalsociety\.com/i.test(body)) {
        body += `\n<p class="media-note"><a href="${live}" target="_blank" rel="noopener">Watch this exhibit video on the current society website</a> (temporary link while videos move to YouTube).</p>\n`;
      }
    }

    // Search skeletons
    if (/Interred\.aspx$/i.test(page.rel) || /ArmyPensions\.aspx$/i.test(page.rel)) {
      body += `\n<section class="search-skeleton" aria-label="Search coming soon">\n<p><strong>Searchable records:</strong> this page will include a search of the society’s research collection. Data will be added when the hosting database export is available.</p>\n</section>\n`;
    }

    const mdPath = path.join(
      OUT_CONTENT,
      ...page.rel.replace(/\.aspx$/i, "").split("/").map(slugPart)
    );
    const outFile = mdPath + ".md";
    ensureDir(path.dirname(outFile));

    const fm = [
      "---",
      `title: ${yamlEscape(title)}`,
      description ? `description: ${yamlEscape(description)}` : null,
      `permalink: ${page.permalink}`,
      `layout: layouts/page.njk`,
      `oldPath: ${yamlEscape("/" + page.rel)}`,
      "---",
      "",
      body,
      "",
    ]
      .filter((l) => l !== null)
      .join("\n");

    fs.writeFileSync(outFile, fm, "utf8");
    written++;

    urlMap.push({
      old: "/" + page.rel,
      oldEncoded:
        "/" +
        page.rel
          .split("/")
          .map((p) => encodeURIComponent(p))
          .join("/"),
      new: page.permalink,
      title,
    });
  }

  urlMap.sort((a, b) => a.old.localeCompare(b.old));
  fs.writeFileSync(
    path.join(OUT_DATA, "url-map.json"),
    JSON.stringify({ generated: new Date().toISOString(), paths: urlMap }, null, 2),
    "utf8"
  );

  // Also copy into _data for templates if needed
  ensureDir(path.resolve(__dirname, "..", "src", "_data"));
  fs.writeFileSync(
    path.resolve(__dirname, "..", "src", "_data", "urlMap.json"),
    JSON.stringify(urlMap, null, 2),
    "utf8"
  );

  console.log(`Wrote ${written} markdown pages`);
  console.log(`URL map entries: ${urlMap.length}`);
  console.log(`Output: ${OUT_CONTENT}`);
}

main();
