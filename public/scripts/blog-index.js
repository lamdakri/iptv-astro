document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("blog-posts-grid");
  const INITIAL_POSTS = grid ? parseInt(grid.dataset.initPosts) : 6;
  const filterBtns = document.querySelectorAll(".blog-filter-btn");
  const postItems = document.querySelectorAll(".blog-post-item");
  const searchInput = document.getElementById("blog-search");
  const loadMoreBtn = document.getElementById("load-more-btn");

  function reapplyHidden() {
    const activeCatBtn = document.querySelector(".blog-filter-btn.active");
    const activeCat = activeCatBtn ? activeCatBtn.dataset.category : "all";
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    if (activeCat === "all" && !query) {
      postItems.forEach(function (item) {
        const idx = parseInt(item.dataset.postIndex);
        if (idx >= INITIAL_POSTS && item.classList.contains("hidden")) {
          item.style.display = "none";
        } else {
          item.style.display = "";
        }
      });
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      const hiddenItems = document.querySelectorAll(".blog-post-item.hidden");
      const toShow = Math.min(hiddenItems.length, INITIAL_POSTS);
      const activeCatBtn = document.querySelector(".blog-filter-btn.active");
      const activeCat = activeCatBtn ? activeCatBtn.dataset.category : "all";
      const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

      for (let j = 0; j < toShow; j++) {
        hiddenItems[j].classList.remove("hidden");
        const matchesFilter = activeCat === "all" || hiddenItems[j].dataset.category === activeCat;
        let matchesSearch = true;
        if (searchQuery) {
          const title = (
            (hiddenItems[j].querySelector("h3") &&
              hiddenItems[j].querySelector("h3").textContent) ||
            ""
          ).toLowerCase();
          const desc = (
            (hiddenItems[j].querySelector("p") &&
              hiddenItems[j].querySelector("p").textContent) ||
            ""
          ).toLowerCase();
          matchesSearch = title.indexOf(searchQuery) !== -1 || desc.indexOf(searchQuery) !== -1;
        }
        hiddenItems[j].style.display = matchesFilter && matchesSearch ? "" : "none";
      }

      if (document.querySelectorAll(".blog-post-item.hidden").length === 0) {
        loadMoreBtn.remove();
      }
    });
  }

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const category = this.dataset.category;

        filterBtns.forEach(function (b) {
          b.classList.remove("active", "bg-brand-600", "text-white");
          b.classList.add("bg-surface-800", "text-surface-400", "border", "border-surface-700");
        });
        this.classList.add("active", "bg-brand-600", "text-white");
        this.classList.remove("bg-surface-800", "text-surface-400", "border", "border-surface-700");

        postItems.forEach(function (item) {
          if (category === "all" || item.dataset.category === category) {
            item.style.display = "";
            item.style.animation = "blogFadeIn 0.4s ease forwards";
          } else {
            item.style.display = "none";
          }
        });

        if (category === "all") {
          reapplyHidden();
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      postItems.forEach(function (item) {
        const title = (
          (item.querySelector("h3") && item.querySelector("h3").textContent) ||
          ""
        ).toLowerCase();
        const desc = (
          (item.querySelector("p") && item.querySelector("p").textContent) ||
          ""
        ).toLowerCase();
        if (!query || title.indexOf(query) !== -1 || desc.indexOf(query) !== -1) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      if (!query) {
        reapplyHidden();
      }
    });
  }
});
