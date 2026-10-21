(function () {
  "use strict";
  function atlasReturnUrl(value) {
    if (!value || value.length > 1000 || value.indexOf("/?") !== 0) return "";
    try {
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/" || url.hash !== "#harita") return "";
      var allowed = ["olay", "mevki", "dakika", "deniz"];
      var keys = Array.from(url.searchParams.keys());
      if (keys.some(function (key) { return allowed.indexOf(key) === -1 || url.searchParams.getAll(key).length !== 1; })) return "";
      var event = keys.length === 1 && (keys[0] === "olay" || keys[0] === "mevki");
      var naval = keys.indexOf("dakika") !== -1 && keys.every(function (key) { return key === "dakika" || key === "deniz"; }) && /^\d{1,4}$/.test(url.searchParams.get("dakika"));
      if ((!event && !naval) || keys.some(function (key) { return !url.searchParams.get(key).trim(); })) return "";
      return url.pathname + url.search + url.hash;
    } catch (error) { return ""; }
  }
  function eventListReturnUrl(value) {
    if (!value || value.length > 1000 || value.indexOf('/olaylar/') !== 0) return '';
    try {
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== '/olaylar/' || url.hash !== '#events-tools') return '';
      var keys = Array.from(url.searchParams.keys());
      if (keys.some(function (key) { return ['q', 'bolum'].indexOf(key) === -1 || url.searchParams.getAll(key).length !== 1; })) return '';
      if (url.searchParams.has('bolum') && ['deniz', 'kara', 'tahliye'].indexOf(url.searchParams.get('bolum')) === -1) return '';
      return url.pathname + url.search + url.hash;
    } catch (error) { return ''; }
  }
  function commandersReturnUrl(value) {
    if (!value || value.length > 4000 || value.indexOf('/komutanlar/') !== 0) return '';
    try {
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== '/komutanlar/' || url.hash !== '#commanders-search') return '';
      var keys = Array.from(url.searchParams.keys());
      if (keys.some(function (key) { return ['q', 'taraf'].indexOf(key) === -1 || url.searchParams.getAll(key).length !== 1; })) return '';
      if (url.searchParams.has('q') && url.searchParams.get('q').length > 200) return '';
      if (url.searchParams.has('taraf') && ['osmanli', 'itilaf'].indexOf(url.searchParams.get('taraf')) === -1) return '';
      return url.pathname + url.search + url.hash;
    } catch (error) { return ''; }
  }
  function eventReturnUrl(value) {
    if (!value || value.length > 8000 || value.indexOf('/olaylar/') !== 0) return '';
    try {
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin || !/^\/olaylar\/[a-z0-9-]+\/$/.test(url.pathname)) return '';
      if (url.hash && !/^#[a-z0-9-]+$/.test(url.hash)) return '';
      var keys = Array.from(url.searchParams.keys());
      if (keys.some(function (key) { return ['listeyeDon', 'atlasaDon'].indexOf(key) === -1 || url.searchParams.getAll(key).length !== 1; })) return '';
      if (url.searchParams.has('listeyeDon') && !eventListReturnUrl(url.searchParams.get('listeyeDon'))) return '';
      if (url.searchParams.has('atlasaDon') && !atlasReturnUrl(url.searchParams.get('atlasaDon'))) return '';
      return url.pathname + url.search + url.hash;
    } catch (error) { return ''; }
  }
  var eventReturn = window.location && window.location.search ? eventReturnUrl(new URLSearchParams(window.location.search).get('olayaDon')) : '';
  if (eventReturn) {
    var backToList = document.querySelector('.back-link');
    if (backToList && !document.getElementById('event-context-return')) {
      var backToEvent = document.createElement('p');
      backToEvent.id = 'event-context-return';
      var eventLink = document.createElement('a');
      eventLink.className = 'btn';
      eventLink.href = eventReturn;
      eventLink.textContent = 'Okuduğunuz olaya dön';
      backToEvent.appendChild(eventLink);
      backToList.parentNode.insertBefore(backToEvent, backToList);
    }
  }
  var commandersReturn = window.location && window.location.search ? commandersReturnUrl(new URLSearchParams(window.location.search).get('komutanlaraDon')) : '';
  if (commandersReturn) {
    document.querySelectorAll('.back-link a[href^="/komutanlar/"]').forEach(function (link) {
      link.href = commandersReturn;
      link.textContent = 'Komutan aramasına dön';
    });
  }
  var listReturn = window.location && window.location.search ? eventListReturnUrl(new URLSearchParams(window.location.search).get('listeyeDon')) : '';
  if (listReturn) {
    document.querySelectorAll('.event-actions a[href^="/olaylar/"], .back-link a[href^="/olaylar/"], .event-all-records a').forEach(function (link) {
      link.href = listReturn;
      link.textContent = 'Arama sonuçlarına dön';
    });
  }
  var returnUrl = "";
  if (window.location && window.location.search && typeof URLSearchParams !== "undefined") {
    returnUrl = atlasReturnUrl(new URLSearchParams(window.location.search).get("atlasaDon"));
  }
  if (returnUrl) {
    document.querySelectorAll(".event-map-action").forEach(function (link) {
      link.href = returnUrl;
      link.textContent = "Seçili kayda dön";
    });
  }
  if (listReturn || returnUrl) {
    document.querySelectorAll('.page-main a[href]').forEach(function (link) {
      try {
        var current = new URL(window.location.href);
        var url = new URL(link.href, current.href);
        if (url.origin !== current.origin || !/^\/olaylar\/[^/]+\/$/.test(url.pathname) ||
            (url.pathname === current.pathname && url.search === current.search)) return;
        if (listReturn) url.searchParams.set('listeyeDon', listReturn);
        if (returnUrl) url.searchParams.set('atlasaDon', returnUrl);
        link.href = url.pathname + url.search + url.hash;
      } catch (error) { /* Invalid editorial links must not interrupt navigation. */ }
    });
  }
  if (window.location && window.location.href) {
    try {
      var currentEvent = new URL(window.location.href);
      if (/^\/olaylar\/[a-z0-9-]+\/$/.test(currentEvent.pathname)) {
        var eventContext = new URL(currentEvent.pathname, currentEvent.origin);
        if (listReturn) eventContext.searchParams.set('listeyeDon', listReturn);
        if (returnUrl) eventContext.searchParams.set('atlasaDon', returnUrl);
        eventContext.hash = currentEvent.hash;
        var eventBackHref = eventReturnUrl(eventContext.pathname + eventContext.search + eventContext.hash);
        if (eventBackHref) document.querySelectorAll('.page-main a[href^="/komutanlar/"]').forEach(function (link) {
          var destination = new URL(link.href, currentEvent.href);
          if (destination.origin !== currentEvent.origin || !/^\/komutanlar\/[a-z0-9-]+\/$/.test(destination.pathname)) return;
          destination.searchParams.set('olayaDon', eventBackHref);
          link.href = destination.pathname + destination.search + destination.hash;
        });
      }
    } catch (error) { /* Keep normal links if a reading context cannot be formed. */ }
  }
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
