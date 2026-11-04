// Runs before first paint so the page never flashes the wrong theme.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var saved = localStorage.getItem("khatt-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {
    /* storage blocked: follow the system theme */
  }
})();
