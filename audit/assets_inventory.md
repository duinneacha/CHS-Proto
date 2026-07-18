# Assets Inventory: Images, PDFs, Videos in Backup

**Total assets found:** 205 files, 1.4 GB

Scope: primary working tree only (excludes `bin/`, `.vs/`, `packages/`, `obj/`, and the empty OneDrive error-recovery folders `__obj`, `__packages`, `__My Project` — those are build output/tooling caches, not distinct content). `Web.config` and `*.pubxml*` files are covered in `coverage_matrix.md` by name only; their contents were not opened.

## By file type

| Extension | Count | Total size |
|---|---|---|
| .mp4 | 10 | 1.4 GB |
| .jpg | 142 | 32.0 MB |
| .pdf | 12 | 25.0 MB |
| .m4v | 1 | 19.6 MB |
| .png | 27 | 4.7 MB |
| .jpeg | 11 | 2.0 MB |
| .bmp | 1 | 547.2 KB |
| .svg | 1 | 434.0 KB |

## Files over 100 MB (cannot go into a GitHub repo as normal blobs)

| File | Size | Referenced by |
|---|---|---|
| `CITInteractive/Videos/AbbeyRuins.mp4` | 263.0 MB | `CITInteractive/CITAbbeyRuins.aspx` |
| `CITInteractive/Videos/Convent.mp4` | 239.9 MB | `CITInteractive/CITConvent.aspx` |
| `CITInteractive/Videos/RICBarracks.mp4` | 217.7 MB | `CITInteractive/CITBarracks.aspx` |
| `CITInteractive/Videos/BarryscourtCastle.mp4` | 180.6 MB | `CITInteractive/CITBarryscourt.aspx` |
| `CITInteractive/Videos/RossmoreBattle.mp4` | 174.1 MB | `CITInteractive/CITRossmore.aspx` |
| `CITInteractive/Videos/church.mp4` | 150.0 MB | `CITInteractive/CITStMarys.aspx` |

**6 files exceed GitHub's 100 MB hard blob limit.** All 6 are CIT/MTU interactive-exhibit videos in `CITInteractive/Videos/`, actively referenced by live, working pages (`CITAbbeyRuins.aspx`, `CITBarryscourt.aspx`, `CITConvent.aspx`, `CITBarracks.aspx`, `CITRossmore.aspx`). They will need Git LFS, an external host (e.g. object storage / CDN with links from the static site), or exclusion from the repo with a documented separate distribution path.

## Referenced-but-missing assets (confirmed against live site)

Every `ImageUrl=`, `src=`, `href=`, and CSS `url()` reference across all `.aspx`, `.master`, and `.css` files (including the fallback-only master pages and `Default.aspx`) was resolved to a real file and checked. After eliminating false positives (HTML-entity-encoded `&amp;` in filenames, external PayPal button images, Bootstrap’s own icon-font CSS noise), these are the genuine cases where a page points at a local file that is not in the backup:

| Referenced path | Referenced by | Live status | Verdict |
|---|---|---|---|
| `Local History/Archaeological finds/Altar Stone/Altar Stone.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `Religious of Parish/Parish Churches/St David's/CoffeyBuildersCorkWeeklyExaminer.jpg` | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` | 200 | **MISSING FROM BACKUP — confirmed live.** Not in primary tree or any `obj/Release` snapshot. Must be pulled from the live server before decommissioning. |
| `Religious of Parish/Parish Churches/St David's/PainChurchPlan.png` | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` | 200 | **MISSING FROM BACKUP — confirmed live.** Not in primary tree or any `obj/Release` snapshot. Must be pulled from the live server before decommissioning. |
| `Religious of Parish/Parish Churches/St David's/PainSouthElevation.jpg` | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` | 200 | **MISSING FROM BACKUP — confirmed live.** Not in primary tree or any `obj/Release` snapshot. Must be pulled from the live server before decommissioning. |
| `Styles/CDHS Facebook Logo.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `Styles/EmailUs.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `Styles/Feredation Logo.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `Styles/HomePage.png` | `obj/Release/Package/PackageTmp/RICBarrack.Master` | 404 | Pre-existing dead reference inside `RICBarrack.Master` — also 404s live. Not a backup gap. |
| `Styles/New Logo.png` | `obj/Release/Package/PackageTmp/MTUNew.Master` | 404 | Pre-existing dead reference inside `MTUNew.Master` — that master is unused by any live page, so this never renders. Not a backup gap. |
| `Styles/SubscribeButton.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `Styles/YouTube.png` | `obj/Release/Package/PackageTmp/Main.Master` | 404 | Pre-existing dead reference inside `Main.Master` — also 404s live. Not a backup gap. |
| `styles/sqpurple.gif` | `Styles/CITStyle.css`; `Styles/CarrigHistory.css` | 404 | Pre-existing dead reference — also 404s on the live site itself (a bullet-point icon that was apparently deleted from the server long ago). Not a backup gap; nothing to recover. |

