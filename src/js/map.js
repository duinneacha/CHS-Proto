/**
 * Historical map — MapLibre GL (jimmap-style Esri satellite + globe tilt).
 * Circle markers; labels from zoom threshold; optional townland names/borders.
 */
(function () {
  "use strict";

  const DEFAULT_CENTER = [-8.266, 51.908];
  const DEFAULT_ZOOM = 12;
  const DEFAULT_PITCH = 30;
  const DEFAULT_BEARING = 0;
  const FIT_MAX_ZOOM = 15;
  const LABEL_MIN_ZOOM = 12.2;

  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const ESRI_ATTRIBUTION =
    "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

  function prefixPath(p) {
    const css = document.querySelector('link[href*="/css/site.css"]');
    if (css) {
      const href = css.getAttribute("href");
      const idx = href.indexOf("/css/site.css");
      if (idx > 0) return href.slice(0, idx) + p;
    }
    return p;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function emptySourcesExtra() {
    return {
      townlands: {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      },
      parishes: {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      },
    };
  }

  function boundaryLayers(satellite) {
    const line = satellite ? "#ffffff" : "#0b3d6e";
    const parish = satellite ? "#ffdd00" : "#e2b84a";
    return [
      {
        id: "townland-fill",
        type: "fill",
        source: "townlands",
        layout: { visibility: "none" },
        paint: { "fill-color": line, "fill-opacity": 0.04 },
      },
      {
        id: "townland-outline",
        type: "line",
        source: "townlands",
        layout: { visibility: "none" },
        paint: {
          "line-color": line,
          "line-opacity": satellite ? 0.75 : 0.55,
          "line-width": 1,
        },
      },
      {
        id: "townland-names",
        type: "symbol",
        source: "townlands",
        minzoom: 11.5,
        layout: {
          visibility: "none",
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Regular", "Noto Sans Regular"],
          "text-size": 11,
          "text-max-width": 8,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": satellite ? "#ffffff" : "#0b3d6e",
          "text-halo-color": satellite
            ? "rgba(20, 16, 12, 0.9)"
            : "rgba(255, 253, 248, 0.95)",
          "text-halo-width": 1.4,
        },
      },
      {
        id: "parish-outline-casing",
        type: "line",
        source: "parishes",
        paint: {
          "line-color": "#1c1a17",
          "line-opacity": 0.55,
          "line-width": 4.5,
        },
      },
      {
        id: "parish-outline",
        type: "line",
        source: "parishes",
        paint: {
          "line-color": parish,
          "line-opacity": 1,
          "line-width": 2.5,
        },
      },
    ];
  }

  function buildStyle(kind) {
    const satellite = kind !== "street";
    if (!satellite) {
      return {
        version: 8,
        projection: { type: "globe" },
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: Object.assign(
          {
            osm: {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution: OSM_ATTRIBUTION,
            },
          },
          emptySourcesExtra()
        ),
        layers: [
          {
            id: "background",
            type: "background",
            paint: { "background-color": "#f6f1e6" },
          },
          { id: "osm", type: "raster", source: "osm" },
          ...boundaryLayers(false),
        ],
      };
    }

    return {
      version: 8,
      projection: { type: "globe" },
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: Object.assign(
        {
          "esri-imagery": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
            attribution: ESRI_ATTRIBUTION,
          },
          "esri-reference": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            maxzoom: 19,
          },
        },
        emptySourcesExtra()
      ),
      layers: [
        {
          id: "background",
          type: "background",
          paint: { "background-color": "#000" },
        },
        { id: "esri-imagery", type: "raster", source: "esri-imagery" },
        ...boundaryLayers(true),
        { id: "esri-reference", type: "raster", source: "esri-reference" },
      ],
    };
  }

  function popupHtml(place) {
    const cat =
      place.category && place.category !== "Unknown"
        ? escapeHtml(place.category)
        : "";
    const info = place.hasPreview
      ? escapeHtml(place.preview)
      : "Notes to be added — a short description of this place will go here.";
    const detailHref = place.detailPath
      ? prefixPath(place.detailPath)
      : place.liveVideoPage || null;

    let html = `<div class="map-popup">`;
    html += `<h3>${escapeHtml(place.name)}</h3>`;

    // Always show image slot (real photo or placeholder)
    if (place.heroImage) {
      html += `<figure class="map-popup-figure"><img src="${escapeHtml(
        place.heroImage.startsWith("http")
          ? place.heroImage
          : prefixPath(place.heroImage)
      )}" alt="${escapeHtml(place.heroAlt || place.name)}"></figure>`;
    } else {
      html += `<div class="map-popup-photo-ph" aria-hidden="true"><span>Photograph to be added</span></div>`;
    }

    if (cat) html += `<p class="map-popup-meta">${cat}</p>`;
    else html += `<p class="map-popup-meta map-popup-meta-empty">Category to be added</p>`;

    html += `<div class="map-popup-info${
      place.hasPreview ? "" : " map-popup-info-empty"
    }"><p>${info}</p></div>`;

    if (place.author) {
      html += `<p class="map-popup-meta">Record: ${escapeHtml(place.author)}</p>`;
    }

    if (place.liveVideoPage) {
      html += `<p><a class="map-popup-link" href="${escapeHtml(
        place.liveVideoPage
      )}" target="_blank" rel="noopener">Watch MTU exhibit video</a></p>`;
    }

    if (detailHref && !place.liveVideoPage) {
      html += `<p class="map-popup-actions"><a class="map-popup-link" href="${escapeHtml(
        detailHref
      )}">Further information</a></p>`;
    } else if (detailHref && place.layer === "mtu") {
      /* video link already shown */
    } else if (!place.liveVideoPage) {
      html += `<p class="map-popup-actions"><span class="map-popup-link-disabled">Further information — page to be completed</span></p>`;
    }

    if (place.credit) {
      html += `<p class="map-popup-credit"><small>${escapeHtml(
        place.credit
      )}</small></p>`;
    }

    html += `</div>`;
    return html;
  }

  function createPinElement(place) {
    const isMtu = place.layer === "mtu";
    const wrap = document.createElement("button");
    wrap.type = "button";
    wrap.className = "map-pin" + (isMtu ? " map-pin-mtu" : " map-pin-place");
    wrap.setAttribute("aria-label", place.name || "Historical place");
    wrap.title = place.name || "";

    const dot = document.createElement("span");
    dot.className = "map-pin-dot";
    wrap.appendChild(dot);

    if (place.name) {
      const label = document.createElement("span");
      label.className = "map-pin-label";
      label.textContent = place.name;
      wrap.appendChild(label);
    }
    return wrap;
  }

  function setOverlayVisibility(map, layerIds, on) {
    const v = on ? "visible" : "none";
    for (const id of layerIds) {
      if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", v);
    }
  }

  async function init() {
    const el = document.getElementById("chs-map");
    if (!el || typeof maplibregl === "undefined") return;

    const status = document.getElementById("map-status");
    if (status) status.hidden = false;

    let currentBasemap = "satellite";
    let townlandsOn = false;
    let townlandNamesOn = false;
    let townlandsData = null;
    let parishesData = null;

    const map = new maplibregl.Map({
      container: "chs-map",
      style: buildStyle("satellite"),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      bearing: DEFAULT_BEARING,
      maxPitch: 75,
      attributionControl: { compact: true },
    });

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120 }), "bottom-left");

    const syncLabelVisibility = () => {
      el.classList.toggle("show-pin-labels", map.getZoom() >= LABEL_MIN_ZOOM);
    };
    map.on("zoom", syncLabelVisibility);
    map.on("zoomend", syncLabelVisibility);

    const btnBase = document.getElementById("map-basemap-toggle");
    const btnTown = document.getElementById("map-townlands-toggle");
    const btnNames = document.getElementById("map-townland-names-toggle");

    async function ensureBoundaries() {
      if (townlandsData && parishesData) return;
      const [tRes, pRes] = await Promise.all([
        fetch(prefixPath("/data/carrigtwohill-townlands.geojson")),
        fetch(prefixPath("/data/carrigtwohill-parishes.geojson")),
      ]);
      if (tRes.ok) townlandsData = await tRes.json();
      if (pRes.ok) parishesData = await pRes.json();
    }

    function applyBoundaryData() {
      const t = map.getSource("townlands");
      const p = map.getSource("parishes");
      if (t && townlandsData) t.setData(townlandsData);
      if (p && parishesData) p.setData(parishesData);
      setOverlayVisibility(
        map,
        ["townland-fill", "townland-outline"],
        townlandsOn
      );
      setOverlayVisibility(map, ["townland-names"], townlandNamesOn);
    }

    map.on("style.load", applyBoundaryData);

    if (btnBase) {
      btnBase.addEventListener("click", () => {
        currentBasemap = currentBasemap === "satellite" ? "street" : "satellite";
        map.setStyle(buildStyle(currentBasemap), { diff: false });
        btnBase.textContent =
          currentBasemap === "satellite" ? "Street map" : "Satellite";
      });
    }

    if (btnTown) {
      btnTown.addEventListener("click", async () => {
        townlandsOn = !townlandsOn;
        btnTown.setAttribute("aria-pressed", townlandsOn ? "true" : "false");
        btnTown.classList.toggle("is-active", townlandsOn);
        if (townlandsOn) await ensureBoundaries();
        applyBoundaryData();
      });
    }

    if (btnNames) {
      btnNames.addEventListener("click", async () => {
        townlandNamesOn = !townlandNamesOn;
        btnNames.setAttribute(
          "aria-pressed",
          townlandNamesOn ? "true" : "false"
        );
        btnNames.classList.toggle("is-active", townlandNamesOn);
        if (townlandNamesOn) {
          townlandsOn = true;
          if (btnTown) {
            btnTown.setAttribute("aria-pressed", "true");
            btnTown.classList.add("is-active");
          }
          await ensureBoundaries();
        }
        applyBoundaryData();
      });
    }

    // Prefetch parish outline (small)
    try {
      const pr = await fetch(prefixPath("/data/carrigtwohill-parishes.geojson"));
      if (pr.ok) parishesData = await pr.json();
      applyBoundaryData();
    } catch (_) {
      /* optional */
    }

    const res = await fetch(prefixPath("/data/places.json"));
    const data = await res.json();
    const places = data.places || [];
    const bounds = new maplibregl.LngLatBounds();
    let count = 0;
    places.forEach((place) => {
      if (
        !place.location ||
        typeof place.location.lat !== "number" ||
        typeof place.location.lng !== "number"
      ) {
        return;
      }
      const lng = place.location.lng;
      const lat = place.location.lat;
      bounds.extend([lng, lat]);
      count++;

      // HTML markers persist across setStyle (basemap swap)
      new maplibregl.Marker({
        element: createPinElement(place),
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ offset: 18, maxWidth: "320px" }).setHTML(
            popupHtml(place)
          )
        )
        .addTo(map);
    });

    map.on("style.load", syncLabelVisibility);

    const applyBounds = () => {
      if (count > 1) {
        map.fitBounds(bounds, {
          padding: 60,
          maxZoom: FIT_MAX_ZOOM,
          pitch: DEFAULT_PITCH,
          bearing: DEFAULT_BEARING,
          duration: 0,
        });
      }
      syncLabelVisibility();
      if (status) status.hidden = true;
    };

    if (map.loaded()) applyBounds();
    else map.once("load", applyBounds);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
