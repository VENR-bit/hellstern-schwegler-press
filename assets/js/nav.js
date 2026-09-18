(function () {
  "use strict";

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  // Above this width the links sit inline again and the panel rules don't apply.
  var wide = window.matchMedia("(min-width: 46rem)");

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) nav.removeAttribute("data-collapsed");
    else nav.setAttribute("data-collapsed", "");
  }

  setOpen(false);

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  // following a link should close the panel behind you
  nav.addEventListener("click", function (event) {
    if (event.target.closest && event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (!isOpen()) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // widening the window puts the links back inline; don't leave a stale open state
  var sync = function () { if (wide.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener("change", sync);
  else if (wide.addListener) wide.addListener(sync);
})();
