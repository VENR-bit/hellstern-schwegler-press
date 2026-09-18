(function () {
  "use strict";

  var KEY = "hsp-theme";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  // The reader's explicit choice wins; otherwise follow the system.
  function effective() {
    var t = stored();
    return (t === "dark" || t === "light") ? t : (mq.matches ? "dark" : "light");
  }

  function paintButtons() {
    var next = effective() === "dark" ? "light" : "dark";
    var label = next === "dark" ? "Switch to dark theme" : "Switch to light theme";
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", label);
      buttons[i].setAttribute("title", label);
    }
  }

  function choose(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    paintButtons();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("[data-theme-toggle]");
    if (!button) return;
    choose(effective() === "dark" ? "light" : "dark");
  });

  // No stored choice means the page keeps tracking the system setting live.
  var onSystemChange = function () { if (!stored()) paintButtons(); };
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange);

  paintButtons();
})();
