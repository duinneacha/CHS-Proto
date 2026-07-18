/**
 * Build map places.json from:
 *  1) carrigmapv2 Markdown stories (richest gazetteer content)
 *  2) jimmap places.json (fill gaps: sections, images, dates)
 *  3) MTU exhibit pins (live video links)
 *
 * Long-term source of truth for new places: src/places/*.md
 * (copied/updated from carrigmapv2 on this run).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CM_STORIES = path.resolve(ROOT, "..", "carrigmapv2", "src", "stories");
const JIM = path.resolve(ROOT, "..", "jimmap", "data", "places.json");
const OUT_JSON = path.join(ROOT, "src", "data", "places.json");
const OUT_PLACES_DIR = path.join(ROOT, "src", "places");
const CM_GEO = path.resolve(ROOT, "..", "carrigmapv2", "src", "geojson");
const OUT_GEO = path.join(ROOT, "src", "data");

const MTU_EXHIBITS = [
  {
    id: "mtu-abbey-st-davids",
    name: "Abbey / St David’s (MTU exhibit)",
    lat: 51.9085,
    lng: -8.2635,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — Abbey and St David’s film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITAbbeyRuins.aspx",
  },
  {
    id: "mtu-convent",
    name: "Poor Servants Convent (MTU exhibit)",
    lat: 51.9089,
    lng: -8.2648,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — Convent film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITConvent.aspx",
  },
  {
    id: "mtu-st-marys",
    name: "St Mary’s Church (MTU exhibit)",
    lat: 51.9092,
    lng: -8.2655,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — St Mary’s film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITStMarys.aspx",
  },
  {
    id: "mtu-ric-barracks",
    name: "RIC Barracks (MTU exhibit)",
    lat: 51.9082,
    lng: -8.2662,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — RIC Barracks film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITBarracks.aspx",
  },
  {
    id: "mtu-schools",
    name: "Schools of Carrigtwohill (MTU exhibit)",
    lat: 51.9096,
    lng: -8.264,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — Schools film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITSchools.aspx",
  },
  {
    id: "mtu-barryscourt",
    name: "Barryscourt Castle (MTU exhibit film)",
    lat: 51.9075,
    lng: -8.2615,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — Barryscourt Castle film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITBarryscourt.aspx",
  },
  {
    id: "mtu-rossmore",
    name: "Battle of Rossmore (MTU exhibit)",
    lat: 51.915,
    lng: -8.255,
    category: "Exhibit",
    layer: "mtu",
    preview: "MTU/CIT interactive village map — Rossmore / Tithe War film.",
    liveVideoPage:
      "https://carrigtwohillhistoricalsociety.com/CITInteractive/CITRossmore.aspx",
  },
];

const CREDIT =
  "Produced by Carrigtwohill Historical Society in partnership with CIT/MTU, with support from Cork County Council and the Poor Servants of the Mother of God";

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  const lines = m[1].split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const keyMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) {
      i++;
      continue;
    }
    const key = keyMatch[1];
    let val = keyMatch[2];
    if (val === "" || val === "|" || val === ">") {
      const items = [];
      i++;
      while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""));
        i++;
      }
      data[key] = items;
      continue;
    }
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[key] = val;
    i++;
  }
  return { data, body: (m[2] || "").trim() };
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function yamlQuote(s) {
  return JSON.stringify(String(s ?? ""));
}

function writePlaceMd(place) {
  ensureDir(OUT_PLACES_DIR);
  const cats = place.categories || (place.category ? [place.category] : []);
  const eras = place.eras || [];
  const sources = place.sources || [];
  const hero = (place.images && place.images[0]) || null;
  const lines = [
    "---",
    `id: ${place.id}`,
    `title: ${yamlQuote(place.name)}`,
    `name: ${yamlQuote(place.name)}`,
    `lat: ${place.location.lat}`,
    `lng: ${place.location.lng}`,
    `layer: ${place.layer || "places"}`,
    `category: ${yamlQuote(place.category || "")}`,
    "categories:",
    ...cats.map((c) => `  - ${yamlQuote(c)}`),
    "eras:",
    ...eras.map((e) => `  - ${yamlQuote(e)}`),
    `preview: ${yamlQuote(place.preview || "")}`,
    `author: ${yamlQuote(place.author || "")}`,
    `status: ${place.status || "published"}`,
    hero && hero.src ? `heroImage: ${yamlQuote(hero.src)}` : `heroImage: ""`,
    "sources:",
    ...sources.map((s) => `  - ${yamlQuote(typeof s === "string" ? s : s.title || "")}`),
    place.liveVideoPage ? `liveVideoPage: ${yamlQuote(place.liveVideoPage)}` : null,
    place.credit ? `credit: ${yamlQuote(place.credit)}` : null,
    "---",
    "",
    place.body || "",
    "",
  ].filter((l) => l !== null);
  fs.writeFileSync(path.join(OUT_PLACES_DIR, `${place.id}.md`), lines.join("\n"), "utf8");
}

function main() {
  const jimById = {};
  if (fs.existsSync(JIM)) {
    for (const p of JSON.parse(fs.readFileSync(JIM, "utf8")).places || []) {
      jimById[p.id] = p;
    }
  }

  const places = [];
  const seen = new Set();

  // 1) carrigmapv2 stories
  if (fs.existsSync(CM_STORIES)) {
    for (const file of fs.readdirSync(CM_STORIES)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(CM_STORIES, file), "utf8");
      const parsed = parseFrontmatter(raw);
      if (!parsed || !parsed.data.slug) continue;
      const d = parsed.data;
      const id = d.slug;
      const jim = jimById[id] || {};
      const lat = parseFloat(d.lat);
      const lng = parseFloat(d.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const categories = Array.isArray(d.categories)
        ? d.categories
        : jim.category
          ? [jim.category]
          : [];
      const eras = Array.isArray(d.eras) ? d.eras : [];
      const sources = Array.isArray(d.sources) ? d.sources : jim.sources || [];

      // Prefer longer prose: cm body vs jim sections text
      let body = parsed.body;
      if ((!body || body.length < 120) && jim.sections) {
        body = jim.sections
          .flatMap((s) => s.blocks || [])
          .filter((b) => b.type === "paragraph" && b.text)
          .map((b) => b.text)
          .join("\n\n");
      }

      const place = {
        id,
        name: d.title || jim.name || id,
        location: { lat, lng },
        category: categories[0] || jim.category || "",
        categories,
        eras,
        type: jim.type || "",
        dates: jim.dates || {},
        preview: d.summary || jim.preview || "",
        author: d.author || "",
        status: d.status || "published",
        sources,
        images: (jim.images || []).map((img) => ({
          ...img,
          src: (img.src || "").replace(/^assets\/images\//, "/assets/map/places/"),
        })),
        relatedPlaces: jim.relatedPlaces || [],
        body,
        layer: "places",
        source: "carrigmapv2+jimmap",
      };
      places.push(place);
      seen.add(id);
    }
  }

  // 2) any jim-only leftovers
  for (const [id, jim] of Object.entries(jimById)) {
    if (seen.has(id)) continue;
    if (!jim.location) continue;
    places.push({
      ...jim,
      layer: "places",
      body: (jim.sections || [])
        .flatMap((s) => s.blocks || [])
        .filter((b) => b.type === "paragraph")
        .map((b) => b.text)
        .join("\n\n"),
      source: "jimmap",
    });
    seen.add(id);
  }

  // 3) MTU exhibits
  for (const ex of MTU_EXHIBITS) {
    if (seen.has(ex.id)) continue;
    places.push({
      id: ex.id,
      name: ex.name,
      location: { lat: ex.lat, lng: ex.lng },
      category: ex.category,
      categories: [ex.category],
      preview: ex.preview,
      liveVideoPage: ex.liveVideoPage,
      credit: CREDIT,
      layer: "mtu",
      status: "published",
      body: "",
      source: "mtu",
    });
    seen.add(ex.id);
  }

  places.sort((a, b) => a.name.localeCompare(b.name));

  // Write editor-friendly markdown copies
  ensureDir(OUT_PLACES_DIR);
  for (const p of places.filter((p) => p.layer !== "mtu")) {
    writePlaceMd(p);
  }

  // Map runtime JSON (lean) — always enough for popup placeholders
  const forMap = places.map((p) => {
    const hero = (p.images && p.images[0]) || null;
    return {
      id: p.id,
      name: p.name,
      location: p.location,
      category: p.category || "",
      categories: p.categories || [],
      eras: p.eras || [],
      preview: p.preview || "",
      author: p.author || "",
      status: p.status || "published",
      layer: p.layer || "places",
      liveVideoPage: p.liveVideoPage || null,
      credit: p.credit || null,
      heroImage: hero && hero.src ? hero.src : null,
      heroAlt: (hero && hero.alt) || p.name || "",
      hasPreview: !!(p.preview && String(p.preview).trim()),
      hasBody: !!(p.body && p.body.length > 80),
      detailPath: p.layer === "mtu" ? null : `/map/places/${p.id}/`,
    };
  });

  ensureDir(path.dirname(OUT_JSON));
  fs.writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        $comment:
          "Generated by scripts/build-places.js — edit src/places/*.md then re-run npm run build-places",
        places: forMap,
      },
      null,
      2
    ),
    "utf8"
  );

  // Copy filtered geojson from carrigmapv2
  ensureDir(OUT_GEO);
  for (const name of [
    "carrigtwohill-townlands.geojson",
    "carrigtwohill-parishes.geojson",
  ]) {
    const src = path.join(CM_GEO, name);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(OUT_GEO, name));
      console.log("copied", name);
    }
  }

  console.log(
    `Wrote ${forMap.length} places (${forMap.filter((p) => p.layer === "places").length} gazetteer + ${forMap.filter((p) => p.layer === "mtu").length} MTU) → ${OUT_JSON}`
  );
  console.log(`Editor files → ${OUT_PLACES_DIR} (${places.filter((p) => p.layer !== "mtu").length} markdown)`);
}

main();
