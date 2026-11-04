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
    var dark = isDark();
    themeBtn.textContent = dark ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("khatt-theme", next);
      } catch (e) {
        /* ignore */
      }
      paintThemeBtn();
    });
  }

  // ── Mobile menu
  var menuBtn = document.getElementById("menu");
  var links = document.getElementById("links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ── Hero phone tilts toward the pointer
  var tilt = document.querySelector("[data-tilt]");
  if (tilt && !reduce && window.matchMedia("(hover: hover)").matches) {
    var stage = tilt.closest(".stage") || tilt.parentElement;
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "rotate(" + (4 - x * 10).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 10).toFixed(2) + "deg)";
    });
    stage.addEventListener("pointerleave", function () {
      tilt.style.transform = "";
    });
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
