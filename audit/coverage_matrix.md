# Coverage Matrix: Live Site vs. Backup

**Live site:** https://carrigtwohillhistoricalsociety.com/
**Backup root:** `D:\chs\website_backup_04072026\OneDrive_1_04-07-2026\`
**Method:** (1) automated crawl of the live site starting at `/`, following every internal `href`/`src` link found in the returned HTML, recursively, until no new internal links remained; (2) `sitemap.xml` and `robots.txt` both checked — neither exists (both return 404); (3) every `.aspx` file found in the backup was additionally requested directly against the live site by its file path, so pages that exist but are not linked from anywhere (orphan pages) are still captured.

## Live-site crawl results

- `sitemap.xml` → **404** (does not exist)
- `robots.txt` → **404** (does not exist)
- Crawl starting from `/` and following links discovered **64 distinct live pages** (HTTP 200) reachable by navigation, plus **3 broken internal links** on the live site itself that resolve to HTTP 404 (see "Broken links found on live site" below). Direct-path probing of every backup `.aspx` file found **2 additional live pages that return HTTP 500** and **1 that returns 404** (a dev test page), and surfaced **4 orphan pages** (`Default.aspx`, `BlankTest.aspx`, `C2H2040Voting.aspx`, `Menu.aspx`) that are live but not linked from any page currently in the navigation.

### Broken links found on the live site itself (not backup gaps)

These are pre-existing dead links baked into the live pages’ markup — the target the link points to doesn’t exist on the live server *or* in the backup, so nothing is missing from the backup; the live site has simply linked to the wrong path for years:

| Found on page | Broken link target | Live status | Notes |
|---|---|---|---|
| `/About/AboutUs.aspx` | `/About/Membership/Johnny Harte/JohnnyHartespx.aspx` | 404 | Wrong relative path — the real page is `/Membership/Johnny Harte/JohnnyHartespx.aspx` (confirmed live 200, backed up). |
| `/Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` | `/Events/Projects And Events/Coming Events/Taking of the Barracks/TakingofBarracks.aspx` | 404 | Target page does not exist anywhere — not live, not in the backup (the `Coming Events` folder is empty in the backup, confirming it's a genuinely dead link, not a missing asset). |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` | `/Events/Projects And Events/Past Events/Taking of the Barracks/RICBarracks.aspx` | 404 | Wrong filename — the real page is `RICStation.aspx` (confirmed live 200, backed up). |

## Coverage matrix

One row per live-reachable page. "Backup source path" is the primary working-tree location; "Fallback path" is filled in only when the file is absent from the primary tree and had to be recovered from the `obj/Release/Package/PackageTmp` precompiled build snapshot.

