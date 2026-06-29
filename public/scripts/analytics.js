/**
 * GA4 Event Tracking
 * Fires gtag events when elements with data-track attributes are clicked.
 *
 * Usage: <a data-track="whatsapp_click" data-track-label="Hero CTA" ...>
 *
 * Events are sent to Google Analytics 4 via the existing gtag implementation.
 */
(function () {
  'use strict';

  // Wait for gtag to be available (GA loads async in BaseLayout)
  function waitForGtag(retries) {
    if (retries <= 0) return;
    if (typeof gtag === 'function') {
      init();
    } else {
      setTimeout(function () { waitForGtag(retries - 1); }, 300);
    }
  }

  function init() {
    // Track clicks on elements with data-track attributes
    document.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== document.documentElement) {
        var eventName = target.getAttribute('data-track');
        if (eventName) {
          var eventLabel = target.getAttribute('data-track-label') || '';
          var eventValue = target.getAttribute('data-track-value') || '';

          var params = {
            event_category: target.getAttribute('data-track-category') || 'engagement',
            event_label: eventLabel,
            value: eventValue || undefined,
            page_location: window.location.href,
            page_language: document.documentElement.lang || 'en',
          };

          try {
            gtag('event', eventName, params);
          } catch (err) {
            // Silently fail
          }
          break;
        }
        target = target.parentElement;
      }
    });

    // Track outbound link clicks automatically
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      if (link.hasAttribute('data-track')) return;
      var href = link.getAttribute('href') || '';
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        try { gtag('event', 'outbound_click', { event_category: 'outbound', event_label: href }); }
        catch (err) {}
      }
    });

    // Fallback: track wa.me links without data-track
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      if (link.hasAttribute('data-track')) return;
      var href = link.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        try { gtag('event', 'whatsapp_click', { event_category: 'conversion', event_label: 'Unlabeled WhatsApp' }); }
        catch (err) {}
      }
    });
  }

  waitForGtag(30); // ~9s window — GA script is now deferred to idle, so gtag loads later
})();
