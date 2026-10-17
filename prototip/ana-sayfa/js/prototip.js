(function () {
  "use strict";

  var data = window.OM || {};
  var ATLAS_CENTER = data.center || [40.09, 26.32];
  var ATLAS_ZOOM = data.defaultZoom || 11;
  var atlasMap = null;
  var selectedMarker = null;
  var OSM_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var ESRI_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  function motionOn() {
    return !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function bindNav() {
    var toggle = document.getElementById("nav-toggle");
    var panel = document.getElementById("nav-panel");
    if (!toggle || !panel) return;
    panel.setAttribute("data-enhanced", "true");
    toggle.hidden = false;
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function showMapError(host, message) {
    var box = document.createElement("div");
    box.className = "map-fallback";
    box.setAttribute("role", "alert");
    var p = document.createElement("p");
    p.textContent = message;
    box.appendChild(p);
    var retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Yeniden dene";
    retry.addEventListener("click", function () { window.location.reload(); });
    box.appendChild(retry);
    host.appendChild(box);
    document.getElementById("map-status").textContent = "Harita kullanılamıyor. Kronoloji ve olay bağlantıları kullanılabilir.";
  }

  function bootMap() {
    var host = document.getElementById("prototip-harita");
    if (!host) return;
    if (typeof L === "undefined" || !L.map) {
      showMapError(host, "Harita kütüphanesi yüklenemedi.");
      return;
    }
    try {
      var map = L.map("prototip-harita", {
        zoomControl: true,
        attributionControl: true,
        minZoom: 8,
        maxZoom: 16,
        scrollWheelZoom: false,
        zoomAnimation: motionOn(),
        fadeAnimation: motionOn()
      }).setView(ATLAS_CENTER, ATLAS_ZOOM);
      atlasMap = map;
      var reset = document.getElementById("map-reset");
      reset.disabled = false;
      reset.addEventListener("click", function () {
        map.setView(ATLAS_CENTER, ATLAS_ZOOM, { animate: motionOn() });
      });
      document.getElementById("map-status").textContent = "Konumunu görmek için kronolojiden bir olay seçin.";
      var uydu = L.tileLayer(ESRI_URL, { attribution: "Görüntü © Esri", maxZoom: 16 });
      var yol = L.tileLayer(OSM_URL, {
        attribution: "&copy; OpenStreetMap katkıda bulunanlar",
        subdomains: "abc",
        maxZoom: 16
      });
      function watchTiles(layer) {
        layer.on("tileerror", function () {
          document.getElementById("map-status").textContent = "Bazı harita görselleri yüklenemedi. Katman menüsünden diğer haritayı deneyin; kronoloji kullanılabilir.";
        });
      }
      watchTiles(uydu);
      watchTiles(yol);
      uydu.addTo(map);
      L.control.layers({ Uydu: uydu, "Yol haritası": yol }, null, { position: "bottomright" }).addTo(map);
      window.setTimeout(function () {
        if (map.invalidateSize) map.invalidateSize();
      }, motionOn() ? 80 : 0);
    } catch (err) {
      if (atlasMap) atlasMap.remove();
      atlasMap = null;
      document.getElementById("map-reset").disabled = true;
      showMapError(host, "Harita açılamadı.");
    }
  }

  function slugify(value) {
    var replacements = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u", "é": "e", "è": "e", "ê": "e", "á": "a", "à": "a", "ô": "o", "ó": "o", "ú": "u", "ñ": "n" };
    return String(value).toLocaleLowerCase("tr").replace(/[çğıöşüâîûéèêáàôóúñ]/g, function (ch) {
      return replacements[ch];
    }).replace(/['’´`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function normalized(value) {
    return String(value).toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");
  }

  function bootChronology() {
    var events = ((data.campaign || {}).events || []).filter(function (ev) {
      return !ev.quiet && ev.id !== "e-nisan2627";
    });
    if (!events.length) return;
    var places = (data.places || []).concat((data.campaign || {}).places || []);
    var list = document.getElementById("prototype-events");
    var search = document.getElementById("event-search");
    var domain = "all";
    var selectedId = null;
    var buttons = [];
    document.getElementById("chrono-tools").hidden = false;
    document.getElementById("chrono-fallback").hidden = true;

    function selectEvent(ev) {
      selectedId = ev.id;
      document.getElementById("detail-return").hidden = false;
      buttons.forEach(function (entry) {
        entry.button.setAttribute("aria-pressed", entry.event.id === selectedId ? "true" : "false");
      });
      document.getElementById("detail-title").textContent = ev.title;
      document.getElementById("detail-date").textContent = ev.date;
      document.getElementById("detail-status").textContent = "Mevcut atlas kaydı · Belge düzeyinde doğrulama tamamlanmadı. Ayrıntılar ve kaynak çerçevesi olay sayfasındadır.";
      var link = document.getElementById("detail-page");
      link.href = "../../olaylar/" + slugify(ev.title) + "/index.html";
      link.hidden = false;
      document.getElementById("detail-title").focus();
      var place = places.find(function (item) { return item.id === ev.place; });
      var hasPosition = place && Number.isFinite(place.lat) && Number.isFinite(place.lng);
      var mapLink = document.getElementById("detail-map");
      mapLink.hidden = !hasPosition || !atlasMap;
      if (atlasMap && selectedMarker) {
        atlasMap.removeLayer(selectedMarker);
        selectedMarker = null;
      }
      if (!atlasMap) return;
      if (!hasPosition) {
        document.getElementById("map-status").textContent = "Bu kayıt için mevcut atlas konumu bulunmuyor. Yeni konum üretilmedi.";
        return;
      }
      var label = document.createElement("span");
      label.textContent = place.name + " · Yaklaşık konum";
      selectedMarker = L.circleMarker([place.lat, place.lng], {
        radius: 10, color: "#F6F0E5", weight: 2, fillColor: "#C5A06C", fillOpacity: 0.9
      }).addTo(atlasMap).bindPopup(label);
      atlasMap.setView([place.lat, place.lng], ATLAS_ZOOM, { animate: motionOn() });
      document.getElementById("map-status").textContent = ev.title + " · " + place.name + " · Yaklaşık konum";
    }

    events.forEach(function (ev) {
      var item = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-controls", "event-detail");
      var date = document.createElement("span");
      date.className = "event-date";
      date.textContent = ev.date;
      var title = document.createElement("strong");
      title.textContent = ev.title;
      button.appendChild(date);
      button.appendChild(title);
      button.addEventListener("click", function () { selectEvent(ev); });
      item.appendChild(button);
      list.appendChild(item);
      buttons.push({ event: ev, button: button, item: item });
    });

    function filterEvents() {
      var term = normalized(search.value.trim());
      var count = 0;
      buttons.forEach(function (entry) {
        var visible = (domain === "all" || entry.event.domain === domain) &&
          normalized(entry.event.title + " " + entry.event.date).includes(term);
        entry.item.hidden = !visible;
        if (visible) count++;
      });
      document.getElementById("event-count").textContent = count ? count + " olay gösteriliyor." : "Eşleşen olay bulunamadı. Aramayı veya süzgeci değiştirin.";
    }
    search.addEventListener("input", filterEvents);
    var filters = document.querySelectorAll("[data-domain]");
    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        domain = button.getAttribute("data-domain");
        filters.forEach(function (filter) {
          filter.setAttribute("aria-pressed", filter === button ? "true" : "false");
        });
        filterEvents();
      });
    });
    filterEvents();
  }

  bindNav();
  bootMap();
  bootChronology();
})();