| Live URL | HTTP Status | Backup source path | Fallback path | Status flag | Notes |
|---|---|---|---|---|---|
| `/  (root, IIS default document)` | 200 | `— (not in primary tree)` | `obj/Release/Package/PackageTmp/Default.aspx` | OK (fallback only, alias of /Default.aspx) |  |
| `/About/AboutUs.aspx` | 200 | `About/AboutUs.aspx` | `` | OK |  |
| `/About/ContactUs.aspx` | 200 | `About/ContactUs.aspx` | `` | OK |  |
| `/About/ThankYou.aspx` | 200 | `About/ThankYou.aspx` | `` | OK |  |
| `/BlankTest.aspx` | 200 | `— (not in primary tree)` | `obj/Release/Package/PackageTmp/BlankTest.aspx` | OK (fallback only) |  |
| `/C2H2040Voting.aspx` | 200 | `— (not in primary tree)` | `obj/Release/Package/PackageTmp/C2H2040Voting.aspx` | OK (fallback only) |  |
| `/Cemeteries/AboutCemeteries.aspx` | 200 | `Cemeteries/AboutCemeteries.aspx` | `` | OK |  |
| `/Cemeteries/Interred.aspx` | 200 | `Cemeteries/Interred.aspx` | `` | OK |  |
| `/Cemeteries/Templecurraheen-graveyard.aspx` | 200 | `Cemeteries/Templecurraheen-graveyard.aspx` | `` | OK |  |
| `/CITInteractive/CITAbbeyRuins.aspx` | 200 | `CITInteractive/CITAbbeyRuins.aspx` | `` | OK |  |
| `/CITInteractive/CITBarracks.aspx` | 200 | `CITInteractive/CITBarracks.aspx` | `` | OK |  |
| `/CITInteractive/CITBarryscourt.aspx` | 200 | `CITInteractive/CITBarryscourt.aspx` | `` | OK |  |
| `/CITInteractive/CITConvent.aspx` | 200 | `CITInteractive/CITConvent.aspx` | `` | OK |  |
| `/CITInteractive/CITInteractiveMap.aspx` | 200 | `CITInteractive/CITInteractiveMap.aspx` | `` | OK |  |
| `/CITInteractive/CITMap.aspx` | 200 | `CITInteractive/CITMap.aspx` | `` | OK |  |
| `/CITInteractive/CITRossmore.aspx` | 200 | `CITInteractive/CITRossmore.aspx` | `` | OK |  |
| `/CITInteractive/CITSchools.aspx` | 200 | `CITInteractive/CITSchools.aspx` | `` | OK |  |
| `/CITInteractive/CITStMarys.aspx` | 200 | `CITInteractive/CITStMarys.aspx` | `` | OK |  |
| `/CITInteractive/SampleCredits.aspx` | 200 | `CITInteractive/SampleCredits.aspx` | `` | OK |  |
| `/CITInteractive/SampleIntroduction.aspx` | 200 | `CITInteractive/SampleIntroduction.aspx` | `` | OK |  |
| `/CITInteractive/VillageSignage.aspx` | 200 | `CITInteractive/VillageSignage.aspx` | `` | OK |  |
| `/Default.aspx` | 200 | `— (not in primary tree)` | `obj/Release/Package/PackageTmp/Default.aspx` | OK (fallback only) |  |
| `/Events/Barrymore DNA Project/FotaHouseDNAProject.aspx` | 200 | `Events/Barrymore DNA Project/FotaHouseDNAProject.aspx` | `` | OK |  |
| `/Events/Cork Celebrates Past/EasternHospitals.aspx` | 200 | `Events/Cork Celebrates Past/EasternHospitals.aspx` | `` | OK |  |
| `/Events/Debarra/DeBarra.aspx` | 200 | `Events/Debarra/DeBarra.aspx` | `` | OK |  |
| `/Events/Fota Solar/FotaSolarPanel.aspx` | 200 | `Events/Fota Solar/FotaSolarPanel.aspx` | `` | OK |  |
| `/Events/HayMaking/MakingHay.aspx` | 200 | `Events/HayMaking/MakingHay.aspx` | `` | OK |  |
| `/Events/Projects And Events/Calendar.aspx` | 200 | `Events/Projects And Events/Calendar.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` | 200 | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Edward Bransfield/EdwardBransfield.aspx` | 200 | `Events/Projects And Events/Past Events/Edward Bransfield/EdwardBransfield.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Miriam O'Donovan/MiriamODonovan.aspx` | 200 | `Events/Projects And Events/Past Events/Miriam O'Donovan/MiriamODonovan.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/PastEvents.aspx` | 200 | `Events/Projects And Events/Past Events/PastEvents.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` | 200 | `Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Sean Horgan/SeanHorgan.aspx` | 200 | `Events/Projects And Events/Past Events/Sean Horgan/SeanHorgan.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/BarrackStory.aspx` | 200 | `Events/Projects And Events/Past Events/Taking of the Barracks/BarrackStory.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx` | 200 | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` | 200 | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` | 200 | `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` | 200 | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` | `` | OK |  |
| `/Events/Projects And Events/Past Events/Western Front Association/WesternFrontAssociation.aspx` | 200 | `Events/Projects And Events/Past Events/Western Front Association/WesternFrontAssociation.aspx` | `` | OK |  |
| `/Events/Videos/CotterWreath.aspx` | 200 | `Events/Videos/CotterWreath.aspx` | `` | OK |  |
| `/Events/Videos/Dáibhí de Barra Videos.aspx` | 200 | `Events/Videos/Dáibhí de Barra Videos.aspx` | `` | OK |  |
| `/Events/Videos/Event Videos.aspx` | 200 | `Events/Videos/Event Videos.aspx` | `` | OK |  |
| `/Events/Videos/VideoCollection.aspx` | 200 | `Events/Videos/VideoCollection.aspx` | `` | OK |  |
| `/Local History/Archaeological/Altar Stone/AltarStone.aspx` | 200 | `Local History/Archaeological/Altar Stone/AltarStone.aspx` | `` | OK |  |
| `/Local History/Archaeological/Archaeology.aspx` | 200 | `Local History/Archaeological/Archaeology.aspx` | `` | OK |  |
| `/Local History/Ballyadam/Ballyadam.aspx` | 500 | `Local History/Ballyadam/Ballyadam.aspx` | `` | OK | Live site returns HTTP 500 (server error) right now — backup source is present and intact, this is a live-site runtime bug, not a backup gap. |
| `/Local History/Caves - Ringforts/Caves/Caves.aspx` | 200 | `Local History/Caves - Ringforts/Caves/Caves.aspx` | `` | OK |  |
| `/Local History/Folklore/Ballintubber/Ballintubber.aspx` | 200 | `Local History/Folklore/Ballintubber/Ballintubber.aspx` | `` | OK |  |
| `/Local History/Military/ArmyPensions.aspx` | 500 | `Local History/Military/ArmyPensions.aspx` | `` | OK | Live site returns HTTP 500 (server error) right now — backup source is present and intact, this is a live-site runtime bug, not a backup gap. Uses Main.Master (see notes below on that master’s broken image links). |
| `/Local History/Townlands/Townlands.aspx` | 200 | `Local History/Townlands/Townlands.aspx` | `` | OK |  |
| `/Local History/Village Traders/Barretts/BarretsForge.aspx` | 200 | `Local History/Village Traders/Barretts/BarretsForge.aspx` | `` | OK |  |
| `/Membership/Committee.aspx` | 200 | `Membership/Committee.aspx` | `` | OK |  |
| `/Membership/CurrentMembership.aspx` | 200 | `Membership/CurrentMembership.aspx` | `` | OK |  |
| `/Membership/Johnny Harte/JohnnyHartespx.aspx` | 200 | `Membership/Johnny Harte/JohnnyHartespx.aspx` | `` | OK |  |
| `/Menu.aspx` | 200 | `— (not in primary tree)` | `obj/Release/Package/PackageTmp/Menu.aspx` | OK (fallback only) |  |
| `/Parish Book/ParishBook.aspx` | 200 | `Parish Book/ParishBook.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Barrymore.aspx` | 200 | `Persons of Note/Barry/Barrymore.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Barryscourt/Barryscourt.aspx` | 200 | `Persons of Note/Barry/Barryscourt/Barryscourt.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Debarra/DáibhdeBarra.aspx` | 200 | `Persons of Note/Barry/Debarra/DáibhdeBarra.aspx` | `` | OK |  |
| `/Persons of Note/Barry/DNAProject.aspx` | 200 | `Persons of Note/Barry/DNAProject.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` | 200 | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Smith Barry/James Hugh Smith Barry/JamesHughSmithBarry.aspx` | 200 | `Persons of Note/Barry/Smith Barry/James Hugh Smith Barry/JamesHughSmithBarry.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Smith Barry/John Smith Barry/JohnSmthBarry.aspx` | 200 | `Persons of Note/Barry/Smith Barry/John Smith Barry/JohnSmthBarry.aspx` | `` | OK |  |
| `/Persons of Note/Barry/Standish Barry/StandishBarry.aspx` | 200 | `Persons of Note/Barry/Standish Barry/StandishBarry.aspx` | `` | OK |  |
| `/Persons of Note/Coppinger.aspx` | 200 | `Persons of Note/Coppinger.aspx` | `` | OK |  |
| `/Persons of Note/Cotter/Cotter.aspx` | 200 | `Persons of Note/Cotter/Cotter.aspx` | `` | OK |  |
| `/Persons of Note/Cotter/FamilyVault.aspx` | 200 | `Persons of Note/Cotter/FamilyVault.aspx` | `` | OK |  |
| `/Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` | 200 | `Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` | `` | OK |  |
| `/Persons of Note/Cotter/Sir James Cotter Senior/SirJamesCotterSenior.aspx` | 200 | `Persons of Note/Cotter/Sir James Cotter Senior/SirJamesCotterSenior.aspx` | `` | OK |  |
| `/Persons of Note/Cotter/Sir James Laurence Cotter/SirJamesLaurenceCotter.aspx` | 200 | `Persons of Note/Cotter/Sir James Laurence Cotter/SirJamesLaurenceCotter.aspx` | `` | OK |  |
| `/Persons of Note/Durdin/Durdin.aspx` | 200 | `Persons of Note/Durdin/Durdin.aspx` | `` | OK |  |
| `/Religious of Parish/Clergy/ParishClergy.aspx` | 200 | `Religious of Parish/Clergy/ParishClergy.aspx` | `` | OK |  |
| `/Religious of Parish/Clergy/Richard Seymour/RichardSeymour.aspx` | 200 | `Religious of Parish/Clergy/Richard Seymour/RichardSeymour.aspx` | `` | OK |  |
| `/Religious of Parish/Parish Churches/Abbey/Abbey.aspx` | 200 | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` | `` | OK |  |
| `/Religious of Parish/Parish Churches/PapalTaxes.aspx` | 200 | `Religious of Parish/Parish Churches/PapalTaxes.aspx` | `` | OK |  |
| `/Religious of Parish/Parish Churches/ParishChurches.aspx` | 200 | `Religious of Parish/Parish Churches/ParishChurches.aspx` | `` | OK |  |
| `/Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` | 200 | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` | `` | OK |  |
| `/Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` | 200 | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` | `` | OK |  |
| `/Religious of Parish/Poor Servants/PoorServants.aspx` | 200 | `Religious of Parish/Poor Servants/PoorServants.aspx` | `` | OK |  |
| `/Schools/Boarding School/BoardingSchool.aspx` | 200 | `Schools/Boarding School/BoardingSchool.aspx` | `` | OK |  |
| `/Schools/Boys School/BoysSchool.aspx` | 200 | `Schools/Boys School/BoysSchool.aspx` | `` | OK |  |
| `/Schools/First National School/FirstSchool.aspx` | 200 | `Schools/First National School/FirstSchool.aspx` | `` | OK |  |
| `/Schools/Hedge/HedgeSchoolsaspx.aspx` | 200 | `Schools/Hedge/HedgeSchoolsaspx.aspx` | `` | OK |  |
| `/SurveysandValuations/Downs Survey/DownsSurvey.aspx` | 200 | `SurveysandValuations/Downs Survey/DownsSurvey.aspx` | `` | OK |  |
| `/SurveysandValuations/Samuel Lewis/SamuelLewis.aspx` | 200 | `SurveysandValuations/Samuel Lewis/SamuelLewis.aspx` | `` | OK |  |
| `/Test Pages/Testaspx.aspx` | 404 | `Test Pages/Testaspx.aspx` | `` | backup-but-not-live | Developer test page, never deployed to production — 404 live is expected, not a real content loss. |

