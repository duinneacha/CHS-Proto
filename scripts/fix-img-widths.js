/** Strip mistaken pixel width attrs left by migration (95% → width="95"). */
const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(abs);
    else if (ent.name.endsWith(".md")) {
      let s = fs.readFileSync(abs, "utf8");
      const next = s.replace(/\s+width="\d+"/gi, "");
      if (next !== s) {
        fs.writeFileSync(abs, next, "utf8");
        console.log("fixed", path.relative(process.cwd(), abs));
      }
    }
  }
}

walk(path.join(__dirname, "..", "src", "content"));
