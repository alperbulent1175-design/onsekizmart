(function () {
  "use strict";
  var button = document.getElementById("nav-toggle");
  var panel = document.getElementById("nav-panel");
  if (!button || !panel) return;
  function close(restoreFocus) {
    panel.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    if (restoreFocus) button.focus();
  }
  button.addEventListener("click", function () {
    var open = panel.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
  panel.addEventListener("click", function (event) {
    if (event.target.closest("a")) close(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.classList.contains("is-open")) {
      close(true);
    }
  });
  document.addEventListener("click", function (event) {
    if (panel.classList.contains("is-open") && !panel.contains(event.target) && !button.contains(event.target)) {
      close(panel.contains(document.activeElement));
    }
  });
  var mobile = window.matchMedia("(max-width: 860px)");
  mobile.addEventListener("change", function () { close(mobile.matches && panel.contains(document.activeElement)); });
  panel.setAttribute("data-enhanced", "true");
  button.hidden = false;
})();
