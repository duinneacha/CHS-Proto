# Summary: Can This Backup Fully Reconstruct the Live Site?

**Short answer: almost — one confirmed content gap (3 images), plus some infrastructure files that don't affect a static-site migration.**

## What's fully covered

- **86 of 87 live-reachable URLs** have their exact source `.aspx` file in the backup: 82 in the primary working tree, and 4 more (`Default.aspx`, `BlankTest.aspx`, `C2H2040Voting.aspx`, `Menu.aspx`) recoverable from the `obj/Release/Package/PackageTmp` precompiled build snapshot, since they were never fully synced into the primary tree.
- **202 of 205 images/PDFs/videos** referenced anywhere in the site's markup/CSS are present and accounted for in the backup, sizes verified.
- All 12 `.Master` layout pages exist — 1 in the primary tree, 11 recoverable from the fallback build snapshot — so every page's shared header/nav/footer can be rebuilt.
- The crawl found no live page that lacks a backup source at all (no `live-but-no-backup-source` rows).

## What's actually missing

1. **3 images, confirmed live, absent from every copy in the backup** (not primary tree, not any `obj/Release` snapshot):
   - `Religious of Parish/Parish Churches/St David's/CoffeyBuildersCorkWeeklyExaminer.jpg`
   - `Religious of Parish/Parish Churches/St David's/PainChurchPlan.png`
   - `Religious of Parish/Parish Churches/St David's/PainSouthElevation.jpg`

   All three are used on `StDavidsChurch.aspx` and load fine live today. **These need to be downloaded directly from the live site before it's decommissioned** — they're the one real content hole in this backup.

2. **`Global.asax` does not exist anywhere in this backup** — not in the primary tree, and (contrary to the assumption going in) not in any `obj/Release` build snapshot either (`AspnetCompileMerge/Source`, `AspnetCompileMerge/TempBuildDir`, or `Package/PackageTmp` — all checked, none have it). This is a genuine gap. It doesn't block a static-site migration (it only carries app-lifecycle/global-error-handling code, no content), but if the colleague can locate a copy, it'd complete the picture.

3. **No `.sln`/`.vbproj` project file** survived anywhere in this backup, so the project can't be reopened and rebuilt in Visual Studio as-is. Irrelevant to a static migration, relevant if anyone ever wants to run the ASP.NET app again.

## Things that look like gaps but aren't

- **8 broken image references** (`sqpurple.gif`, and 7 images inside the legacy `Main.Master`/`RICBarrack.Master`/`MTUNew.Master` master pages) — all confirmed to **already 404 on the live site itself**. Pre-existing site rot, nothing to recover.
- **3 broken internal links** found while crawling (a mistyped path to the Johnny Harte page, a link to a `TakingofBarracks.aspx` that never existed, a wrong filename for the RIC station page) — all point to targets that are either 404 live or reachable via a different, correct, already-backed-up URL.
- **`Local History/Ballyadam/Ballyadam.aspx` and `Local History/Military/ArmyPensions.aspx` currently return HTTP 500** on the live site. The backup source for both is present and intact — this is a live production bug unrelated to backup completeness, but worth telling whoever owns hosting, since two pages are effectively down right now.
- **`Test Pages/Testaspx.aspx`** exists in the backup but 404s live — an internal dev test page that was (correctly) never deployed.
- **32 orphaned assets** (old logo variants, unlinked newsletter PDFs, draft images) sit in the backup unreferenced by any current page — harmless, just noted for completeness.

## GitHub-repo blocker to plan for

**6 video files exceed GitHub's 100 MB blob limit** (all in `CITInteractive/Videos/`, all actively used by live pages): `AbbeyRuins.mp4` (263 MB), `Convent.mp4` (240 MB), `RICBarracks.mp4` (218 MB), `BarryscourtCastle.mp4` (181 MB), `RossmoreBattle.mp4` (174 MB), `church.mp4` (150 MB). These will need Git LFS or an external host/CDN — they can't go into a plain GitHub repo.

## Credentials handling

Per instructions, `Web.config` (root, fallback-only) and all `*.pubxml*` files (`My Project/PublishProfiles/FTPProfile.pubxml` and its 4 `.user` variants) were **not opened or copied** — only confirmed to exist. They are known (from prior analysis) to carry live DB/SMTP credentials and FTP deployment secrets; rotate them before this backup is stored anywhere less trusted than it is now.

See `coverage_matrix.md` for the full page-by-page table and `assets_inventory.md` for the full asset-by-asset table.