**Bottom line: 3 image files used by `StDavidsChurch.aspx` are confirmed live but absent from every copy in this backup — the only genuine missing-asset gap found.** Everything else in this section is a pre-existing broken link that 404s on the live site too, so there is nothing to recover for it.

## Orphaned assets (present in backup, not referenced by any current page)

32 files. Not a defect — mostly superseded logo variants, unused draft images, and newsletter/report PDFs not yet linked from a page — but listed for completeness since a content audit should account for every file.

| File | Size |
|---|---|
| `CITInteractive/Images/CDHS Facebook Logo.png` | 64.4 KB |
| `CITInteractive/Images/InteractiveMap 1.png` | 1014.5 KB |
| `CITInteractive/Images/MTU Facebook Logo.png` | 48.9 KB |
| `CITInteractive/Images/bckgrnd.jpeg` | 15.9 KB |
| `CITInteractive/Images/tag.jpeg` | 15.4 KB |
| `Cemeteries/Participants.jpg` | 26.7 KB |
| `Committee Reports/C2H2040 - Abbey Project.pdf` | 952.8 KB |
| `Documents/Newsletters/Christmas 2024.pdf` | 1.3 MB |
| `Documents/Newsletters/Christmas 2025.pdf` | 1.1 MB |
| `Events/Programme.jpg` | 273.1 KB |
| `Events/Projects And Events/Past Events/Sean Horgan/Midleton Workhouse.jpg` | 9.1 KB |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Barracks Poster.jpg` | 50.7 KB |
| `Events/Projects And Events/Past Events/Taking of the Barracks/DVD.jpg` | 79.9 KB |
| `Events/Projects And Events/Past Events/Taking of the Barracks/DVDClip.mp4` | 14.5 MB |
| `Events/Videos/Thumbnails/Ballycotton - Derry Keogh.jpg` | 75.2 KB |
| `Events/Videos/Thumbnails/Dáibhí Manuscript Transcription.jpg` | 105.3 KB |
| `Events/Videos/Thumbnails/Eastern Hospitals - Paul Shaw.jpg` | 73.2 KB |
| `Events/Videos/Thumbnails/Fota - Barry DNA Project.jpg` | 144.2 KB |
| `Events/Videos/Thumbnails/Fota Solar Farm.jpg` | 14.3 KB |
| `Events/Videos/Thumbnails/Hay Making.jpg` | 50.2 KB |
| `Events/Videos/Thumbnails/James Cotter Wreath.jpg` | 30.7 KB |
| `Local History/Caves - Ringforts/Caves/Forts A1.JPG` | 91.9 KB |
| `Local History/Caves - Ringforts/Caves/New Picture.bmp` | 547.2 KB |
| `Persons of Note/Cotter/James Cotter/Coat of Arms.jpg` | 7.9 KB |
| `Persons of Note/Cotter/Old Church Tower.jpg` | 3.4 MB |
| `Persons of Note/Gibson History Cover.png` | 229.2 KB |
| `Religious of Parish/Parish Churches/St Mary's/Former Parish B&W OSI.jpg` | 111.7 KB |
| `Styles/Email.jpg` | 3.9 KB |
| `Styles/Facebook Logo.jpg` | 6.7 KB |
| `Styles/InstergramLogo.png` | 70.2 KB |
| `Styles/OffWhiteBackground.jpg` | 73.7 KB |
| `Styles/logo.jpeg` | 864.4 KB |

## Full asset listing

