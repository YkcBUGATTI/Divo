/* ========================================
   Bugatti Divo — Main JS
   ======================================== */

(function () {
  'use strict';

  /* --- Language Detection --- */
  function detectLang() {
    var stored = localStorage.getItem('divo-lang');
    if (stored) return stored;
    // file:// preview — no redirect
    if (location.protocol === 'file:') return 'zh';
    // Dual API fallback
    return fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (d) { return d.country_code === 'CN' ? 'zh' : 'en'; })
      .catch(function () {
        return fetch('https://ipwho.is/')
          .then(function (r) { return r.json(); })
          .then(function (d) { return d.country === 'CN' ? 'zh' : 'en'; })
          .catch(function () { return 'zh'; });
      });
  }

  function applyLang(lang) {
    var isEn = location.pathname.endsWith('en.html');
    var currentIsEn = isEn;
    var shouldRedirect = lang === 'en' && !currentIsEn;
    var shouldRedirectZh = lang === 'zh' && currentIsEn;
    // Don't redirect in file:// mode
    if (location.protocol === 'file:') return;
    if (shouldRedirect) location.href = 'en.html';
    else if (shouldRedirectZh) location.href = 'index.html';
  }

  // Init language
  detectLang().then(function (lang) {
    applyLang(lang);
  });

  /* --- Scroll Reveal (IntersectionObserver) --- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* --- Number Counter Animation --- */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          runCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { obs.observe(el); });
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (el.getAttribute('data-decimals') || '0') | 0;
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --- Performance Bars --- */
  function initPerfBars() {
    var bars = document.querySelectorAll('.perf-bar-fill');
    if (!bars.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var target = e.target.getAttribute('data-width');
          e.target.style.width = target + '%';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (el) { obs.observe(el); });
  }

  /* --- Spec Tabs --- */
  function initSpecTabs() {
    var tabs = document.querySelectorAll('.spec-tab');
    var panels = document.querySelectorAll('.spec-panel');
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-panel');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        var panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* --- Parallax on Hero --- */
  function initHeroParallax() {
    var heroImg = document.querySelector('.hero-bg img');
    if (!heroImg) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrolled = window.pageYOffset;
          if (scrolled < window.innerHeight) {
            heroImg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px) scale(1.1)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* --- Init on DOM Ready --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    initReveal();
    animateCounters();
    initPerfBars();
    initSpecTabs();
    initHeroParallax();
  }
})();
