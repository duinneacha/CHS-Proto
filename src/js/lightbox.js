/**
 * Site-wide photo lightbox: click any content photo to enlarge,
 * with close / previous / next when the page has more than one.
 */
(function () {
  const SELECTOR = [
    "main .prose img",
    "main .place-hero img",
    "main .home-hero img",
    "main .page-body img",
  ].join(", ");

  const EXCLUDE = [
    ".site-header",
    ".site-footer",
    ".social-nav",
    ".paypal-form",
    ".maplibre-popup",
    ".map-page",
    "[data-lightbox='false']",
  ];

  function isExcluded(img) {
    if (!img || img.tagName !== "IMG") return true;
    if (img.closest(EXCLUDE.join(","))) return true;
    if (img.classList.contains("mtu-village-image")) return true;
    if (img.width === 1 && img.height === 1) return true;
    const src = img.getAttribute("src") || "";
    if (/pixel\.gif|1x1|spacer/i.test(src)) return true;
    return false;
  }

  function captionFor(img) {
    const fig = img.closest("figure");
    if (fig) {
      const cap = fig.querySelector("figcaption");
      if (cap && cap.textContent.trim()) return cap.textContent.trim();
    }
    return (img.getAttribute("alt") || "").trim();
  }

  function collect() {
    return Array.from(document.querySelectorAll(SELECTOR)).filter((img) => !isExcluded(img));
  }

  function init() {
    const images = collect();
    if (!images.length) return;

    images.forEach((img) => {
      img.classList.add("lightbox-trigger");
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      const label = captionFor(img) || "View larger image";
      img.setAttribute("aria-label", "Enlarge: " + label);
    });

    const root = document.createElement("div");
    root.className = "lightbox";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "Enlarged photograph");
    root.innerHTML =
      '<div class="lightbox-backdrop" data-lightbox-close></div>' +
      '<div class="lightbox-dialog">' +
      '  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close">' +
      "    <span aria-hidden=\"true\">×</span>" +
      "  </button>" +
      '  <button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Previous photograph">' +
      "    <span aria-hidden=\"true\">‹</span>" +
      "  </button>" +
      '  <figure class="lightbox-figure">' +
      '    <img class="lightbox-image" alt="">' +
      '    <figcaption class="lightbox-caption"></figcaption>' +
      "  </figure>" +
      '  <button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Next photograph">' +
      "    <span aria-hidden=\"true\">›</span>" +
      "  </button>" +
      '  <p class="lightbox-counter" aria-live="polite"></p>' +
      "</div>";
    document.body.appendChild(root);

    const imgEl = root.querySelector(".lightbox-image");
    const capEl = root.querySelector(".lightbox-caption");
    const counterEl = root.querySelector(".lightbox-counter");
    const prevBtn = root.querySelector("[data-lightbox-prev]");
    const nextBtn = root.querySelector("[data-lightbox-next]");
    let index = 0;
    let lastFocus = null;

    function gallery() {
      return collect();
    }

    function show(i) {
      const items = gallery();
      if (!items.length) return;
      index = ((i % items.length) + items.length) % items.length;
      const srcImg = items[index];
      imgEl.src = srcImg.currentSrc || srcImg.src;
      imgEl.alt = srcImg.alt || "";
      const cap = captionFor(srcImg);
      capEl.textContent = cap;
      capEl.hidden = !cap;
      const multi = items.length > 1;
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;
      counterEl.hidden = !multi;
      counterEl.textContent = multi ? index + 1 + " / " + items.length : "";
      items.forEach((el, n) => el.classList.toggle("is-lightbox-active", n === index));
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      root.hidden = false;
      document.body.classList.add("lightbox-open");
      root.querySelector(".lightbox-close").focus();
    }

    function close() {
      root.hidden = true;
      document.body.classList.remove("lightbox-open");
      gallery().forEach((el) => el.classList.remove("is-lightbox-active"));
      imgEl.removeAttribute("src");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function step(delta) {
      show(index + delta);
    }

    document.addEventListener("click", (e) => {
      const img = e.target.closest("img.lightbox-trigger");
      if (!img || isExcluded(img)) return;
      e.preventDefault();
      const items = gallery();
      const i = items.indexOf(img);
      if (i >= 0) open(i);
    });

    document.addEventListener("keydown", (e) => {
      if (root.hidden) {
        if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("lightbox-trigger")) {
          e.preventDefault();
          const items = gallery();
          const i = items.indexOf(e.target);
          if (i >= 0) open(i);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    });

    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-lightbox-close]")) {
        close();
        return;
      }
      if (e.target.closest("[data-lightbox-prev]")) {
        step(-1);
        return;
      }
      if (e.target.closest("[data-lightbox-next]")) {
        step(1);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
