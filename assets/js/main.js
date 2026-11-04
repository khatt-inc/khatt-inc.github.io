(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Theme toggle (the only thing ever stored: your light/dark choice, locally)
  var themeBtn = document.getElementById("theme");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paintThemeBtn() {
    if (!themeBtn) return;
    themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      // brief class so every colour eases to the new palette instead of snapping
      root.classList.add("theming");
      window.setTimeout(function () { root.classList.remove("theming"); }, 500);
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("khatt-theme", next);
      } catch (e) {
        /* ignore */
      }
      paintThemeBtn();
    });
  }

  // ── Mobile menu: slides down, closes on link, Escape or a tap outside
  var menuBtn = document.getElementById("menu");
  var links = document.getElementById("links");
  function setMenu(open) {
    if (!menuBtn || !links) return;
    links.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      setMenu(!links.classList.contains("open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (links.classList.contains("open") && !links.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  // ── Links to the page you are already on scroll smoothly instead of reloading
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download") || a.classList.contains("skip")) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    var behavior = reduce ? "auto" : "smooth";
    if (url.hash && url.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: behavior, block: "start" });
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: behavior });
    }
  });

  // Legal pages: headings and the summary reveal as you read (added here so the policy text stays untouched)
  document.querySelectorAll(".doc h2, .doc .summary, .foot-ar").forEach(function (el) {
    el.classList.add("reveal");
  });

  // ── Scroll reveal
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "250px 0px 250px 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
      var rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        el.classList.add("in");
      }
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ── Header gains a background once the page scrolls
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ── The Line: figures and the hero swash draw themselves once in view
  // (SVG is driven by attributes and classes only, so the strict CSP holds)
  var figs = document.querySelectorAll(".fig");
  var swash = document.querySelector(".swash");
  if (swash) swash.classList.add("drawn");
  if ("IntersectionObserver" in window && !reduce) {
    var drawIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("drawn");
            drawIo.unobserve(en.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    figs.forEach(function (f) { drawIo.observe(f); });
  } else {
    figs.forEach(function (f) { f.classList.add("drawn"); });
  }

  // ── The Line: the spine fills as you read; nodes light up as you pass them
  var fill = document.querySelector(".spine-fill");
  var trail = document.querySelector(".trail");
  var nodes = document.querySelectorAll(".node");
  if (fill && trail) {
    if (reduce) {
      fill.setAttribute("stroke-dashoffset", "0");
      trail.style.setProperty("--prog", "1");
      nodes.forEach(function (n) { n.classList.add("on"); });
    } else {
      var queued = false;
      var paintSpine = function () {
        queued = false;
        var vh = window.innerHeight;
        var box = trail.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (vh * 0.6 - box.top) / box.height));
        fill.setAttribute("stroke-dashoffset", String(1 - p));
        trail.style.setProperty("--prog", p.toFixed(4));
        nodes.forEach(function (n) {
          n.classList.toggle("on", n.getBoundingClientRect().top < vh * 0.6);
        });
      };
      var queueSpine = function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(paintSpine);
      };
      paintSpine();
      window.addEventListener("scroll", queueSpine, { passive: true });
      window.addEventListener("resize", queueSpine);
    }
  }

  // ── The seal is stamped once the line reaches it
  var seal = document.querySelector(".seal");
  if (seal) {
    if ("IntersectionObserver" in window && !reduce) {
      var sealIo = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            seal.classList.add("stamped");
            sealIo.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      sealIo.observe(seal);
    } else {
      seal.classList.add("stamped");
    }
  }

  // ── Table of contents highlights the section being read
  var toc = document.querySelectorAll(".toc a");
  if (toc.length && "IntersectionObserver" in window) {
    var map = {};
    toc.forEach(function (a) {
      map[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            toc.forEach(function (a) {
              a.classList.remove("on");
            });
            var a = map[en.target.id];
            if (a) a.classList.add("on");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.keys(map).forEach(function (id) {
      var h = document.getElementById(id);
      if (h) spy.observe(h);
    });
  }

  // ── Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
