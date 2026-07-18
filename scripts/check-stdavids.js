const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  "_site/religious-of-parish/parish-churches/st-davids/st-davids-church/index.html",
  "utf8"
);
const srcs = [...html.matchAll(/src="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((s) => /Pain|Coffey|StDavid|Aloysius/i.test(s));
console.log(srcs.join("\n"));
const file = path.join(
  "src/assets/Religious of Parish/Parish Churches/St David's/PainChurchPlan.png"
);
console.log("file exists:", fs.existsSync(file));
