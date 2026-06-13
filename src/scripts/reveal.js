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

  // ============================================
  //  STAT COUNTER ANIMATION
  //  Counts up from 0 to target when element enters viewport
  // ============================================

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          if (isNaN(target)) return;

          const isPercentage = el.textContent.includes('%');
          const hasPlus = el.textContent.includes('K+');
          const hasSlash = el.textContent.includes('/');
          const duration = 1500;
          const startTime = performance.now();

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            if (isPercentage) {
              el.textContent = current + '%';
            } else if (hasPlus) {
              // For large numbers like 20000 -> show as 20K+
              if (target >= 1000) {
                el.textContent = Math.round((eased * target) / 1000) + 'K+';
              } else {
                el.textContent = current + '+';
              }
            } else if (hasSlash) {
              el.textContent = current + '/7';
            } else {
              el.textContent = current + (target === 4 ? 'K' : '');
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              // Final value
              el.textContent = el.dataset.count + (isPercentage ? '%' : hasPlus ? 'K+' : target === 4 ? 'K' : hasSlash ? '/7' : '');
            }
          }

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.5 }
  );

  function observeCounters() {
    document.querySelectorAll('[data-count]').forEach(function(el) {
      counterObserver.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeCounters);
  } else {
    observeCounters();
  }
  document.addEventListener('astro:page-load', observeCounters);

  // Expose for manual use
  window.__revealObserve = observeAll;
})();
