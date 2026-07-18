const fs = require("fs");
const path = require("path");

const jim = JSON.parse(
  fs.readFileSync("D:/chs/jimmap/data/places.json", "utf8")
).places;
const storiesDir = "D:/chs/carrigmapv2/src/stories";
const md = fs.readdirSync(storiesDir).filter((f) => f.endsWith(".md"));

function parseFm(file) {
  const t = fs.readFileSync(path.join(storiesDir, file), "utf8");
  const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const o = { file, body: m[2] || "", bodyLen: (m[2] || "").trim().length };
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    o[mm[1]] = v;
  }
  return o;
}

const stories = md.map(parseFm).filter(Boolean);
const jimIds = new Set(jim.map((p) => p.id));
const cmIds = new Set(stories.map((s) => s.slug).filter(Boolean));

console.log("jimmap places", jim.length);
console.log("carrigmapv2 stories", stories.length);
console.log(
  "only jim",
  [...jimIds].filter((id) => !cmIds.has(id)).join(", ") || "(none)"
);
console.log(
  "only cm",
  [...cmIds].filter((id) => !jimIds.has(id)).join(", ") || "(none)"
);
console.log(
  "cm with body>200",
  stories.filter((s) => s.bodyLen > 200).length
);
console.log(
  "jim with sections",
  jim.filter((p) => p.sections && p.sections.length).length
);

const tl = JSON.parse(
  fs.readFileSync(
    "D:/chs/carrigmapv2/src/geojson/carrigtwohill-townlands.geojson",
    "utf8"
  )
);
console.log("townland features", tl.features.length);
console.log("townland props", Object.keys(tl.features[0].properties || {}));
console.log(
  "townlands file KB",
  Math.round(
    fs.statSync(
      "D:/chs/carrigmapv2/src/geojson/carrigtwohill-townlands.geojson"
    ).size / 1024
  )
);

// Sample richer fields from cm
const sample = stories.find((s) => s.slug === "barryscourt-castle");
console.log("barryscourt sample", {
  lat: sample.lat,
  lng: sample.lng,
  summary: sample.summary && sample.summary.slice(0, 80),
  author: sample.author,
  status: sample.status,
  bodyLen: sample.bodyLen,
});