| File | Size | Referenced by |
|---|---|---|
| `Cemeteries/Echo 1.jpeg` | 63.8 KB | `Cemeteries/Templecurraheen-graveyard.aspx` |
| `Cemeteries/Echo 2.jpeg` | 78.1 KB | `Cemeteries/Templecurraheen-graveyard.aspx` |
| `Cemeteries/Echo 3.jpeg` | 75.5 KB | `Cemeteries/Templecurraheen-graveyard.aspx` |
| `Cemeteries/Echo 4.jpeg` | 68.9 KB | `Cemeteries/Templecurraheen-graveyard.aspx` |
| `Cemeteries/Participants.jpg` | 26.7 KB | _(none — see orphans above)_ |
| `Cemeteries/SampleHeadstone.jpg` | 183.4 KB | `Cemeteries/AboutCemeteries.aspx` |
| `Cemeteries/StDavidsSiteplan.jpg` | 341.5 KB | `Cemeteries/AboutCemeteries.aspx` |
| `Cemeteries/Templecurraheen Graveyard Panel.jpg` | 58.0 KB | `Cemeteries/Templecurraheen-graveyard.aspx` |
| `CITInteractive/Images/back.png` | 6.1 KB | `CITInteractive/CITAbbeyRuins.aspx`; `CITInteractive/CITBarracks.aspx`; `CITInteractive/CITBarryscourt.aspx`; `CITInteractive/CITConvent.aspx`; `CITInteractive/CITRossmore.aspx`; `CITInteractive/CITSchools.aspx`; `CITInteractive/CITStMarys.aspx`; `CITInteractive/SampleCredits.aspx`; `CITInteractive/SampleIntroduction.aspx` |
| `CITInteractive/Images/bckgrnd.jpeg` | 15.9 KB | _(none — see orphans above)_ |
| `CITInteractive/Images/CBALogo.png` | 32.2 KB | `obj/Release/Package/PackageTmp/CITMap.Master` |
| `CITInteractive/Images/CDHS Facebook Logo.png` | 64.4 KB | _(none — see orphans above)_ |
| `CITInteractive/Images/CITlogo.png` | 39.2 KB | `obj/Release/Package/PackageTmp/CITMap.Master` |
| `CITInteractive/Images/CountyCouncil - logo.png` | 40.1 KB | `obj/Release/Package/PackageTmp/CITMap.Master` |
| `CITInteractive/Images/InteractiveMap 1.png` | 1014.5 KB | _(none — see orphans above)_ |
| `CITInteractive/Images/InteractiveMap.png` | 1.4 MB | `CITInteractive/CITMap.aspx` |
| `CITInteractive/Images/Main Display Panel.jpg` | 167.0 KB | `CITInteractive/VillageSignage.aspx` |
| `CITInteractive/Images/MTU Facebook Logo.png` | 48.9 KB | _(none — see orphans above)_ |
| `CITInteractive/Images/Poor Servants of the Mother of God.jpg` | 163.1 KB | `CITInteractive/VillageSignage.aspx` |
| `CITInteractive/Images/PSMGLogo.png` | 54.0 KB | `obj/Release/Package/PackageTmp/CITMap.Master` |
| `CITInteractive/Images/St David's Panel.jpg` | 173.8 KB | `CITInteractive/VillageSignage.aspx` |
| `CITInteractive/Images/tag.jpeg` | 15.4 KB | _(none — see orphans above)_ |
| `CITInteractive/Images/Taking of the Barracks.jpg` | 161.3 KB | `CITInteractive/VillageSignage.aspx` |
| `CITInteractive/Videos/AbbeyRuins.mp4` | 263.0 MB ⚠️ >100MB | `CITInteractive/CITAbbeyRuins.aspx` |
| `CITInteractive/Videos/BarryscourtCastle.mp4` | 180.6 MB ⚠️ >100MB | `CITInteractive/CITBarryscourt.aspx` |
| `CITInteractive/Videos/church.mp4` | 150.0 MB ⚠️ >100MB | `CITInteractive/CITStMarys.aspx` |
| `CITInteractive/Videos/Convent.mp4` | 239.9 MB ⚠️ >100MB | `CITInteractive/CITConvent.aspx` |
| `CITInteractive/Videos/RICBarracks.mp4` | 217.7 MB ⚠️ >100MB | `CITInteractive/CITBarracks.aspx` |
| `CITInteractive/Videos/RossmoreBattle.mp4` | 174.1 MB ⚠️ >100MB | `CITInteractive/CITRossmore.aspx` |
| `CITInteractive/Videos/SampleCredits.mp4` | 39.8 MB | `CITInteractive/SampleCredits.aspx` |
| `CITInteractive/Videos/SampleIntroduction.mp4` | 31.5 MB | `CITInteractive/SampleIntroduction.aspx` |
| `CITInteractive/Videos/SchoolsOfCarrig.mp4` | 73.0 MB | `CITInteractive/CITSchools.aspx` |
| `Committee Reports/C2H2040 - Abbey Project.pdf` | 952.8 KB | _(none — see orphans above)_ |
| `Documents/Newsletters/Christmas 2024.pdf` | 1.3 MB | _(none — see orphans above)_ |
| `Documents/Newsletters/Christmas 2025.pdf` | 1.1 MB | _(none — see orphans above)_ |
| `Events/Barrymore DNA Project/CHS Presentation.pdf` | 15.8 MB | `Events/Barrymore DNA Project/FotaHouseDNAProject.aspx` |
| `Events/Debarra/DaibhiCommunityCentre.jpg` | 69.5 KB | `Events/Debarra/DeBarra.aspx` |
| `Events/Debarra/DeBarraHandover.jpg` | 185.6 KB | `Events/Debarra/DeBarra.aspx` |
| `Events/Debarra/Dáibhí-de-Barra - Midleton News.jpg` | 115.0 KB | `Events/Debarra/DeBarra.aspx` |
| `Events/Debarra/Jim Barry Daibhi 9.jpg` | 100.2 KB | `Events/Debarra/DeBarra.aspx` |
| `Events/Debarra/Josephine FitzGerald.jpg` | 61.5 KB | `Events/Debarra/DeBarra.aspx` |
| `Events/Programme.jpg` | 273.1 KB | _(none — see orphans above)_ |
| `Events/Projects And Events/Past Events/City Hall/Camden Fort.jpg` | 52.1 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/Jim Barry & Paddy Kiely.JPG` | 99.6 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/Man with Gun.JPG` | 103.1 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/Marie McCarthy.jpg` | 55.3 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/Richard Cooke.jpg` | 56.9 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/SigningVisitorsBook.JPG` | 104.8 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/City Hall/Visitor.jpg` | 54.9 KB | `Events/Projects And Events/Past Events/City Hall/CelebratingCorkPast.aspx` |
| `Events/Projects And Events/Past Events/Cork Celebrates past screenshot.jpg` | 478.9 KB | `Events/Projects And Events/Past Events/PastEvents.aspx` |
| `Events/Projects And Events/Past Events/Edward Bransfield/Eliesa-Philis.JPG` | 177.9 KB | `Events/Projects And Events/Past Events/Edward Bransfield/EdwardBransfield.aspx` |
| `Events/Projects And Events/Past Events/Edward Bransfield/Liam-Michael.JPG` | 3.6 MB | `Events/Projects And Events/Past Events/Edward Bransfield/EdwardBransfield.aspx` |
| `Events/Projects And Events/Past Events/Edward Bransfield/Marie.JPG` | 167.1 KB | `Events/Projects And Events/Past Events/Edward Bransfield/EdwardBransfield.aspx` |
| `Events/Projects And Events/Past Events/Miriam O'Donovan/Miriam audience.jpg` | 60.0 KB | `Events/Projects And Events/Past Events/Miriam O'Donovan/MiriamODonovan.aspx` |
| `Events/Projects And Events/Past Events/Miriam O'Donovan/Miriam presentation.jpg` | 77.0 KB | `Events/Projects And Events/Past Events/Miriam O'Donovan/MiriamODonovan.aspx` |
| `Events/Projects And Events/Past Events/Miriam O'Donovan/Pray Book first leaf.jpg` | 23.6 KB | `Events/Projects And Events/Past Events/Miriam O'Donovan/MiriamODonovan.aspx` |
| `Events/Projects And Events/Past Events/Patricia Lyons/Cloyne Round Tower.jpg` | 86.0 KB | `Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` |
| `Events/Projects And Events/Past Events/Patricia Lyons/Main Church.jpg` | 54.9 KB | `Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` |
| `Events/Projects And Events/Past Events/Patricia Lyons/North Chancel.jpg` | 62.1 KB | `Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` |
| `Events/Projects And Events/Past Events/Patricia Lyons/Our Arrival.JPG` | 120.0 KB | `Events/Projects And Events/Past Events/Patricia Lyons/TourofCloyne.aspx` |
| `Events/Projects And Events/Past Events/Programme.jpg` | 436.0 KB | `Events/Projects And Events/Past Events/PastEvents.aspx` |
| `Events/Projects And Events/Past Events/Sean Horgan/Midleton Workhouse Lecture.jpg` | 28.8 KB | `Events/Projects And Events/Past Events/Sean Horgan/SeanHorgan.aspx` |
| `Events/Projects And Events/Past Events/Sean Horgan/Midleton Workhouse Tour.jpg` | 59.4 KB | `Events/Projects And Events/Past Events/Sean Horgan/SeanHorgan.aspx` |
| `Events/Projects And Events/Past Events/Sean Horgan/Midleton Workhouse.jpg` | 9.1 KB | _(none — see orphans above)_ |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Barracks Poster.jpg` | 50.7 KB | _(none — see orphans above)_ |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Blasted Wall Internal - Illustrated London News.jpeg` | 251.1 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/BarrackStory.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/DVD.jpg` | 79.9 KB | _(none — see orphans above)_ |
| `Events/Projects And Events/Past Events/Taking of the Barracks/DVDClip.mp4` | 14.5 MB | _(none — see orphans above)_ |
| `Events/Projects And Events/Past Events/Taking of the Barracks/DVDClipVer4.m4v` | 19.6 MB | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/External View.jpeg` | 497.8 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/BarrackStory.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/John O'Mahony with CDs.jpg` | 113.0 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/John O'Mahony.JPG` | 84.9 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/bouquet.jpg` | 119.8 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/Group.jpg` | 129.7 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/John.jpg` | 54.8 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/Mary Linehan Foley.JPG` | 41.4 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/Plaque.jpg` | 38.7 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Plaque/PlaqueUnveiling.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Jim Unveiling.jpg` | 63.6 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/The Committee.jpg` | 68.7 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/The Flag.jpg` | 53.4 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/The Gathered.jpg` | 138.4 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Unveiled.jpg` | 69.7 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/Temporary Pannel/Temporarypanel .aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/The audience.JPG` | 110.5 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Projects And Events/Past Events/Taking of the Barracks/The Ladies.JPG` | 55.2 KB | `Events/Projects And Events/Past Events/Taking of the Barracks/DVD Presentation.aspx`; `Events/Projects And Events/Past Events/Taking of the Barracks/RICStation.aspx` |
| `Events/Videos/Thumbnails/Ballycotton - Derry Keogh.jpg` | 75.2 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/Dáibhí Manuscript Transcription.jpg` | 105.3 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/Eastern Hospitals - Paul Shaw.jpg` | 73.2 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/Fota - Barry DNA Project.jpg` | 144.2 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/Fota Solar Farm.jpg` | 14.3 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/Hay Making.jpg` | 50.2 KB | _(none — see orphans above)_ |
| `Events/Videos/Thumbnails/James Cotter Wreath.jpg` | 30.7 KB | _(none — see orphans above)_ |
| `fonts/fontawesome-webfont.svg` | 434.0 KB | `Bootstrap/font-awesome.css`; `Bootstrap/font-awesome.min.css` |
| `Local History/Archaeological/Altar Stone/Altar Stone.png` | 417.4 KB | `Local History/Archaeological/Altar Stone/AltarStone.aspx` |
| `Local History/Archaeological/Altar Stone/Inscription.jpg` | 222.8 KB | `Local History/Archaeological/Altar Stone/AltarStone.aspx` |
| `Local History/Archaeological/Altar Stone/JCHAS 1943 Altar Stone.pdf` | 289.3 KB | `Local History/Archaeological/Altar Stone/AltarStone.aspx` |
| `Local History/Ballyadam/Petition Element.pdf` | 481.9 KB | `Local History/Ballyadam/Ballyadam.aspx` |
| `Local History/Caves - Ringforts/Caves/Caves of Carrigtwohill - Naturalist Journal 1945.pdf` | 325.6 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Caves of Carrigtwohill.pdf` | 709.3 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Forts A1.JPG` | 91.9 KB | _(none — see orphans above)_ |
| `Local History/Caves - Ringforts/Caves/New Picture.bmp` | 547.2 KB | _(none — see orphans above)_ |
| `Local History/Caves - Ringforts/Caves/Ringfort.jpg` | 56.7 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Sectional View.jpg` | 33.6 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Valuation map Terrysland.jpg` | 30.5 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Wolf Skull.jpg` | 27.2 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Caves - Ringforts/Caves/Woodstock Ringfort.jpg` | 40.0 KB | `Local History/Caves - Ringforts/Caves/Caves.aspx` |
| `Local History/Village Traders/Barretts/Barrett's Forge - CE 1 June 21.jpg` | 1.1 MB | `Local History/Village Traders/Barretts/BarretsForge.aspx` |
| `Local History/Village Traders/Barretts/BarrettsForge.jpg` | 54.0 KB | `Local History/Village Traders/Barretts/BarretsForge.aspx` |
| `Local History/Village Traders/Barretts/ForgeToday.jpg` | 4.6 MB | `Local History/Village Traders/Barretts/BarretsForge.aspx` |
| `Membership/History-Society-AGM-300x173.jpg` | 20.1 KB | `Membership/CurrentMembership.aspx` |
| `Membership/Johnny Harte/Harte Brothers.jpg` | 116.7 KB | `Membership/Johnny Harte/JohnnyHartespx.aspx` |
| `Membership/Johnny Harte/Johnny Hart.JPG` | 90.3 KB | `Membership/Johnny Harte/JohnnyHartespx.aspx` |
| `Persons of Note/Barry/Barrymore Cover.jpg` | 83.6 KB | `Persons of Note/Barry/Barrymore.aspx` |
| `Persons of Note/Barry/Barryscourt/Manorbier Castle.jpg` | 103.2 KB | `Persons of Note/Barry/Barryscourt/Barryscourt.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Bishop of Rochester - Freeman 8 July 1825.jpg` | 177.2 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Garrett Standish Barry - SR 1 Jan 1833.jpg` | 139.8 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Garrett Standish Barry - SR 29 Nov 1832.jpg` | 115.9 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/GSB O'Connell meeting Cary's Lane - Freeman 22 Aug 1825.jpg` | 106.3 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/John Joe Barry - Story of Leamlara.jpg` | 384.0 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Sale of Leamlar CC29 May 1852.jpg` | 128.5 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Sale of Leamlara 1851.pdf` | 3.0 MB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Garrett Standish Barry/Tithe War of Leamlara.jpg` | 360.7 KB | `Persons of Note/Barry/Garrett Standish Barry/GarrettStandishBarry.aspx` |
| `Persons of Note/Barry/Smith Barry/James Hugh Smith Barry/Tenant Party Fota - CE 23 August 1847.jpg` | 57.3 KB | `Persons of Note/Barry/Smith Barry/James Hugh Smith Barry/JamesHughSmithBarry.aspx` |
| `Persons of Note/Barry/Smith Barry/John Smith Barry/Fota House.jpg` | 181.3 KB | `Persons of Note/Barry/Smith Barry/John Smith Barry/JohnSmthBarry.aspx` |
| `Persons of Note/Barry/Standish Barry/Garrett Standish Barry baptism 12 June 1788.jpg` | 418.8 KB | `Persons of Note/Barry/Standish Barry/StandishBarry.aspx` |
| `Persons of Note/Barry/Standish Barry/LeamlaraHouse.jpg` | 43.5 KB | `Persons of Note/Barry/Standish Barry/StandishBarry.aspx` |
| `Persons of Note/Barry/Standish Barry/Standish Barry Death - Freeman 7 May 21.jpg` | 18.2 KB | `Persons of Note/Barry/Standish Barry/StandishBarry.aspx` |
| `Persons of Note/Cotter/Cotter memorial.JPG` | 140.9 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Cotter/Gilles Dargnies 1982.jpg` | 126.9 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Cotter/Hartnett Vault.JPG` | 117.4 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Cotter/James Cotter/BethamsCrest.jpg` | 30.0 KB | `Persons of Note/Cotter/Sir James Cotter Senior/SirJamesCotterSenior.aspx` |
| `Persons of Note/Cotter/James Cotter/Caledonian Mercury 27 May 1720.jpg` | 224.2 KB | `Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` |
| `Persons of Note/Cotter/James Cotter/Caledonian Mercury Cover.jpg` | 153.6 KB | `Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` |
| `Persons of Note/Cotter/James Cotter/Coat of Arms.jpg` | 7.9 KB | _(none — see orphans above)_ |
| `Persons of Note/Cotter/James Cotter/Cotter case - Pue's Occurrences Dublin 3 March 1719.jpg` | 94.6 KB | `Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` |
| `Persons of Note/Cotter/James Cotter/Squib mobbed - Caledonian 26 May 1720.jpg` | 108.4 KB | `Persons of Note/Cotter/James Cotter/SirJamesCotter.aspx` |
| `Persons of Note/Cotter/Memorial - JCHAS 1908.jpg` | 63.8 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Cotter/O'Flynn Cotter Vault.jpg` | 63.5 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Cotter/Old Church Tower.jpg` | 3.4 MB | _(none — see orphans above)_ |
| `Persons of Note/Cotter/Sir James Cotter Senior/Betham's Sir Cotter Abstract.jpg` | 120.5 KB | `Persons of Note/Cotter/Sir James Cotter Senior/SirJamesCotterSenior.aspx` |
| `Persons of Note/Cotter/Sir James Cotter Senior/Gould - Vicar General Marriage Licences.jpg` | 400.5 KB | `Persons of Note/Cotter/Sir James Cotter Senior/SirJamesCotterSenior.aspx` |
| `Persons of Note/Cotter/Sir James Laurence Cotter/Trinity College Cambridge - CC 3 June 1862.jpg` | 113.9 KB | `Persons of Note/Cotter/Sir James Laurence Cotter/SirJamesLaurenceCotter.aspx` |
| `Persons of Note/Cotter/St Davids OSI PSMG.jpg` | 93.9 KB | `Persons of Note/Cotter/FamilyVault.aspx` |
| `Persons of Note/Durdin/bap mary durdin 1649 norwich.JPG` | 43.0 KB | `Persons of Note/Durdin/Durdin.aspx` |
| `Persons of Note/Durdin/Crockford’s Clerical Directory.jpg` | 40.3 KB | `Persons of Note/Durdin/Durdin.aspx` |
| `Persons of Note/Gibson History Cover.png` | 229.2 KB | _(none — see orphans above)_ |
| `Religious of Parish/BradyHistory.png` | 32.5 KB | `Religious of Parish/Parish Churches/ParishChurches.aspx` |
| `Religious of Parish/Clergy/Richard Seymour/Richard Seymour.jpg` | 30.3 KB | `Religious of Parish/Clergy/Richard Seymour/RichardSeymour.aspx` |
| `Religious of Parish/Ecclesiastical Taxes 1302-1307.png` | 143.7 KB | `Religious of Parish/Parish Churches/PapalTaxes.aspx` |
| `Religious of Parish/Parish Churches/Abbey/Abbey grounds Griffiths Map.jpg` | 82.7 KB | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` |
| `Religious of Parish/Parish Churches/Abbey/Augustine Monk.jpg` | 189.4 KB | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` |
| `Religious of Parish/Parish Churches/Abbey/Augustinian Monasteries of Cork.pdf` | 632.8 KB | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` |
| `Religious of Parish/Parish Churches/Abbey/North Side.JPG` | 220.2 KB | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` |
| `Religious of Parish/Parish Churches/Abbey/South Side.JPG` | 198.2 KB | `Religious of Parish/Parish Churches/Abbey/Abbey.aspx` |
| `Religious of Parish/Parish Churches/St David's/St Aloysius - OSI.jpg` | 65.8 KB | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` |
| `Religious of Parish/Parish Churches/St David's/StDavidEastWall.jpeg` | 109.6 KB | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` |
| `Religious of Parish/Parish Churches/St David's/StDavids.jpg` | 56.8 KB | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/Current Parish OSI.jpg` | 72.7 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/Former Parish B&W OSI.jpg` | 111.7 KB | _(none — see orphans above)_ |
| `Religious of Parish/Parish Churches/St Mary's/Former Parish OSI.jpg` | 38.3 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/Forrest Stone.jpg` | 57.2 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/Foundation Stone.jpg` | 66.8 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/St Mary's & Convent.jpg` | 72.7 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/St Mary's Bell.jpg` | 91.5 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/St Mary's Consecration.pdf` | 149.3 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/St Mary's First Mass.jpg` | 116.5 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Parish Churches/St Mary's/Valuation House Book.jpg` | 44.5 KB | `Religious of Parish/Parish Churches/St Mary's/StMarys.aspx` |
| `Religious of Parish/Poor Servants/Convent.jpg` | 275.1 KB | `Religious of Parish/Poor Servants/PoorServants.aspx` |
| `Religious of Parish/Poor Servants/Mothers tomb.jpg` | 23.6 KB | `Religious of Parish/Poor Servants/PoorServants.aspx` |
| `Religious of Parish/Poor Servants/Newsletter Frances Taylor.pdf` | 369.1 KB | `Religious of Parish/Poor Servants/PoorServants.aspx` |
| `Schools/Boarding School/Boarding School - CE 9 Oct 1880.jpg` | 83.8 KB | `Schools/Boarding School/BoardingSchool.aspx` |
| `Schools/Boys School/Boys National School.jpg` | 9.3 KB | `Schools/Boys School/BoysSchool.aspx` |
| `Schools/Boys School/New School Tenders - CE 21 Dec 1955.jpg` | 122.1 KB | `Schools/Boys School/BoysSchool.aspx` |
| `Schools/Boys School/Terry Lease 1893.jpg` | 35.9 KB | `Schools/Boys School/BoysSchool.aspx` |
| `Schools/First National School/First National School.jpg` | 78.2 KB | `Schools/First National School/FirstSchool.aspx` |
| `Schools/First National School/Village map pre 1856.jpg` | 71.3 KB | `Schools/First National School/FirstSchool.aspx` |
| `Schools/Hedge/HedgeClassRoom.png` | 70.3 KB | `Schools/Hedge/HedgeSchoolsaspx.aspx` |
| `Styles/bckgrndPanel.jpeg` | 15.9 KB | `Styles/CITStyle.css`; `Styles/CarrigHistory.css`; `Styles/Subform - New.css`; `Styles/Subform.css` |
| `Styles/Carrigtwohillbannerlogo.png` | 406.5 KB | `Styles/CITStyle.css`; `Styles/CarrigHistory.css`; `obj/Release/Package/PackageTmp/Main.Master` |
| `Styles/Email.jpg` | 3.9 KB | _(none — see orphans above)_ |
| `Styles/Facebook Logo.jpg` | 6.7 KB | _(none — see orphans above)_ |
| `Styles/FerderationLogo.jpg` | 45.0 KB | `obj/Release/Package/PackageTmp/Main.Master` |
| `Styles/Images/BarryDNALogo.png` | 64.9 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/BarrymoreCrest.png` | 187.7 KB | `Persons of Note/Barry/DNAProject.aspx` |
| `Styles/Images/C2H2040.png` | 28.7 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/CarrigtwohillStone.jpg` | 4.3 MB | `obj/Release/Package/PackageTmp/Default.aspx` |
| `Styles/Images/CDHSLogo.png` | 91.9 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/EmailUs.png` | 38.6 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/FacebookLogo.png` | 53.2 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/FeredationLogo.png` | 44.6 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/HomePage.png` | 113.4 KB | `obj/Release/Package/PackageTmp/Barrymore.Master`; `obj/Release/Package/PackageTmp/BlankTest.aspx`; `obj/Release/Package/PackageTmp/CITMap.Master`; `obj/Release/Package/PackageTmp/Cemeteries.Master`; `obj/Release/Package/PackageTmp/ParishClergy.Master` |
| `Styles/Images/Instagram.png` | 56.7 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/SubscribeButton.png` | 65.4 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/Images/YouTube.png` | 35.6 KB | `obj/Release/Package/PackageTmp/NewMaster.Master`; `obj/Release/Package/PackageTmp/SiteMaster.Master` |
| `Styles/InstergramLogo.png` | 70.2 KB | _(none — see orphans above)_ |
| `Styles/logo.jpeg` | 864.4 KB | _(none — see orphans above)_ |
| `Styles/OffWhiteBackground.jpg` | 73.7 KB | _(none — see orphans above)_ |
| `Styles/Site Under Construction.JPG` | 12.8 KB | `obj/Release/Package/PackageTmp/BlankTest.aspx`; `obj/Release/Package/PackageTmp/Main.Master` |
| `Styles/Social evening.jpg` | 56.2 KB | `About/AboutUs.aspx` |
| `SurveysandValuations/Downs Survey/Downs Map.jpg` | 222.9 KB | `SurveysandValuations/Downs Survey/DownsSurvey.aspx` |
| `SurveysandValuations/Downs Survey/Downs Occupants.jpg` | 395.8 KB | `SurveysandValuations/Downs Survey/DownsSurvey.aspx` |
| `SurveysandValuations/Downs Survey/Downs Parish of Carigtuoghill .jpg` | 161.5 KB | `SurveysandValuations/Downs Survey/DownsSurvey.aspx` |
| `SurveysandValuations/Samuel Lewis/1.jpg` | 207.0 KB | `SurveysandValuations/Samuel Lewis/SamuelLewis.aspx` |
| `SurveysandValuations/Samuel Lewis/2.jpg` | 279.5 KB | `SurveysandValuations/Samuel Lewis/SamuelLewis.aspx` |
| `SurveysandValuations/Samuel Lewis/Cover.jpg` | 114.2 KB | `SurveysandValuations/Samuel Lewis/SamuelLewis.aspx` |
| `SurveysandValuations/Valuations/Valuation Field Book 26 Nov 1847 - Parish Churches.jpg` | 225.4 KB | `Religious of Parish/Parish Churches/St David's/StDavidsChurch.aspx` |

