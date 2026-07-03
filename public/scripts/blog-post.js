// ── Table of Contents Generator ──
(function () {
  const tocList = document.getElementById("toc-list");
  const content = document.getElementById("blog-content");
  if (!tocList || !content) return;

  const headings = content.querySelectorAll("h2, h3");
  if (headings.length === 0) {
    tocList.innerHTML = '<p class="text-surface-500 text-sm py-2">No sections found.</p>';
    return;
  }

  let html = '<ul class="space-y-1 border-l-2 border-surface-700 pl-4">';
  headings.forEach(function (h, index) {
    let slug = h.textContent
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u024F\u0600-\u06FF\u0750-\u077F]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!slug || slug.length < 2) slug = "section-" + (index + 1);
    const baseId = slug;
    let counter = 1;
    let el = document.getElementById(slug);
    while (el && el !== h) {
      slug = baseId + "-" + counter++;
      el = document.getElementById(slug);
    }
    h.id = slug;

    const isH3 = h.tagName === "H3";
    const paddingClass = isH3 ? "pl-3 text-xs" : "text-sm font-medium";
    html += '<li class="' + paddingClass + '">';
    html += '<a href="#' + slug + '" class="block py-1 text-surface-400 hover:text-brand-400 transition-colors duration-200 truncate" title="' + h.textContent + '">';
    html += h.textContent;
    html += "</a>";
    html += "</li>";
  });
  html += "</ul>";
  tocList.innerHTML = html;
})();

// ── Copy Link Button ──
(function () {
  const btn = document.getElementById("copy-link-btn");
  const label = document.getElementById("copy-link-text");
  if (!btn || !label) return;

  const originalText = label.textContent;
  const copiedText = btn.dataset.copiedText || "Copied!";
  btn.addEventListener("click", function () {
    navigator.clipboard
      .writeText(window.location.href)
      .then(function () {
        label.textContent = copiedText;
        btn.classList.add("border-green-500", "text-green-400");
        setTimeout(function () {
          label.textContent = originalText;
          btn.classList.remove("border-green-500", "text-green-400");
        }, 2000);
      })
      .catch(function () {
        label.textContent = "\u26A0";
        label.style.color = "#f87171";
        label.style.borderColor = "#f87171";
        setTimeout(function () {
          label.textContent = originalText;
          label.style.color = "";
          label.style.borderColor = "";
        }, 2000);
      });
  });
})();

// ── Smooth scroll for TOC links ──
(function () {
  const tocList = document.getElementById("toc-list");
  if (!tocList) return;
  tocList.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();
