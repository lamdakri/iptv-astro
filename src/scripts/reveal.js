// ============================================
//  SCROLL-TRIGGERED REVEAL ANIMATIONS
//  Uses IntersectionObserver for performance
// ============================================

(function () {
  const revealed = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !revealed.has(entry.target)) {
          revealed.add(entry.target);

          const delay = parseInt(entry.target.dataset.revealDelay) || 0;

          if (delay > 0) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          } else {
            entry.target.classList.add('visible');
          }

          // Keep observing in case element leaves and re-enters viewport
          // Comment out the line below if you want re-triggering on scroll-back
          // observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // viewport
      rootMargin: '0px 0px -60px 0px', // trigger 60px before element enters
      threshold: 0.1, // trigger when 10% of element is visible
    }
  );

  function observeAll() {
    const targets = document.querySelectorAll('.reveal');
    targets.forEach((el) => observer.observe(el));
  }

  // Initial observation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAll);
  } else {
    observeAll();
  }

  // Re-observe after Astro page transitions (SPA navigation)
  document.addEventListener('astro:page-load', observeAll);

  // Expose for manual use
  window.__revealObserve = observeAll;
})();