## Non-page infrastructure files

These aren’t independently browsable "pages" with their own URL/HTTP status, but they are required to rebuild/understand the site, so they’re tracked separately rather than as coverage-matrix rows.

| File | Primary tree | Fallback (`obj/Release/Package/PackageTmp`) | Status |
|---|---|---|---|
| `Web.config` (root) | Missing | Present | Recoverable from fallback. **Not opened/copied per instructions — contains live DB and SMTP credentials plus the ASP.NET machine key.** |
| `Global.asax` | Missing | **Also missing** | **NOT recoverable.** Searched the entire backup, including every `obj/Release` build snapshot (`AspnetCompileMerge/Source`, `AspnetCompileMerge/TempBuildDir`, `Package/PackageTmp`) and the `bin` folder — no `Global.asax` exists anywhere in this backup. This contradicts the assumption that it survived in the fallback tree. Genuine gap — see summary. |
| `Archaeology.Master` | Present (root) | Present | OK — the one master page that did survive in the primary tree. |
| `Barrymore.Master` | Missing | Present | Recoverable from fallback. Used by 8 live pages. |
| `CITMap.Master` | Missing | Present | Recoverable from fallback. Used by 12 live pages. |
| `Cemeteries.Master` | Missing | Present | Recoverable from fallback. Used by 3 live pages. |
| `Cotter.Master` | Missing | Present | Recoverable from fallback. Used by 4 live pages. |
| `Main.Master` | Missing | Present | Recoverable from fallback. Used by 5 live pages (`Ballintubber.aspx`, `ArmyPensions.aspx`, `BarretsForge.aspx`, `JohnnyHartespx.aspx`, `SirJamesLaurenceCotter.aspx`). Note: this master’s own image references (`Styles/EmailUs.png`, `Styles/YouTube.png`, etc.) are already broken (404) on the live site — pre-existing live-site defect, unrelated to backup completeness. |
| `MTUNew.Master` | Missing | Present | Recoverable from fallback. **Not referenced by any of the 82 live `.aspx` pages** — appears to be dormant/unused. |
| `NewMaster.Master` | Missing | Present | Recoverable from fallback. Used by 1 live page. |
| `Parish.Master` | Missing | Present | Recoverable from fallback. Used by 5 live pages. |
| `ParishClergy.Master` | Missing | Present | Recoverable from fallback. Used by 2 live pages. |
| `RICBarrack.Master` | Missing | Present | Recoverable from fallback. Used by 5 live pages. Same pre-existing broken-image-link caveat as `Main.Master` (`Styles/HomePage.png` 404s live too). |
| `SiteMaster.Master` | Missing | Present | Recoverable from fallback. The most-used master — 34 live pages. |
| `.sln` / `.vbproj` project files | Missing | Missing | Not required to reconstruct page content/output, but means the project cannot be reopened/rebuilt in Visual Studio as-is. |
| `My Project/PublishProfiles/FTPProfile.pubxml` | Present | — | **Not opened — contains FTP deployment target.** |
| `My Project/PublishProfiles/FTPProfile.pubxml.user` and 3 machine-specific `*.user` variants | Present | — | **Not opened — these historically carry saved FTP credentials.** |

