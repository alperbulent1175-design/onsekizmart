(function () {
  "use strict";
  var D = window.OM;
  if (!D) return;
  var Model = window.OMModel;
  var panelRevision = 0;

  function annotateAll() {
    if (!Model) return;
    (D.places || []).forEach(Model.annotate);
    (D.lines || []).forEach(function (ln) {
      ln.schematic = true;
      Model.annotate(ln);
    });
    (D.mineLines || []).forEach(function (ln) {
      ln.schematic = true;
      Model.annotate(ln);
    });
    if (D.campaign) {
      (D.campaign.places || []).forEach(Model.annotate);
      (D.campaign.events || []).forEach(Model.annotate);
    }
  }
  annotateAll();

  function accuracyText(item) {
    var kind = item.accuracy === "sema" ? "Şematik gösterim" : "Yaklaşık konum";
    return kind + ". " + (item.uncertainty || "Kesin koordinat değildir.");
  }

  function showMapLine(line, transverse, returnTarget) {
    stopPlay();
    revealDock();
    activeId = null;
    var mine = transverse || line.type === "mayin";
    var review = mine && D.mineReview;
    fillPanel({
      title: line.name,
      kind: "line",
      meta: mine ? "Mayın savunması · şematik çizgi" : "Filo / manevra · şematik çizgi",
      text: transverse
        ? "Bu numara atlas çiziminin sırasıdır; tarihî hat numarası olarak doğrulanmadı. Uç noktalar ve hat aralıkları için sayısal kaynak eşleştirmesi tamamlanmadı."
        : line.note || "",
      accuracy: "Şematik gösterim. Çizgi köşeleri mayın veya gemi koordinatı değildir; ölçülmüş bir hata sınırı yoktur.",
      source: review ? "İnceleme: " + review.date + ". Anlatı incelendi; çizgi geometrisi doğrulanmadı. " + review.limit : "Çizgi geometrisinin sayısal kaynakla eşleştirilmesi tamamlanmadı.",
      sourceUrl: review ? review.url : "",
      sourceLabel: review ? review.label : "",
      reviewHref: "/nasil-okunur/#konum-denetimi"
    });
    paintIcons();
    focusSelectedPanel(returnTarget || null);
  }

  function bindMapLine(layer, line, transverse) {
    function labelLine() {
      var element = layer.getElement();
      if (!element) return;
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute("aria-label", line.name + " · şematik gösterim");
      element.onkeydown = function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat) showMapLine(line, transverse, element);
      };
    }
    layer.on("add", labelLine);
    labelLine();
    layer.on("click", function () { showMapLine(line, transverse, layer.getElement()); });
  }

  function sourceText(item) {
    var ids = (item && item.sourceIds) || [];
    var names = ids.map(function (id) {
      var src = Model && Model.byId(id);
      return src ? src.institution : id;
    }).filter(Boolean);
    var who = names.length ? names.join(", ") : "Kurum çerçevesi";
    var homeOnly = ids.some(function (id) {
      var src = Model && Model.byId(id);
      return src && src.claimSupport === false;
    });
    var frame = homeOnly ? " Kurum ana sayfası, tek bir iddiayı belgeleyen kayıt değildir." : "";
    if (item && item.verification === "sayfa") return "Kaynak: " + who + ".";
    return "Kaynak: " + who + ". Sayfa ve belge numarası yok; doğrulanmış işaretlenmez." + frame;
  }

  function motionOn() {
    return !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function foldTr(value) {
    var s = String(value == null ? "" : value);
    s = s.replace(/İ/g, "i").replace(/I/g, "ı");
    s = s.toLocaleLowerCase("tr");
    s = s.replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ç/g, "c").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ı/g, "i");
    return s;
  }

  function textEl(tag, text, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text == null ? "" : String(text);
    return node;
  }

  function localHref(url) {
    var safe = Model && Model.safeUrl ? Model.safeUrl(url) : "";
    if (!safe || safe.charAt(0) !== "/") return "";
    return safe;
  }

  function fillCells(row, values) {
    values.forEach(function (value) {
      row.appendChild(textEl("td", value));
    });
  }

  function applyDateLayers(next) {
    var box = document.getElementById("layers");
    var group = groups.kampanya;
    if (!map || !box || !group) return;
    var btn = box.querySelector('[data-layer="kampanya"]');
    var show = next === "camp";
    if (show) {
      if (!map.hasLayer(group)) group.addTo(map);
      if (btn) btn.setAttribute("aria-pressed", "true");
    } else if (map.hasLayer(group)) {
      map.removeLayer(group);
      if (btn) btn.setAttribute("aria-pressed", "false");
    } else if (btn) {
      btn.setAttribute("aria-pressed", "false");
    }
  }

  function renderSelectedDay() {
    var section = document.getElementById("secilmis");
    var body = document.getElementById("day-body");
    var empty = document.getElementById("day-empty");
    var links = document.getElementById("day-links");
    if (!section || !body || !Model || !D.campaign) return;
    var date = section.getAttribute("data-date");
    var state = Model.dayMessage(D.campaign.events, date);
    links.innerHTML = "";
    if (state.status !== "olay") {
      body.textContent = "";
      empty.hidden = false;
      empty.textContent = state.text;
      return;
    }
    var ev = state.events[0];
    empty.hidden = true;
    empty.textContent = "";
    var p = document.createElement("p");
    p.textContent = ev.text;
    var note = document.createElement("p");
    note.textContent = sourceText(ev);
    body.innerHTML = "";
    body.appendChild(p);
    body.appendChild(note);
    var href = eventPageHref(ev);
    var slug = href ? href.split("/").filter(Boolean).pop() : ev.id;
    var mapLink = document.createElement("a");
    mapLink.href = "/?olay=" + encodeURIComponent(slug) + "#harita";
    mapLink.appendChild(textEl("span", "Harita"));
    mapLink.appendChild(textEl("strong", ev.date));
    mapLink.appendChild(textEl("em", ev.title));
    links.appendChild(mapLink);
    if (localHref(href)) {
      var page = document.createElement("a");
      page.href = localHref(href);
      page.appendChild(textEl("span", "Olay"));
      page.appendChild(textEl("strong", ev.title));
      page.appendChild(textEl("em", "Olay sayfası"));
      links.appendChild(page);
    }
  }

  var map = null;
  var tiles = null;
  var groups = {};
  var markers = {};
  var tileWarned = false;
  var tileNote = null;

  function clearTileWarning() {
    var restoreFocus = tileNote && tileNote.contains && tileNote.contains(document.activeElement);
    tileWarned = false;
    if (tileNote && tileNote.parentNode) tileNote.parentNode.removeChild(tileNote);
    tileNote = null;
    if (restoreFocus) {
      var reset = document.getElementById("map-reset");
      if (reset && !reset.disabled) reset.focus();
    }
  }

  function watchTiles(layer) {
    var failed = false;
    layer.on("loading", function () { failed = false; });
    layer.on("tileerror", function () {
      failed = true;
      if (map && map.hasLayer(layer)) noteTileFailure();
    });
    layer.on("load", function () {
      if (!failed && map && map.hasLayer(layer)) clearTileWarning();
    });
  }

  function showMapError(message) {
    var host = document.getElementById("map");
    if (!host) return;
    host.setAttribute("role", "region");
    host.setAttribute("aria-label", "Harita kullanılamıyor; kronoloji ve olay listesi kullanılabilir.");
    var box = document.createElement("div");
    box.className = "map-fallback";
    box.setAttribute("role", "alert");
    box.appendChild(textEl("p", message + " Kronoloji ve olay listesi kullanılabilir."));
    var jump = document.createElement("p");
    var toChron = document.createElement("a");
    toChron.href = "#kronoloji";
    toChron.textContent = "Kronolojiye geç";
    var toEvents = document.createElement("a");
    toEvents.href = "/olaylar/";
    toEvents.textContent = "Olay listesi";
    jump.appendChild(toChron);
    jump.appendChild(document.createTextNode(" · "));
    jump.appendChild(toEvents);
    var toSources = document.createElement("a");
    toSources.href = "/kaynakca/";
    toSources.textContent = "Kaynakça";
    jump.appendChild(document.createTextNode(" · "));
    jump.appendChild(toSources);
    box.appendChild(jump);
    var retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn";
    retry.textContent = "Yeniden dene";
    retry.addEventListener("click", function () { window.location.reload(); });
    box.appendChild(retry);
    if (host.replaceChildren) host.replaceChildren(box);
    else host.appendChild(box);
  }

  function noteTileFailure() {
    if (tileWarned) return;
    tileWarned = true;
    var frame = document.querySelector(".map-frame") || document.getElementById("map");
    if (!frame) return;
    var note = document.createElement("p");
    tileNote = note;
    note.className = "map-tile-note";
    note.setAttribute("role", "status");
    note.appendChild(document.createTextNode("Bazı harita karoları yüklenemedi. İşaretler ve kronoloji kullanılabilir. "));
    var retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Karoları yeniden dene";
    retry.addEventListener("click", function () {
      if (!tiles || !map) return;
      Object.keys(tiles).forEach(function (key) {
        var layer = tiles[key];
        if (map.hasLayer(layer) && layer.redraw) layer.redraw();
      });
    });
    note.appendChild(retry);
    var alternate = document.createElement("button");
    alternate.type = "button";
    alternate.textContent = map && tiles && map.hasLayer(tiles.uydu) ? "Yol haritasını dene" : "Uydu görüntüsünü dene";
    alternate.addEventListener("click", function () {
      if (!map || !tiles || !tiles.uydu || !tiles.yol) return;
      var current = map.hasLayer(tiles.uydu) ? tiles.uydu : tiles.yol;
      var next = current === tiles.uydu ? tiles.yol : tiles.uydu;
      map.removeLayer(current);
      next.addTo(map);
      alternate.textContent = next === tiles.uydu ? "Yol haritasını dene" : "Uydu görüntüsünü dene";
      if (next.redraw) next.redraw();
    });
    note.appendChild(document.createTextNode(" "));
    note.appendChild(alternate);
    var toChron = document.createElement("a");
    toChron.href = "#kronoloji";
    toChron.textContent = "Kronolojiye geç";
    note.appendChild(document.createTextNode(" "));
    note.appendChild(toChron);
    [["/olaylar/", "Olay listesi"], ["/kaynakca/", "Kaynakça"]].forEach(function (destination) {
      var link = document.createElement("a");
      link.href = destination[0];
      link.textContent = destination[1];
      note.appendChild(document.createTextNode(" "));
      note.appendChild(link);
    });
    frame.appendChild(note);
  }

  function bootMap() {
    var host = document.getElementById("map");
    if (!host) return false;
    if (typeof L === "undefined" || !L.map) {
      showMapError("Harita kütüphanesi yüklenemedi.");
      return false;
    }
    try {
      map = L.map("map", {
        zoomControl: false,
        attributionControl: true,
        minZoom: 8,
        maxZoom: 16,
        scrollWheelZoom: false
      }).setView(D.center, D.defaultZoom);
      L.control.zoom({
        zoomInTitle: "Yakınlaştır",
        zoomOutTitle: "Uzaklaştır"
      }).addTo(map);
      var scaleControl = L.control.scale({ position: "bottomleft", metric: true, imperial: false, maxWidth: 100 }).addTo(map);
      scaleControl.getContainer().setAttribute("aria-label", "Harita mesafe ölçeği; tarihsel mevzi kesinliği göstermez");
      tiles = {
        uydu: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Görüntü © Esri", maxZoom: 16 }
        ),
        yol: L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "&copy; OpenStreetMap katkıda bulunanlar",
            subdomains: "abc",
            maxZoom: 16
          }
        )
      };
      watchTiles(tiles.uydu);
      watchTiles(tiles.yol);
      tiles.uydu.on("add", function () {
        host.setAttribute("aria-label", "Çanakkale 1915 haritası. Taban harita günümüz uydu görüntüsüdür. Tarihsel işaretler yaklaşık, mayın çizgileri şematiktir.");
      });
      tiles.yol.on("add", function () {
        host.setAttribute("aria-label", "Çanakkale 1915 haritası. Taban harita günümüz yol haritasıdır. Tarihsel işaretler yaklaşık, mayın çizgileri şematiktir.");
      });
      tiles.uydu.addTo(map);
      var baseControl = L.control.layers({ Uydu: tiles.uydu, "Yol haritası": tiles.yol }, null, { position: "bottomright", collapsed: false }).addTo(map);
      var baseContainer = baseControl.getContainer();
      baseContainer.setAttribute("role", "group");
      baseContainer.setAttribute("aria-label", "Taban harita");
      return true;
    } catch (err) {
      map = null;
      showMapError("Harita açılamadı.");
      return false;
    }
  }

  var mapReady = bootMap();
  var layerTool = document.getElementById("tool-layers");
  if (layerTool) {
    layerTool.disabled = !mapReady;
    if (!mapReady) layerTool.setAttribute("title", "Harita yüklenmediği için katmanlar kullanılamıyor.");
  }
  if (!mapReady) {
    var unavailableLayers = document.getElementById("layers");
    if (unavailableLayers) unavailableLayers.appendChild(textEl("p", "Harita yüklenmediği için katmanlar kullanılamıyor. Arama ve kronoloji kullanılabilir."));
  }
  var resetView = document.getElementById("map-reset");
  if (resetView) {
    resetView.disabled = !mapReady;
    resetView.addEventListener("click", function () {
      if (!map) return;
      panelRevision += 1;
      stopPlay();
      if (map.stop) map.stop();
      map.setView(D.center, D.defaultZoom, { animate: motionOn() });
      var status = document.getElementById("map-view-status");
      if (status) status.textContent = "Başlangıç görünümüne dönüldü. Seçili olay, zaman ve süzgeçler korundu.";
    });
  }
  var activeId = null;
  var mode = "naval";
  var sideFilter = "both";
  var campSide = "all";
  var campDomain = "all";
  var campIndex = 0;
  var campSelection = null;
  var navalMinute = 450;
  var navalSelection = null;
  var playing = false;
  var playTimer = null;
  var filterTokens = {
    both: true,
    turk: true,
    itilaf: true,
    all: true,
    deniz: true,
    kara: true,
    tabya: true,
    birlik: true,
    gemi: true,
    enkaz: true,
    komuta: true,
    mayin: true,
    filo: true,
    kampanya: true
  };

  function track(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  function trackMapSelect(kind) {
    if (kind !== "yer" && kind !== "olay") return;
    track("map_event_select", { item_type: kind });
  }

  function trackPlay() {
    track("timeline_play", { mode: mode === "camp" ? "camp" : "naval" });
  }

  function trackFilter(token) {
    if (!filterTokens[token]) return;
    track("filter_used", { filter_value: token });
  }

  function allPlaces() {
    var extra = D.campaign && D.campaign.places ? D.campaign.places : [];
    return D.places.concat(extra);
  }

  function findPlace(id) {
    var all = allPlaces();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  }

  function letter(type) {
    return ({ tabya: "T", birlik: "B", gemi: "G", enkaz: "X", komuta: "K", kampanya: "H" })[type] || "•";
  }

  function iconFor(type, pulse) {
    var touch = window.matchMedia("(max-width: 860px)").matches;
    var s = touch ? 44 : 28;
    return L.divIcon({
      className: "om-marker om-marker--" + type + (pulse ? " om-marker--pulse" : ""),
      html: '<div class="om-pin"><span>' + letter(type) + "</span></div>",
      iconSize: [s, s],
      iconAnchor: [Math.round(s / 2), s - 2]
    });
  }

  function updateSelectedLayerNotice() {
    var old = document.getElementById("selected-layer-note");
    if (old && old.remove) old.remove();
    var body = document.getElementById("panel-body");
    var panel = document.getElementById("panel");
    var place = panel && !panel.inert && panel.selectedPlaceId ? findPlace(panel.selectedPlaceId) : null;
    var group = place && (groups[place.type] || groups.tabya);
    if (!body || !map || !group || map.hasLayer(group)) return;
    var note = textEl("div", "", "selected-layer-note");
    note.id = "selected-layer-note";
    note.appendChild(textEl("p", "Bu kaydın harita işareti kapalı bir katmanda. Konum kartta korunur."));
    var button = textEl("button", "Katmanı göster");
    button.type = "button";
    button.addEventListener("click", function () {
      stopPlay();
      group.addTo(map);
      flyToPlace(place, true);
      var layerId = groups[place.type] ? place.type : "tabya";
      var box = document.getElementById("layers");
      var chip = box && box.querySelector('[data-layer="' + layerId + '"]');
      if (chip) chip.setAttribute("aria-pressed", "true");
      var status = document.getElementById("map-view-status");
      if (status) status.textContent = "Seçili kaydın katmanı açıldı: " + place.name;
      var title = document.getElementById("panel-title");
      var ownedFocus = note.contains(document.activeElement);
      updateSelectedLayerNotice();
      if (ownedFocus && title) { title.setAttribute("tabindex", "-1"); title.focus({ preventScroll: true }); }
    });
    note.appendChild(button);
    body.appendChild(note);
  }

  function paintIcons() {
    Object.keys(markers).forEach(function (k) {
      var pl = findPlace(k);
      if (pl) {
        markers[k].setIcon(iconFor(pl.type, k === activeId));
        var element = markers[k].getElement();
        if (element) element.setAttribute("aria-label", pl.name);
      }
    });
    updateSelectedLayerNotice();
  }

  function closeTools() {
    var root = document.body;
    if (!root || !root.classList) return;
    var returnTo = null;
    if (document.activeElement && window.matchMedia && window.matchMedia("(max-width: 1099px)").matches) {
      [
        ["is-search-open", "search-pop", "tool-search"],
        ["is-filter-open", "filter-pop", "tool-filter"],
        ["is-layer-open", "layers", "tool-layers"]
      ].forEach(function (tool) {
        var content = document.getElementById(tool[1]);
        if (root.classList.contains(tool[0]) && content && content.contains(document.activeElement)) {
          returnTo = document.getElementById(tool[2]);
        }
      });
    }
    root.classList.remove("is-search-open", "is-filter-open", "is-layer-open");
    ["tool-search", "tool-filter", "tool-layers"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
    if (returnTo && !returnTo.disabled && !returnTo.closest("[hidden], [inert]") && returnTo.getClientRects().length) {
      returnTo.focus({ preventScroll: true });
    }
  }

  function syncToolLayout(compact) {
    var active = document.activeElement;
    var pairs = [["search-pop", "tool-search"], ["filter-pop", "tool-filter"], ["layers", "tool-layers"]];
    var target = null;
    pairs.forEach(function (pair) {
      var content = document.getElementById(pair[0]);
      var trigger = document.getElementById(pair[1]);
      if (compact && content && content.contains(active)) target = trigger;
      else if (!compact && active === trigger && content) {
        revealDock();
        target = content.querySelector("input, button");
      }
    });
    closeTools();
    if (target) target.focus();
  }

  function revealDock() {
    var root = document.body;
    if (!root || !root.classList || !root.classList.contains("is-dock-collapsed")) return;
    root.classList.remove("is-dock-collapsed");
    var button = document.getElementById("dock-toggle");
    if (button) {
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Kontrol panelini gizle");
      button.textContent = "Gizle";
    }
    if (map && map.invalidateSize) setTimeout(function () { map.invalidateSize(); }, motionOn() ? 60 : 0);
  }

  function saveAtlasView(target) {
    if (!map || !localHref(target)) return;
    try {
      var center = map.getCenter();
      var searchInput = document.getElementById("q");
      window.sessionStorage.setItem("om-atlas-return-view-v1", JSON.stringify({
        target: target, savedAt: Date.now(), lat: center.lat, lng: center.lng, zoom: map.getZoom(),
        side: sideFilter, domain: campDomain,
        query: searchInput && searchInput.value.length <= 500 ? searchInput.value : "",
        base: tiles && tiles.yol && map.hasLayer(tiles.yol) ? "yol" : "uydu",
        layers: Object.keys(groups).filter(function (key) { return map.hasLayer(groups[key]); })
      }));
    } catch (error) { /* Storage restrictions must not interrupt navigation. */ }
  }

  function readAtlasView(target) {
    try {
      var state = JSON.parse(window.sessionStorage.getItem("om-atlas-return-view-v1"));
      if (!state || state.target !== target || !Number.isFinite(state.savedAt) ||
          Date.now() - state.savedAt < 0 || Date.now() - state.savedAt > 30 * 60 * 1000) return null;
      if (!Number.isFinite(state.lat) || Math.abs(state.lat) > 90 ||
          !Number.isFinite(state.lng) || Math.abs(state.lng) > 180 ||
          !Number.isFinite(state.zoom) || state.zoom < 0 || state.zoom > 16) return null;
      if (state.base != null && ["uydu", "yol"].indexOf(state.base) === -1) return null;
      if (state.query != null && (typeof state.query !== "string" || state.query.length > 500)) return null;
      if (["both", "turk", "itilaf"].indexOf(state.side) === -1 ||
          ["all", "deniz", "kara"].indexOf(state.domain) === -1 ||
          !Array.isArray(state.layers) || state.layers.some(function (key) { return !Object.prototype.hasOwnProperty.call(groups, key); })) return null;
      return state;
    } catch (error) { return null; }
  }

  function restoreAtlasView(reselect) {
    if (!map) return;
    var state = readAtlasView(window.location.pathname + window.location.search + window.location.hash);
    if (!state) return;
    try { window.sessionStorage.removeItem("om-atlas-return-view-v1"); } catch (error) {}
    setSide(state.side);
    setDomain(state.domain);
    Object.keys(groups).forEach(function (key) {
      var enabled = state.layers.indexOf(key) !== -1;
      if (enabled && !map.hasLayer(groups[key])) groups[key].addTo(map);
      if (!enabled && map.hasLayer(groups[key])) map.removeLayer(groups[key]);
      var button = document.querySelector('[data-layer="' + key + '"]');
      if (button) button.setAttribute("aria-pressed", String(enabled));
    });
    if (state.base && tiles && tiles[state.base]) {
      Object.keys(tiles).forEach(function (key) {
        if (key !== state.base && map.hasLayer(tiles[key])) map.removeLayer(tiles[key]);
      });
      if (!map.hasLayer(tiles[state.base])) tiles[state.base].addTo(map);
    }
    if (typeof reselect === "function") reselect();
    var searchInput = document.getElementById("q");
    if (typeof state.query === "string" && state.query && searchInput && !searchInput.value) {
      searchInput.value = state.query;
      searchLimit = 8;
      renderSearch();
      closeSearchResults();
      searchPicked = true;
      if (qStatus) qStatus.textContent = "Arama korundu. Sonuçları görmek için arama alanına dönün.";
    }
    map.stop();
    map.setView([state.lat, state.lng], state.zoom, { animate: false });
    updateSelectedLayerNotice();
    var status = document.getElementById("map-view-status");
    if (status) status.textContent = "Harita görünümü ve süzgeçler geri yüklendi.";
  }

  function narrativeEvidence(item) {
    var source = item && item.narrativeSource;
    var url = source && Model && Model.safeUrl ? Model.safeUrl(source.url) : "";
    function validReviewDate(value) {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      var parsed = new Date(value + "T00:00:00Z");
      return !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
    }
    if (!url || source.status !== "daktilo_kopyasi_goruntuden_okundu" ||
        !validReviewDate(source.date) ||
        [source.evidenceText, source.date, source.limit, source.label].some(function (value) {
          return typeof value !== "string" || !value.trim();
        })) return null;
    var details = document.createElement("details");
    details.className = "panel-evidence";
    details.addEventListener("toggle", function () {
      if (details.open) {
        panelRevision += 1;
        stopPlay();
      }
    });
    details.appendChild(textEl("summary", "Belge kanıtını göster"));
    details.appendChild(textEl("p", "İnceleme tarihi: " + source.date + " · Daktilo kopyası incelendi; özgün raporla karşılaştırma açık."));
    if (source.translation) {
      details.appendChild(textEl("p", "Türkçe çeviri (atlas): " + source.translation));
    }
    if (source.context) details.appendChild(textEl("p", source.context));
    details.appendChild(textEl("p", "Belgedeki özgün ifade (İngilizce):"));
    var quote = textEl("blockquote", source.evidenceText);
    quote.lang = "en";
    details.appendChild(quote);
    details.appendChild(textEl("p", source.limit));
    var record = textEl("a", source.label || "Arşiv kaydı");
    record.href = url;
    details.appendChild(record);
    var imageUrl = Model.safeUrl(source.imageUrl);
    if (imageUrl) {
      var imageLink = textEl("a", "Belge görüntüsünü aç");
      imageLink.href = imageUrl;
      details.appendChild(imageLink);
    }
    var comparison = source.publishedComparison;
    var comparisonUrl = comparison && Model.safeUrl(comparison.url);
    if (comparison && /^https:\/\//.test(comparisonUrl) &&
        comparison.status === "resmi_yayin_goruntusu_incelendi" && validReviewDate(comparison.date) &&
        [comparison.label, comparison.evidenceText, comparison.translation, comparison.context, comparison.limit].every(function (value) {
          return typeof value === "string" && !!value.trim();
        })) {
      details.appendChild(textEl("p", "Ek kontrol: resmî yayım · " + comparison.date));
      details.appendChild(textEl("p", "Türkçe çeviri (atlas): " + comparison.translation));
      var comparisonQuote = textEl("blockquote", comparison.evidenceText);
      comparisonQuote.lang = "en";
      details.appendChild(comparisonQuote);
      details.appendChild(textEl("p", comparison.context));
      details.appendChild(textEl("p", comparison.limit));
      var comparisonLink = textEl("a", comparison.label);
      comparisonLink.href = comparisonUrl;
      details.appendChild(comparisonLink);
    }
    return details;
  }

  function claimConflictEvidence(place) {
    var source = place && place.claimReview;
    var url = source && Model && Model.safeUrl ? Model.safeUrl(source.url) : "";
    if (!source || source.status !== "kaynak_celiskisi_tespit_edildi" || !/^https?:\/\//.test(url)) return null;
    if (![source.evidenceText, source.date, source.limit, source.label].every(function (value) {
      return typeof value === "string" && !!value.trim();
    })) return null;
    var details = document.createElement("details");
    details.className = "panel-evidence";
    details.appendChild(textEl("summary", "Anlatıdaki kaynak çelişkisi"));
    details.appendChild(textEl("p", "İnceleme: " + source.date + ". Kaynak çelişkisi tespit edildi; özgün belge karşılaştırması açık."));
    var quote = textEl("blockquote", source.evidenceText);
    quote.lang = "tr";
    details.appendChild(quote);
    details.appendChild(textEl("p", source.limit));
    var link = textEl("a", source.label);
    link.href = url;
    details.appendChild(link);
    details.addEventListener("toggle", function () { if (details.open) stopPlay(); });
    return details;
  }

  function coordinateEvidence(place) {
    var coordinateSource = place && (place.coordinateSource || place.coordinateReview);
    var coordinateUrl = coordinateSource && Model && Model.safeUrl ? Model.safeUrl(coordinateSource.url) : "";
    if (!coordinateUrl) return null;
    var numericSource = !!place.coordinateSource;
    var allowedStatus = numericSource
      ? ["yayin_koordinati_karsilastirildi", "kurumsal_ziyaret_noktasi_karsilastirildi"]
      : ["anlatim_incelendi_nokta_dogrulanmadi"];
    var reviewDate = coordinateSource.date;
    var parsedDate = typeof reviewDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(reviewDate)
      ? new Date(reviewDate + "T00:00:00Z") : null;
    var validDate = parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === reviewDate;
    var details = document.createElement("details");
    details.className = "panel-evidence";
    details.appendChild(textEl("summary", place.coordinateSource ? "Konum dayanağını göster" : "Konum incelemesini göster"));
    if (coordinateUrl) {
      var coordinateLink = textEl("a", (place.coordinateSource ? "Konum kaynağı: " : "İncelenen kaynak: ") + (coordinateSource.label || "Yayın kaydı"));
      coordinateLink.href = coordinateUrl;
      details.appendChild(coordinateLink);
      if ([coordinateSource.evidenceText, coordinateSource.date, coordinateSource.label].every(function (value) {
        return typeof value === "string" && !!value.trim();
      }) && validDate && allowedStatus.indexOf(coordinateSource.status) !== -1) {
        if (coordinateSource.evidenceLanguage === "en") {
          details.appendChild(textEl("p", "Kaynakta okunan özgün ifade:"));
          var originalEvidence = textEl("blockquote", coordinateSource.evidenceText);
          originalEvidence.lang = "en";
          details.appendChild(originalEvidence);
          if (typeof coordinateSource.translation === "string" && coordinateSource.translation.trim()) {
            details.appendChild(textEl("p", "Türkçe çeviri (atlas): " + coordinateSource.translation));
          }
        } else {
          details.appendChild(textEl("p", (place.coordinateSource ? "Konum dayanağı: " : "Kaynakta okunan ifade: ") + coordinateSource.evidenceText));
        }
        details.appendChild(textEl("p", "Konum inceleme tarihi: " + coordinateSource.date + ". " +
          (coordinateSource.status === "yayin_koordinati_karsilastirildi"
            ? "Yayındaki koordinatla karşılaştırıldı; sahada yeniden ölçüm yapılmış sayılmaz."
            : coordinateSource.status === "kurumsal_ziyaret_noktasi_karsilastirildi"
              ? "Kurumun güncel ziyaret noktasıyla karşılaştırıldı; tarihsel siper veya birlik mevzii doğrulanmış sayılmaz."
              : coordinateSource.status === "anlatim_incelendi_nokta_dogrulanmadi"
                ? "Kaynağın coğrafi anlatımı incelendi; haritadaki sayısal noktayı doğrulamaz."
                : "Konum kaynağının doğrulaması tamamlanmadı.")));
        if (coordinateSource.datum === "belirtilmemis") {
          details.appendChild(textEl("p", "Kaynak koordinatın jeodezik referans sistemini (datum) belirtmiyor. Metre düzeyinde kesinlik iddiası yok."));
        }
      } else {
        details.appendChild(textEl("p", "Konum kaynağının kanıt metni, inceleme tarihi veya doğrulama bilgisi eksik ya da geçersiz; konum doğrulaması tamamlanmadı."));
      }
    }
    details.addEventListener("toggle", function () { if (details.open) stopPlay(); });
    return details;
  }

  function navyReturnHref(place) {
    if (!place || typeof window === "undefined" || !window.location || !window.location.search) return "";
    try {
      var request = new URLSearchParams(window.location.search);
      if (request.get("mevki") !== place || request.getAll("donanmayaDon").length !== 1) return "";
      var value = request.get("donanmayaDon");
      if (!value || value.length > 4000 || value.indexOf("/donanma/") !== 0) return "";
      var url = new URL(value, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/donanma/" || !/^#[a-z0-9-]{1,80}$/.test(url.hash)) return "";
      var keys = Array.from(url.searchParams.keys());
      if (keys.some(function (key) { return ["q", "ad"].indexOf(key) === -1 || url.searchParams.getAll(key).length !== 1; })) return "";
      if (url.searchParams.has("q") && url.searchParams.get("q").length > 200) return "";
      if (url.searchParams.has("ad") && url.searchParams.get("ad") !== "1") return "";
      return url.pathname + url.search + url.hash;
    } catch (error) { return ""; }
  }

  function fillPanel(spec) {
    var panel = document.getElementById("panel");
    var title = document.getElementById("panel-title");
    var meta = document.getElementById("panel-meta");
    var body = document.getElementById("panel-body");
    var empty = document.getElementById("dock-empty");
    if (!panel || !title || !meta || !body) return;
    panelRevision += 1;
    panel.returnFocusTarget = null;
    panel.selectedPlaceId = spec.placeId || null;
    title.textContent = spec.title || "";
    var kind = document.getElementById("panel-kind");
    if (kind) kind.textContent = ({ place: "Mevki", event: "Olay", interval: "Aralık notu", line: "Şematik hat" })[spec.kind] || "Bilgi";
    var bits = [];
    [spec.date, spec.side, spec.meta].forEach(function (value) {
      if (typeof value !== "string") return;
      value.split(" · ").forEach(function (part) {
        part = part.trim();
        if (part && bits.indexOf(part) === -1) bits.push(part);
      });
    });
    meta.textContent = bits.join(" · ");
    if (body.replaceChildren) body.replaceChildren();
    else body.innerHTML = "";
    if (spec.text) body.appendChild(textEl("p", spec.text));
    if (spec.accuracy) body.appendChild(textEl("p", spec.accuracy));
    var coordinatePlace = spec.placeId ? findPlace(spec.placeId) : null;
    if (spec.showPlaceReturn && coordinatePlace) {
      var placeReturn = textEl("button", "Mevki kartını aç: " + coordinatePlace.name);
      placeReturn.type = "button";
      placeReturn.className = "ev-btn";
      placeReturn.addEventListener("click", function () {
        selectMarkerPlace(coordinatePlace.id);
        focusSelectedPanel(null);
      });
      body.appendChild(placeReturn);
    }
    var coordinateDetails = coordinateEvidence(coordinatePlace);
    if (coordinateDetails) body.appendChild(coordinateDetails);
    var evidence = narrativeEvidence(coordinatePlace);
    var conflict = claimConflictEvidence(coordinatePlace);
    if (conflict) body.appendChild(conflict);
    if (evidence) {
      body.appendChild(textEl("p", "Anlatı kaynağı: Aşağıdaki belge kanıtı yalnız belirtilen pasajı destekler. Kartın tamamını, kesin saatleri veya harita koordinatını doğrulamaz."));
    } else if (spec.source) {
      body.appendChild(textEl("p", spec.source));
    }
    var sourceUrl = spec.sourceUrl && Model && Model.safeUrl ? Model.safeUrl(spec.sourceUrl) : "";
    if (sourceUrl) {
      var sourceLink = textEl("a", spec.sourceLabel || "İncelenen kaynak");
      sourceLink.href = sourceUrl;
      body.appendChild(sourceLink);
    }
    if (evidence) body.appendChild(evidence);
    function readingLink(href, label) {
      var link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      var local = localHref(href);
      var target = localHref(spec.shareHref);
      if (local && target) {
        try {
          var destination = new URL(local, window.location.href);
          var back = new URL(target, window.location.href);
          if (destination.origin === window.location.origin && back.origin === window.location.origin) {
            destination.searchParams.set("atlasaDon", target);
            link.href = destination.pathname + destination.search + destination.hash;
            link.addEventListener("click", function (event) {
              if (!event.defaultPrevented) saveAtlasView(target);
            });
          }
        } catch (error) { /* Keep the original link when return context cannot be added. */ }
      }
      return link;
    }
    var reviewLink = readingLink(localHref(spec.reviewHref) || "/inceleme-notlari/", "Kanıt metinleri ve açık kalanlar");
    body.appendChild(reviewLink);
    var navyBack = navyReturnHref(spec.placeId);
    if (navyBack) {
      var navyLink = textEl("a", "Gemi kartına dön");
      navyLink.className = "event-page-link";
      navyLink.href = navyBack;
      body.appendChild(navyLink);
    }
    if (spec.href) {
      var link = readingLink(spec.href, spec.hrefLabel || "Ayrıntı");
      link.className = "event-page-link";
      body.appendChild(link);
    }
    if (localHref(spec.shareHref)) {
      var share = document.createElement("a");
      share.className = "event-page-link";
      share.href = localHref(spec.shareHref);
      share.textContent = spec.shareLabel || "Bu kayda bağlantı";
      body.appendChild(share);
      var copyStatus = textEl("p", "");
      copyStatus.setAttribute("role", "status");
      copyStatus.setAttribute("aria-atomic", "true");
      copyStatus.hidden = true;
      var copyLink = textEl("button", "Bağlantıyı kopyala");
      copyLink.type = "button";
      copyLink.className = "ev-btn";
      copyLink.addEventListener("click", async function () {
        stopPlay();
        copyLink.disabled = true;
        copyStatus.hidden = false;
        copyStatus.textContent = "Bağlantı kopyalanıyor…";
        try {
          var address = new URL(share.href, window.location.href).href;
          if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
          await navigator.clipboard.writeText(address);
          copyStatus.textContent = "Kayıt bağlantısı kopyalandı.";
        } catch (error) {
          copyStatus.textContent = "Bağlantı kopyalanamadı. «Bu kayda bağlantı» üzerinde bağlantıyı kopyalama seçeneğini kullanabilirsiniz.";
        } finally {
          copyLink.disabled = false;
        }
      });
      body.appendChild(copyLink);
      body.appendChild(copyStatus);
    }
    (spec.extra || []).forEach(function (node) { body.appendChild(node); });
    panel.classList.add("open");
    panel.inert = false;
    var readSelection = document.getElementById("map-read-selection");
    if (readSelection) {
      readSelection.hidden = false;
      readSelection.setAttribute("aria-label", "Seçili kartı oku: " + title.textContent);
    }
    if (empty) empty.hidden = true;
    closeTools();
  }

  function paintCurrent(listSel, isOn) {
    var nodes = document.querySelectorAll(listSel);
    Array.prototype.forEach.call(nodes, function (li) {
      var on = !!isOn(li);
      li.classList.toggle("is-current", on);
      var btn = li.querySelector ? li.querySelector("button") : null;
      if (btn) btn.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function flyToPlace(place, fly) {
    if (!fly || !place || !map) return;
    if (map.stop) map.stop();
    map.flyTo([place.lat, place.lng], Math.max(13, Math.min(map.getZoom(), 14)), { duration: motionOn() ? 0.85 : 0 });
  }

  function navalReviewHref(placeId, title) {
    var queenRecords = [
      "Queen Elizabeth’in ilk 381 mm’lik salvosu",
      "Signal No. 12 — genel çekilme",
      "Filo Ege’ye çıkar"
    ];
    if (queenRecords.indexOf(title) !== -1) {
      return "/olaylar/18-mart-deniz-muharebesi/#queen-elizabeth-saat-incelemesi";
    }
    var anchors = {
      bouvet: "bouvet-saat-incelemesi",
      inflexible: "inflexible-saat-incelemesi",
      gaulois: "gaulois-kaynak",
      tavsan: "gaulois-kaynak",
      ocean: "tahliye-batis-ayrimi",
      irresistible: "tahliye-batis-ayrimi"
    };
    return "/olaylar/18-mart-deniz-muharebesi/#" + (anchors[placeId] || "kaynak-notu");
  }

  function navalTimeLabel(ev) {
    var source = ev && ev.sourceTime;
    if (!source || source.status !== "rapor_cevrimyazisi_okundu" ||
        !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(source.time) ||
        !source.evidenceText || !source.accessDate || !/^https:\/\//.test(source.url)) return "Saat doğrulanmadı";
    return source.time + " · " + source.kind + " (rapor)";
  }

  function fillFromNaval(ev, fly) {
    var place = ev.place ? findPlace(ev.place) : null;
    fillPanel({
      title: ev.title,
      kind: "event",
      placeId: place ? place.id : null,
      showPlaceReturn: true,
      date: "18 Mart 1915 · " + navalTimeLabel(ev),
      side: sideLabel(ev.side),
      meta: place ? place.name : "",
      text: "İncelenen taslak: " + ev.text,
      reviewHref: navalReviewHref(ev.place, ev.title),
      accuracy: place ? accuracyText(place) : "Haritada ayrı nokta yok.",
      source: ev.sourceTime ? ev.sourceTime.timeSystem + " " + ev.sourceTime.limit : sourceText(ev),
      href: "/olaylar/18-mart-deniz-muharebesi/",
      shareHref: "/?dakika=" + encodeURIComponent(ev.m) + "&deniz=" + encodeURIComponent(slugify(ev.title)) + "#harita",
      shareLabel: "Bu kayda bağlantı",
      hrefLabel: "18 Mart sayfası"
    });
    activeId = place ? place.id : null;
    paintIcons();
    flyToPlace(place, fly);
    paintCurrent("#event-list li", function (li) {
      var heading = li.querySelector("h3");
      return !!(heading && heading.textContent === ev.title);
    });
  }

  function fillFromCamp(ev, fly) {
    var place = ev.place ? findPlace(ev.place) : null;
    var href = localHref(eventPageHref(ev));
    var chronologySource = ev.chronologySource;
    if (chronologySource) href = "/olaylar/" + slugify(ev.title) + "/";
    var accuracy = ev.quiet
      ? "Aralık notu. Ayrı bir muharebe kaydı değildir."
      : (place ? accuracyText(place) : "Haritada ayrı nokta yok.");
    fillPanel({
      title: ev.title,
      kind: ev.quiet ? "interval" : "event",
      placeId: place ? place.id : null,
      showPlaceReturn: true,
      date: ev.date,
      side: sideLabel(ev.side),
      meta: place ? place.name : "",
      text: ev.text,
      accuracy: accuracy,
      source: chronologySource ? chronologySource.label + " · İlgili giriş: " + chronologySource.passage +
        " · Erişim: " + chronologySource.accessDate + ". " + chronologySource.scope : sourceText(ev),
      href: href,
      shareHref: "/?olay=" + encodeURIComponent(ev.id) + "#harita",
      hrefLabel: chronologySource ? "Kaynak ve inceleme sınırı" : "Ayrıntı"
    });
    activeId = place ? place.id : null;
    paintIcons();
    flyToPlace(place, fly);
    paintCurrent("#camp-list li", function (li) { return li.id === "event-" + ev.id; });
  }

  function openPlace(id, fly) {
    var p = findPlace(id);
    if (!p) return;
    var placeText = p.short || (p.note && p.note[0]) || "";
    if (placeText && p.verification !== "sayfa") placeText = "Taslak mevki notu: " + placeText;
    activeId = id;
    paintIcons();
    flyToPlace(p, fly);
    var extra = [];
    // Eski sayısal alanlar, ayrı kanıt olmadan doğrulanmış değer gibi gösterilmez.
    if (p.hits || p.strength) {
      extra.push(textEl("p", "İsabet ve personel sayıları için belge karşılaştırması tamamlanmadı."));
    }
    var related = [];
    if (D.campaign) related = D.campaign.events.filter(function (ev) { return ev.place === id; });
    var href = "";
    related.some(function (ev) {
      href = localHref(eventPageHref(ev));
      return !!href;
    });
    if (related.length) extra.push(textEl("h3", "Bu mevkideki sefer olayları"));
    related.forEach(function (ev) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ev-btn";
      btn.setAttribute("data-camp", ev.id);
      btn.appendChild(textEl("strong", ev.date));
      btn.appendChild(document.createTextNode(" " + (ev.title || "")));
      extra.push(btn);
    });
    var navalHere = (D.events || []).filter(function (ev) { return ev.place === id; });
    if (navalHere.length) extra.push(textEl("h3", "Bu mevkideki 18 Mart kayıtları"));
    navalHere.forEach(function (ev) {
      var eventButton = textEl("button", "18 Mart · Saat doğrulanmadı · " + ev.title);
      eventButton.type = "button";
      eventButton.className = "ev-btn";
      eventButton.addEventListener("click", function () {
        focusNavalEvent(ev, false);
        focusSelectedPanel(null);
      });
      extra.push(eventButton);
    });
    var date = "";
    var side = "";
    if (related.length === 1) {
      date = related[0].date;
      side = sideLabel(related[0].side);
    } else if (navalHere.length && !related.length) {
      date = "18 Mart 1915";
      var sides = {};
      navalHere.forEach(function (ev) { sides[ev.side] = true; });
      var keys = Object.keys(sides);
      side = keys.length === 1 ? sideLabel(keys[0]) : (keys.length > 1 ? "İki taraf" : "");
    }
    fillPanel({
      title: p.name,
      kind: "place",
      placeId: p.id,
      date: date,
      side: side,
      meta: p.meta || "",
      text: placeText,
      accuracy: accuracyText(p),
      source: sourceText(p),
      reviewHref: navalHere.length ? navalReviewHref(p.id) : "",
      href: href,
      hrefLabel: "Ayrıntı",
      shareHref: "/?mevki=" + encodeURIComponent(p.id) + "#harita",
      extra: extra
    });
    updateSelectedLayerNotice();
  }

  function closePanel() {
    panelRevision += 1;
    activeId = null;
    var panel = document.getElementById("panel");
    var restoreFocus = panel && panel.contains && panel.contains(document.activeElement);
    var returnTo = panel && panel.returnFocusTarget;
    if (panel) {
      panel.returnFocusTarget = null;
      panel.selectedPlaceId = null;
      panel.classList.remove("open");
      panel.inert = true;
    }
    var readSelection = document.getElementById("map-read-selection");
    if (readSelection) readSelection.hidden = true;
    var empty = document.getElementById("dock-empty");
    if (empty) empty.hidden = false;
    paintIcons();
    if (restoreFocus) {
      var compact = window.matchMedia && window.matchMedia("(max-width: 1099px)").matches;
      var canReturn = returnTo && returnTo.isConnected && !returnTo.disabled &&
        !returnTo.closest("[hidden], [inert]") && returnTo.getClientRects().length > 0;
      var target = canReturn ? returnTo : document.getElementById(compact ? "tool-search" : "q");
      if (target) target.focus();
    }
  }

  function selectPlace(id, fly, placeOnly) {
    stopPlay();
    var p = findPlace(id);
    if (!p) return;
    revealDock();
    trackMapSelect("yer");
    var filtered = sideFilter !== "both" || (mode === "camp" && campDomain !== "all");
    var relatedEvents = mode === "camp" ? campEvents() : D.events.filter(function (ev) {
      return sideFilter === "both" || ev.side === sideFilter || ev.side === "both";
    });
    if (filtered && !relatedEvents.some(function (ev) { return ev.place === id; })) {
      clearFilters();
      openPlace(id, fly);
      updateFilterStatus("Seçilen mevki süzgecin dışındaydı; tüm kayıtlar açıldı.");
      return;
    }
    if (placeOnly) {
      openPlace(id, fly);
      return;
    }
    if (mode === "naval") {
      var hit = null;
      D.events.forEach(function (ev) {
        if (ev.place === id && (sideFilter === "both" || ev.side === sideFilter || ev.side === "both")) hit = ev;
      });
      if (hit) {
        navalMinute = hit.m;
        range.value = String(hit.m);
        showTime(hit.m, fly, hit);
        return;
      }
    } else if (D.campaign) {
      var list = campEvents();
      var idx = -1;
      list.forEach(function (ev, i) { if (ev.place === id) idx = i; });
      if (idx >= 0) {
        campIndex = idx;
        range.max = String(Math.max(0, list.length - 1));
        range.value = String(idx);
        showCamp(idx, fly);
        return;
      }
    }
    openPlace(id, fly);
  }

  function selectMarkerPlace(id) {
    if (!findPlace(id)) return;
    stopPlay();
    revealDock();
    trackMapSelect("yer");
    openPlace(id, false);
  }

  function addMarker(p) {
    var m = L.marker([p.lat, p.lng], { icon: iconFor(p.type), title: p.name })
      .on("add", function () {
        var element = this.getElement();
        if (element) element.setAttribute("aria-label", p.name);
      })
      .addTo(groups[p.type] || groups.tabya)
      .on("click", function () {
        selectMarkerPlace(p.id);
        focusSelectedPanel(m.getElement ? m.getElement() : null);
      });
    m.bindTooltip(p.name, { direction: "top", offset: [0, -12] });
    markers[p.id] = m;
  }

  function activateMarkerKey(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    var target = event.target;
    if (!target || !target.closest || !target.closest("#map")) return;
    var id = Object.keys(markers).find(function (key) {
      return markers[key].getElement && markers[key].getElement() === target;
    });
    if (!id) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.repeat) return;
    selectMarkerPlace(id);
    focusSelectedPanel(markers[id].getElement());
  }
  document.addEventListener("keydown", activateMarkerKey, true);

  if (mapReady) {
  if (D.campaign && D.campaign.places) {
    D.layers.push({ id: "kampanya", label: "Kara harekâtı", color: "#d27a4a" });
  }
  D.layers.forEach(function (l) {
    groups[l.id] = L.layerGroup().addTo(map);
  });

  D.places.forEach(addMarker);
  if (D.campaign && D.campaign.places) D.campaign.places.forEach(addMarker);

  D.lines.forEach(function (ln) {
    var pl = L.polyline(ln.latlngs, {
      color: ln.color,
      weight: ln.weight,
      dashArray: ln.dash,
      opacity: 0.9
    }).addTo(groups[ln.type]);
    pl.bindTooltip(ln.name + " · şematik gösterim");
    bindMapLine(pl, ln, false);
  });

  D.mineLines.forEach(function (ln) {
    var pl = L.polyline([ln.a, ln.b], {
      color: "#c9a227",
      weight: 1.5,
      dashArray: "4 8",
      opacity: 0.55
    }).addTo(groups.mayin).bindTooltip(ln.name + " · şematik gösterim");
    bindMapLine(pl, ln, true);
  });

  var layerBox = document.getElementById("layers");
  D.layers.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.layer = l.id;
    b.textContent = l.label;
    b.setAttribute("aria-pressed", "true");
    b.addEventListener("click", function () {
      var on = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", on ? "false" : "true");
      if (on) map.removeLayer(groups[l.id]);
      else groups[l.id].addTo(map);
      updateSelectedLayerNotice();
      trackFilter(l.id);
    });
    if (layerBox) layerBox.appendChild(b);
  });
  applyDateLayers("naval");
  }

  document.getElementById("panel-close").addEventListener("click", function () {
    stopPlay();
    closePanel();
  });
  document.getElementById("panel-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-camp]");
    if (!b || !D.campaign) return;
    var ev = null;
    D.campaign.events.forEach(function (item) {
      if (item.id === b.getAttribute("data-camp")) ev = item;
    });
    if (ev) {
      focusCampEvent(ev, true);
      focusSelectedPanel(null);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var nav = document.getElementById("nav-panel");
    if (nav && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      var toggle = document.getElementById("nav-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
      return;
    }
    var tools = [
      ["is-search-open", "tool-search"],
      ["is-filter-open", "tool-filter"],
      ["is-layer-open", "tool-layers"]
    ];
    var returnTo = null;
    tools.forEach(function (tool) {
      if (document.body.classList.contains(tool[0])) returnTo = document.getElementById(tool[1]);
    });
    if (returnTo) {
      closeTools();
      returnTo.focus();
      return;
    }
    stopPlay();
    closePanel();
  });

  var q = document.getElementById("q");
  var qRes = document.getElementById("q-results");
  var qStatus = document.getElementById("q-status");
  var qMore = document.getElementById("q-more");
  var qClear = document.getElementById("q-clear");
  var searchLimit = 8;
  var searchPicked = false;
  function beginSearchInteraction() {
    panelRevision += 1;
    stopPlay();
  }
  q.addEventListener("focus", function () {
    beginSearchInteraction();
    if (searchPicked) renderSearch();
  });
  function closeSearchResults() {
    qRes.hidden = true;
    if (qMore) qMore.hidden = true;
    q.setAttribute("aria-expanded", "false");
  }
  q.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "Escape" && !qRes.hidden) {
      e.preventDefault();
      e.stopPropagation();
      closeSearchResults();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
      beginSearchInteraction();
      if (qRes.hidden) renderSearch();
      var hits = qRes.querySelectorAll("button");
      if (!hits.length) return;
      e.preventDefault();
      hits[e.key === "ArrowUp" ? hits.length - 1 : 0].focus();
    }
  });
  qRes.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeSearchResults();
      q.focus();
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].indexOf(e.key) === -1) return;
    var hits = Array.prototype.slice.call(qRes.querySelectorAll("button"));
    var index = hits.indexOf(e.target);
    if (index < 0) return;
    beginSearchInteraction();
    e.preventDefault();
    var next = e.key === "Home" ? 0 : e.key === "End" ? hits.length - 1 : index + (e.key === "ArrowDown" ? 1 : -1);
    if (next < 0 || next >= hits.length) q.focus();
    else hits[next].focus();
  });
  function addSearchHit(label, onPick, p, kind) {
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    var name = document.createElement("span");
    name.className = "search-hit-title";
    name.textContent = p ? p.name : label;
    var type = document.createElement("span");
    type.className = "search-hit-type";
    type.textContent = p
      ? ({ tabya: "Tabya · Harita", birlik: "Birlik · Harita", gemi: "Gemi · Harita", enkaz: "Batış / hasar · Harita", komuta: "Komuta · Harita", kampanya: "Mevki · Harita" })[p.type] || "Mevki · Harita"
      : kind || "Olay";
    if (p && !map) type.textContent = type.textContent === "Mevki · Harita"
      ? "Mevki kartı" : type.textContent.replace(" · Harita", " · Mevki kartı");
    btn.appendChild(name);
    btn.appendChild(type);
    btn.addEventListener("click", function () {
      closeSearchResults();
      revealDock();
      onPick();
      searchPicked = true;
      if (qStatus) qStatus.textContent = "Seçildi: " + label;
      focusSelectedPanel(null);
    });
    li.appendChild(btn);
    qRes.appendChild(li);
  }
  function renderSearch() {
    searchPicked = false;
    if (qClear) qClear.disabled = !q.value;
    var v = foldTr(q.value.trim());
    if (qMore) qMore.hidden = true;
    qRes.innerHTML = "";
    if (v.length < 2) {
      qRes.hidden = true;
      q.setAttribute("aria-expanded", "false");
      if (qStatus) qStatus.textContent = v ? "Aramak için en az 2 karakter yazın." : "";
      return;
    }
    var terms = v.split(/\s+/).filter(Boolean);
    function matches(hay) { return terms.every(function (term) { return hay.indexOf(term) !== -1; }); }
    var count = 0;
    allPlaces().forEach(function (p) {
      var hay = foldTr(p.name + " " + (p.meta || "") + " " + (p.short || ""));
      if (!matches(hay)) return;
      count += 1;
      if (count > searchLimit) return;
      addSearchHit(p.name, function () { selectPlace(p.id, true, true); }, p);
    });
    (D.events || []).forEach(function (ev) {
      var hay = foldTr(ev.t + " " + ev.title + " " + ev.text);
      if (!matches(hay)) return;
      count += 1;
      if (count > searchLimit) return;
      addSearchHit(ev.title, function () {
        focusNavalEvent(ev, true);
        trackMapSelect("olay");
      }, null, "18 Mart · Saat incelemede");
    });
    if (D.campaign) {
      D.campaign.events.forEach(function (ev) {
        if (ev.quiet || ev.id === "e-nisan2627") return;
        var hay = foldTr(ev.date + " " + ev.title + " " + ev.text);
        if (!matches(hay)) return;
        count += 1;
        if (count > searchLimit) return;
        addSearchHit(ev.date + " " + ev.title, function () { focusCampEvent(ev); }, null, "Cephe kronolojisi · Olay");
      });
    }
    qRes.hidden = qRes.children.length === 0;
    q.setAttribute("aria-expanded", qRes.hidden ? "false" : "true");
    if (qMore) {
      qMore.hidden = count <= searchLimit;
      qMore.textContent = Math.min(8, Math.max(0, count - searchLimit)) + " sonuç daha göster";
    }
    if (qStatus) qStatus.textContent = count > searchLimit
      ? count + " eşleşme bulundu; ilk " + searchLimit + " sonuç gösteriliyor."
      : count ? count + " sonuç gösteriliyor." : "Sonuç bulunamadı. Başka bir mevki, gemi veya olay adı deneyin.";
  }
  if (qClear) qClear.addEventListener("click", function () {
    beginSearchInteraction();
    q.value = "";
    searchLimit = 8;
    renderSearch();
    if (qStatus) qStatus.textContent = "Arama temizlendi. Yeni bir mevki, gemi veya olay arayabilirsiniz.";
    q.focus();
  });
  q.addEventListener("input", function () {
    beginSearchInteraction();
    searchLimit = 8;
    renderSearch();
  });
  if (qMore) qMore.addEventListener("click", function () {
    beginSearchInteraction();
    var firstNew = searchLimit;
    searchLimit += 8;
    renderSearch();
    var hits = qRes.querySelectorAll("button");
    if (hits[firstNew]) hits[firstNew].focus();
  });

  var clock = document.getElementById("clock");
  var tlEvent = document.getElementById("tl-event");
  var range = document.getElementById("tl-range");
  var hint = document.getElementById("tl-hint");

  function minsToClock(m) {
    var h = Math.floor(m / 60);
    var mm = m % 60;
    return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm;
  }

  function navalEvents(side) {
    return D.events.filter(function (ev) {
      if (side === "both") return true;
      return ev.side === side || ev.side === "both";
    });
  }

  function eventsAt(m, side) {
    return navalEvents(side).filter(function (ev) { return ev.m <= m; });
  }

  function updateEventMarkers() {
    if (!map) return;
    var filtered = sideFilter !== "both" || (mode === "camp" && campDomain !== "all");
    var visible = {};
    var list = mode === "camp" ? campEvents() : navalEvents(sideFilter);
    list.forEach(function (ev) { if (ev.place) visible[ev.place] = true; });
    allPlaces().forEach(function (place) {
      var marker = markers[place.id];
      var group = groups[place.type] || groups.tabya;
      if (!marker || !group) return;
      // These are event locations, not inferred allegiances of places.
      if (!filtered || visible[place.id]) {
        if (!group.hasLayer(marker)) group.addLayer(marker);
      } else if (group.hasLayer(marker)) group.removeLayer(marker);
    });
  }

  function updateFilterStatus(message) {
    var status = document.getElementById("side-filter-status");
    if (!status) return;
    var list = mode === "camp" ? campEvents() : navalEvents(sideFilter);
    var shared = list.filter(function (ev) { return ev.side === "both"; }).length;
    var scope = mode === "camp" ? "Cephe kronolojisi" : "18 Mart";
    var side = sideFilter === "both" ? "İki taraf" : sideLabel(sideFilter);
    status.textContent = (message ? message + " " : "") + scope + " · " + side + ": " + list.length + " kayıt." +
      (sideFilter !== "both" && shared ? " " + shared + " ortak kayıt bu seçime dahildir." : "");
  }

  function refreshNavalFilter() {
    var m = Number(range.value);
    var list = navalEvents(sideFilter);
    var first = list[0];
    if (!eventsAt(m, sideFilter).length && first) {
      range.value = String(first.m);
      showTime(first.m, false, first);
      updateFilterStatus("Bu seçimdeki ilk kayıt açıldı.");
    } else {
      showTime(m, false, navalSelection);
      updateFilterStatus();
    }
  }

  function showTime(m, fly, selected) {
    navalMinute = m;
    // Legacy minute values preserve links and playback positions, not verified times.
    var label = "Saat doğrulanmadı";
    clock.textContent = "18 Mart · Kayıtlar";
    if (range) range.setAttribute("aria-valuetext", "18 Mart 1915 · " + label);
    var list = eventsAt(m, sideFilter);
    var last = selected && selected.m === m && list.indexOf(selected) !== -1 ? selected : list[list.length - 1];
    navalSelection = last || null;
    if (!last) {
      tlEvent.replaceChildren(textEl("em", label), document.createTextNode(" Bu seçimde gösterilecek kayıt yok."));
      paintCurrent("#event-list li", function () { return false; });
      closePanel();
      return;
    }
    label = navalTimeLabel(last);
    if (range) range.setAttribute("aria-valuetext", "18 Mart 1915 · " + last.title + " · " + label);
    tlEvent.replaceChildren(textEl("em", label), document.createTextNode(" " + last.title + " — Taslak anlatı: " + last.text));
    fillFromNaval(last, fly);
  }

  function sideLabel(s) {
    if (s === "osmanli" || s === "turk") return "Osmanlı";
    if (s === "itilaf") return "İtilaf";
    if (s === "both") return "İki taraf";
    return "";
  }

  function domainLabel(d) {
    if (d === "deniz") return "Deniz";
    if (d === "kara") return "Kara";
    return "Deniz ve kara";
  }

  function campEvents() {
    if (!D.campaign) return [];
    return D.campaign.events.filter(function (ev) {
      if (campSide === "osmanli" && ev.side !== "osmanli" && ev.side !== "both") return false;
      if (campSide === "itilaf" && ev.side !== "itilaf" && ev.side !== "both") return false;
      if (campDomain === "deniz" && ev.domain !== "deniz" && ev.domain !== "ikisi") return false;
      if (campDomain === "kara" && ev.domain !== "kara" && ev.domain !== "ikisi") return false;
      return true;
    });
  }

  function paintCampChips() {
    Array.prototype.forEach.call(document.querySelectorAll("#camp-filters .chip"), function (c) {
      var key = c.getAttribute("data-camp");
      if (!key) return;
      var on = false;
      if (key === "all") on = campSide === "all" && campDomain === "all";
      else if (key === "osmanli" || key === "itilaf") on = campSide === key;
      else if (key === "deniz" || key === "kara") on = campDomain === key;
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function showCamp(i, fly) {
    var filterStatus = document.getElementById && document.getElementById("timeline-filter-status");
    if (filterStatus) { filterStatus.textContent = ""; filterStatus.hidden = true; }
    var list = campEvents();
    var ev = list[i];
    campIndex = i;
    campSelection = ev || null;
    if (!ev) {
      clock.textContent = "—";
      if (range) range.setAttribute("aria-valuetext", "Bu süzgeçte olay yok");
      tlEvent.textContent = "Bu süzgeçte olay yok.";
      paintCurrent("#camp-list li", function () { return false; });
      closePanel();
      return;
    }
    clock.textContent = ev.date;
    if (range) range.setAttribute("aria-valuetext", ev.date + " " + ev.title);
    tlEvent.replaceChildren(textEl("em", ev.date), document.createTextNode(" " + ev.title + " — " + ev.text));
    fillFromCamp(ev, fly);
  }

  function focusPlaybackMap() {
    var target = document.getElementById("map");
    if (target && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    if (!target) target = document.getElementById("tl-play");
    if (target && target !== document.activeElement) target.focus({ preventScroll: true });
  }

  function updateMapPlayback() {
    var strip = document.getElementById("map-playback");
    if (!strip) return;
    var returnFocus = !playing && strip.contains(document.activeElement);
    strip.hidden = !playing;
    var time = document.getElementById("map-playback-time");
    var title = document.getElementById("map-playback-title");
    var selectedTitle = document.getElementById("panel-title");
    if (time) time.textContent = clock.textContent;
    if (title) title.textContent = selectedTitle ? selectedTitle.textContent : "";
    if (returnFocus) focusPlaybackMap();
  }

  function stopPlay() {
    var completion = document.getElementById("playback-status");
    if (completion) { completion.hidden = true; completion.textContent = ""; }
    playing = false;
    updateMapPlayback();
    var b = document.getElementById("tl-play");
    if (b) {
      b.textContent = "Oynat";
      b.setAttribute("aria-pressed", "false");
    }
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
  }

  function setMode(next) {
    stopPlay();
    var filterStatus = document.getElementById("timeline-filter-status");
    if (filterStatus) { filterStatus.textContent = ""; filterStatus.hidden = true; }
    if (mode === "naval") navalMinute = Number(range.value);
    if (mode === "camp") campIndex = Number(range.value);
    mode = next;
    document.getElementById("mode-18").setAttribute("aria-pressed", next === "naval" ? "true" : "false");
    document.getElementById("mode-camp").setAttribute("aria-pressed", next === "camp" ? "true" : "false");
    if (hint) {
      hint.textContent = next === "naval"
        ? "18 Mart kayıtları arasında ilerleyin. Gösterim sırası, doğrulanmış saat veya süre anlamına gelmez."
        : "Cephe kronolojisi çubuğu, süzgeçteki olayların sırasıdır. Aralık notu muharebe değildir.";
    }
    applyDateLayers(next);
    if (next === "naval") {
      range.min = "450";
      range.max = "1350";
      range.step = "1";
      range.value = String(navalMinute);
      range.setAttribute("aria-label", "18 Mart kayıtları arasında ilerle");
      refreshNavalFilter();
    } else {
      var list = campEvents();
      range.min = "0";
      range.max = String(Math.max(0, list.length - 1));
      range.step = "1";
      var selectedIndex = list.indexOf(campSelection);
      campIndex = selectedIndex >= 0 ? selectedIndex : 0;
      range.value = String(campIndex);
      range.setAttribute("aria-label", "Cephe kronolojisi kayıtları arasında ilerle");
      showCamp(campIndex, false);
    }
    updateEventMarkers();
    updateFilterStatus();
  }

  range.addEventListener("input", function () {
    stopPlay();
    if (mode === "camp") showCamp(Number(range.value), true);
    else showTime(Number(range.value), true);
  });
  range.addEventListener("keydown", function (event) {
    if (mode !== "naval" || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    var keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"];
    if (keys.indexOf(event.key) === -1) return;
    event.preventDefault();
    panelRevision += 1;
    stopPlay();
    var pool = navalEvents(sideFilter);
    if (!pool.length) return;
    var index = pool.indexOf(navalSelection);
    if (index < 0) pool.forEach(function (item, i) { if (item.m <= Number(range.value)) index = i; });
    if (event.key === "Home") index = 0;
    else if (event.key === "End") index = pool.length - 1;
    else index += event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1;
    index = Math.max(0, Math.min(index, pool.length - 1));
    var target = pool[index];
    range.value = String(target.m);
    showTime(target.m, true, target);
  });

  function refreshCampRange() {
    if (mode !== "camp") return;
    var list = campEvents();
    range.max = String(Math.max(0, list.length - 1));
    var selectedIndex = list.indexOf(campSelection);
    if (selectedIndex >= 0) campIndex = selectedIndex;
    else campIndex = 0;
    range.value = String(campIndex);
    showCamp(campIndex, false);
    var filterStatus = document.getElementById && document.getElementById("timeline-filter-status");
    if (filterStatus) {
      filterStatus.hidden = false;
      filterStatus.textContent = !list.length ? "Bu süzgeçte gösterilecek kayıt yok. Seçili kart kapatıldı." :
        selectedIndex >= 0 ? "Seçili olay bu süzgeçte korunuyor: " + list[campIndex].title + "." :
        "Önceki seçim bu süzgeçte yer almıyor. İlk uygun kayıt gösteriliyor: " + list[campIndex].title + ".";
    }
  }

  function setSide(s) {
    var filterOpen = document.body && document.body.classList.contains("is-filter-open");
    var filterControl = document.activeElement;
    panelRevision += 1;
    stopPlay();
    var changed = sideFilter !== s;
    sideFilter = s;
    if (changed) trackFilter(s);
    campSide = s === "turk" ? "osmanli" : s === "itilaf" ? "itilaf" : "all";
    document.getElementById("tl-both").setAttribute("aria-pressed", s === "both" ? "true" : "false");
    document.getElementById("tl-turk").setAttribute("aria-pressed", s === "turk" ? "true" : "false");
    document.getElementById("tl-itilaf").setAttribute("aria-pressed", s === "itilaf" ? "true" : "false");
    Array.prototype.forEach.call(document.querySelectorAll("#kron-filters .chip"), function (c) {
      c.setAttribute("aria-pressed", c.getAttribute("data-side") === s ? "true" : "false");
    });
    paintCampChips();
    renderEvents();
    renderCampList();
    updateEventMarkers();
    if (mode === "naval") refreshNavalFilter();
    else refreshCampRange();
    if (mode === "camp") updateFilterStatus();
    restoreFilterTool(filterOpen, filterControl);
  }

  function restoreFilterTool(open, control) {
    if (!open || !document.body) return;
    document.body.classList.add("is-filter-open");
    var toggle = document.getElementById("tool-filter");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    var content = document.getElementById("filter-pop");
    if (content && control && content.contains(control) && control.isConnected && !control.disabled && control.getClientRects().length) {
      control.focus({ preventScroll: true });
    }
  }

  function setDomain(d) {
    panelRevision += 1;
    stopPlay();
    var changed = campDomain !== d;
    campDomain = d;
    if (changed) trackFilter(d);
    paintCampChips();
    renderCampList();
    refreshCampRange();
    updateEventMarkers();
    updateFilterStatus();
  }

  function clearFilters() {
    var domainChanged = campDomain !== "all";
    campDomain = "all";
    if (domainChanged) trackFilter("all");
    setSide("both");
    updateFilterStatus("Süzgeçler temizlendi; iki taraf ve tüm olay türleri gösteriliyor.");
  }

  function stepTime(dir, fromPlayback) {
    if (!fromPlayback) stopPlay();
    if (mode === "camp") {
      var list = campEvents();
      if (!list.length) { stopPlay(); return; }
      var i = Number(range.value) + dir;
      if (fromPlayback && (i < 0 || i >= list.length)) { stopPlaybackAtEnd(); return; }
      if (i < 0) i = list.length - 1;
      if (i >= list.length) i = 0;
      range.value = String(i);
      showCamp(i, true);
      return;
    }
    var cur = Number(range.value);
    var pool = D.events.filter(function (ev) {
      if (sideFilter !== "both" && ev.side !== sideFilter && ev.side !== "both") return false;
      return true;
    });
    if (!pool.length) { stopPlay(); return; }
    var target = null;
    var selectedIndex = pool.indexOf(navalSelection);
    if (selectedIndex >= 0 && navalSelection.m === cur) {
      if (fromPlayback && (selectedIndex + dir < 0 || selectedIndex + dir >= pool.length)) { stopPlaybackAtEnd(); return; }
      target = pool[(selectedIndex + dir + pool.length) % pool.length];
    } else if (dir > 0) {
      pool.some(function (ev) {
        if (ev.m > cur) { target = ev; return true; }
        return false;
      });
      if (!target && fromPlayback) { stopPlaybackAtEnd(); return; }
      if (!target) target = pool[0];
    } else {
      for (var n = pool.length - 1; n >= 0; n--) {
        if (pool[n].m < cur) { target = pool[n]; break; }
      }
      if (!target && fromPlayback) { stopPlaybackAtEnd(); return; }
      if (!target) target = pool[pool.length - 1];
    }
    range.value = String(target.m);
    showTime(target.m, true, target);
  }
  function stopPlaybackAtEnd() {
    stopPlay();
    var status = document.getElementById("playback-status");
    if (status) {
      status.hidden = false;
      status.textContent = "Oynatma tamamlandı. Son kayıt açık kaldı. Baştan başlamak için İleri, ardından Oynat düğmesine basın.";
    }
  }
  document.getElementById("tl-both").addEventListener("click", function () { setSide("both"); });
  document.getElementById("tl-turk").addEventListener("click", function () { setSide("turk"); });
  document.getElementById("tl-itilaf").addEventListener("click", function () { setSide("itilaf"); });
  document.getElementById("mode-18").addEventListener("click", function () { setMode("naval"); });
  document.getElementById("mode-camp").addEventListener("click", function () { setMode("camp"); });

  var playbackSpeed = document.getElementById("tl-speed");
  function startPlayTimer() {
    if (playTimer) clearInterval(playTimer);
    var requested = playbackSpeed ? Number(playbackSpeed.value) : 2400;
    var delay = [2400, 5000, 8000].indexOf(requested) >= 0 ? requested : 2400;
    playTimer = setInterval(function () { stepTime(1, true); updateMapPlayback(); }, delay);
  }
  if (playbackSpeed) playbackSpeed.addEventListener("change", function () {
    if (playing) startPlayTimer();
  });

  document.getElementById("tl-play").addEventListener("click", function () {
    playing = !playing;
    this.textContent = playing ? "Duraklat" : "Oynat";
    this.setAttribute("aria-pressed", playing ? "true" : "false");
    if (playTimer) clearInterval(playTimer);
    updateMapPlayback();
    if (!playing) return;
    scrollToMap();
    var pause = document.getElementById("map-playback-pause");
    if (pause) pause.focus({ preventScroll: true });
    trackPlay();
    startPlayTimer();
  });

  var mapPause = document.getElementById("map-playback-pause");
  if (mapPause) mapPause.addEventListener("click", function () {
    stopPlay();
    focusPlaybackMap();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopPlay();
  });
  window.addEventListener("pagehide", stopPlay);

  function bindManualMapNavigation(host) {
    if (!host) return;
    function interrupt() {
      panelRevision += 1;
      var wasPlaying = playing;
      stopPlay();
      if (map && map.stop) map.stop();
      if (wasPlaying) {
        var status = document.getElementById('map-view-status');
        if (status) status.textContent = 'Haritayı elle incelemek için oynatma duraklatıldı.';
      }
    }
    host.addEventListener('pointerdown', function (event) {
      if (event.button != null && event.button !== 0) return;
      interrupt();
    }, true);
    host.addEventListener('keydown', function (event) {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-', '=', 'Enter', ' '].indexOf(event.key) === -1) return;
      interrupt();
    }, true);
  }
  if (mapReady) bindManualMapNavigation(document.getElementById('map'));

  function bindMapGuide(details) {
    if (!details) return;
    details.addEventListener('toggle', function () {
      if (!details.open) return;
      panelRevision += 1;
      stopPlay();
    });
  }
  bindMapGuide(document.querySelector('.map-guide'));

  var panelMapReturn = document.getElementById("panel-map-return");
  if (panelMapReturn) panelMapReturn.addEventListener("click", function (event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
    event.preventDefault();
    stopPlay();
    scrollToMap();
    focusPlaybackMap();
  });

  var mapReadSelection = document.getElementById("map-read-selection");
  if (mapReadSelection) mapReadSelection.addEventListener("click", function () {
    panelRevision += 1;
    stopPlay();
    focusSelectedPanel(mapReadSelection);
  });

  showTime(450, false);

  function scrollToMap() {
    var target = document.getElementById("map") || document.getElementById("harita");
    if (target) target.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "start" });
  }

  function focusSelectedPanel(trigger) {
    var panel = document.getElementById("panel");
    var title = document.getElementById("panel-title");
    if (!panel || !title || panel.inert || !panel.classList.contains("open")) return;
    panel.returnFocusTarget = trigger || null;
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: "instant", block: "start" });
  }

  function goPlace(id) {
    panelRevision += 1;
    var requestedRevision = panelRevision;
    stopPlay();
    scrollToMap();
    setTimeout(function () {
      if (panelRevision !== requestedRevision) return;
      selectPlace(id, true, true);
    }, motionOn() ? 250 : 0);
  }

  function openLoose(title, meta, text) {
    stopPlay();
    scrollToMap();
    fillPanel({
      title: title,
      meta: meta || "",
      text: text || "",
      accuracy: "Haritada ayrı nokta yok."
    });
  }

  function focusNavalEvent(ev, fly) {
    if (!ev || D.events.indexOf(ev) < 0) return;
    stopPlay();
    if (sideFilter !== "both" && ev.side !== "both" && ev.side !== sideFilter) setSide("both");
    if (mode !== "naval") setMode("naval");
    navalMinute = ev.m;
    range.value = String(ev.m);
    showTime(ev.m, fly, ev);
    revealDock();
  }

  function focusCampEvent(ev, keepViewport) {
    stopPlay();
    revealDock();
    trackMapSelect("olay");
    if (ev.navalMinute) {
      navalMinute = ev.navalMinute;
      if (mode !== "naval") setMode("naval");
      range.value = String(navalMinute);
      showTime(navalMinute, !!ev.place);
      if (!ev.place) openLoose(ev.title, ev.date, ev.text);
      else if (!keepViewport) scrollToMap();
      return;
    }
    if (campEvents().indexOf(ev) < 0) {
      campDomain = "all";
      campSide = "all";
      sideFilter = "both";
      document.getElementById("tl-both").setAttribute("aria-pressed", "true");
      document.getElementById("tl-turk").setAttribute("aria-pressed", "false");
      document.getElementById("tl-itilaf").setAttribute("aria-pressed", "false");
      Array.prototype.forEach.call(document.querySelectorAll("#kron-filters .chip"), function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-side") === "both" ? "true" : "false");
      });
      paintCampChips();
      renderEvents();
      renderCampList();
      updateEventMarkers();
      updateFilterStatus();
    }
    var list = campEvents();
    var idx = list.indexOf(ev);
    if (idx < 0) idx = 0;
    campIndex = idx;
    if (mode !== "camp") setMode("camp");
    range.max = String(Math.max(0, list.length - 1));
    range.value = String(idx);
    showCamp(idx, !!ev.place);
    if (ev.place && !keepViewport) scrollToMap();
  }

  D.units.forEach(function (u) {
    var card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.appendChild(textEl("h3", u.name));
    card.appendChild(textEl("div", u.cmd, "who"));
    card.appendChild(textEl("p", (u.n || "") + " · " + (u.area || "")));
    card.addEventListener("click", function () { goPlace(u.place); });
    var unitCards = document.getElementById("unit-cards");
    if (unitCards) unitCards.appendChild(card);

    var tr = document.createElement("tr");
    tr.setAttribute("data-place", u.place);
    fillCells(tr, [u.name, u.cmd, u.n, u.area]);
    tr.addEventListener("click", function () { goPlace(u.place); });
    var unitRows = document.getElementById("unit-rows");
    if (unitRows) unitRows.appendChild(tr);
  });

  var shipRows = document.getElementById("ship-rows");
  if (shipRows) {
    D.ships.forEach(function (s) {
      var tr = document.createElement("tr");
      var place = null;
      var key = s.name.toLowerCase();
      if (key.indexOf("bouvet") !== -1) place = "bouvet";
      else if (key.indexOf("irresistible") !== -1) place = "irresistible";
      else if (key.indexOf("ocean") !== -1) place = "ocean";
      else if (key.indexOf("inflexible") !== -1) place = "inflexible";
      else if (key.indexOf("gaulois") !== -1) place = "tavsan";
      if (place) {
        tr.setAttribute("data-place", place);
        tr.addEventListener("click", function () { goPlace(place); });
      }
      fillCells(tr, [s.n, s.name, s.flag, s.cls, s.armor, s.guns, s.fate]);
      shipRows.appendChild(tr);
    });
  }

  var supportCards = document.getElementById("support-cards");
  if (supportCards) {
    D.support.forEach(function (s) {
      var el = document.createElement("article");
      el.className = "card";
      el.tabIndex = 0;
      el.appendChild(textEl("h3", s.name));
      el.appendChild(textEl("p", s.detail));
      supportCards.appendChild(el);
    });
  }

  function renderEvents() {
    var ol = document.getElementById("event-list");
    if (!ol) return;
    ol.innerHTML = "";
    D.events.filter(function (ev) {
      if (sideFilter === "both") return true;
      return ev.side === sideFilter || ev.side === "both";
    }).sort(function (a, b) {
      var aKnown = navalTimeLabel(a) !== "Saat doğrulanmadı";
      var bKnown = navalTimeLabel(b) !== "Saat doğrulanmadı";
      if (aKnown !== bKnown) return aKnown ? -1 : 1;
      if (aKnown && bKnown) return a.sourceTime.time.localeCompare(b.sourceTime.time);
      return 0;
    }).forEach(function (ev) {
      var li = document.createElement("li");
      li.className = ev.side;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.appendChild(textEl("span", navalTimeLabel(ev), "event-time-status"));
      btn.appendChild(textEl("h3", ev.title));
      btn.appendChild(textEl("p", "Taslak anlatı: " + ev.text));
      btn.addEventListener("click", function () {
        stopPlay();
        navalMinute = ev.m;
        if (mode !== "naval") setMode("naval");
        range.value = String(ev.m);
        showTime(ev.m, true, ev);
        focusSelectedPanel(this);
        trackMapSelect("olay");
      });
      li.appendChild(btn);
      ol.appendChild(li);
    });
  }
  renderEvents();

  var kronFilters = document.getElementById("kron-filters");
  if (kronFilters) kronFilters.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-side]");
    if (!b) return;
    setSide(b.getAttribute("data-side"));
  });

  function renderCampList() {
    var ol = document.getElementById("camp-list");
    if (!ol || !D.campaign) return;
    var list = campEvents();
    var results = document.getElementById("camp-results");
    if (results) {
      var gaps = list.filter(function (ev) { return ev.quiet; }).length;
      results.textContent = list.length ? list.length + " / " + D.campaign.events.length + " kayıt gösteriliyor." +
        (gaps ? " Bunların " + gaps + " tanesi aralık notudur; ayrı bir muharebe değildir." : "") :
        "Bu süzgeçte kayıt bulunamadı. Tümü veya Temizle ile bütün kayıtları gösterebilirsiniz.";
    }
    ol.innerHTML = "";
    list.forEach(function (ev) {
      var li = document.createElement("li");
      li.id = "event-" + ev.id;
      li.className = (ev.side === "osmanli" ? "turk" : ev.side === "itilaf" ? "itilaf" : "both") + (ev.quiet ? " quiet" : "");
      var btn = document.createElement("button");
      btn.type = "button";
      var meta = document.createElement("div");
      meta.className = "meta";
      var t1 = document.createElement("span");
      t1.className = "tag";
      t1.textContent = sideLabel(ev.side);
      var t2 = document.createElement("span");
      t2.className = "tag";
      t2.textContent = domainLabel(ev.domain);
      if (ev.quiet) {
        var tQuiet = document.createElement("span");
        tQuiet.className = "tag";
        tQuiet.textContent = "Aralık notu";
        meta.appendChild(tQuiet);
      } else if (ev.battle) {
        var t3 = document.createElement("span");
        t3.className = "tag";
        t3.textContent = "Muharebe";
        meta.appendChild(t3);
      }
      meta.appendChild(t1);
      meta.appendChild(t2);
      var time = document.createElement("time");
      time.textContent = ev.date;
      var h = document.createElement("h3");
      h.textContent = ev.title;
      var p = document.createElement("p");
      p.textContent = ev.text;
      btn.appendChild(meta);
      btn.appendChild(time);
      btn.appendChild(h);
      btn.appendChild(p);
      btn.addEventListener("click", function () {
        focusCampEvent(ev, true);
        focusSelectedPanel(this);
      });
      li.appendChild(btn);
      if (ev.chronologySource) {
        var sourceNote = document.createElement("a");
        sourceNote.className = "event-page-link";
        sourceNote.href = "/olaylar/" + slugify(ev.title) + "/";
        sourceNote.textContent = "Olay sayfası";
        li.appendChild(sourceNote);
      }
      var pageHref = eventPageHref(ev);
      var safePage = localHref(pageHref);
      if (safePage) {
        var more = document.createElement("a");
        more.className = "event-page-link";
        more.href = safePage;
        more.textContent = "Olay sayfası";
        li.appendChild(more);
      }
      ol.appendChild(li);
    });
  }

  function setCampFilter(f) {
    if (f === "all") {
      clearFilters();
      return;
    }
    if (f === "osmanli" || f === "itilaf") {
      if (campSide === f) setSide("both");
      else setSide(f === "osmanli" ? "turk" : "itilaf");
      return;
    }
    if (f === "deniz" || f === "kara") setDomain(campDomain === f ? "all" : f);
  }

  var campFilters = document.getElementById("camp-filters");
  if (campFilters) {
    campFilters.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-camp]");
      if (!b) return;
      setCampFilter(b.getAttribute("data-camp"));
    });
  }
  renderCampList();
  renderSelectedDay();

  function fillCommand(list, elId) {
    var box = document.getElementById(elId);
    if (!box) return;
    list.forEach(function (c) {
      var card = document.createElement("article");
      card.className = "card";
      var h = document.createElement("h3");
      h.textContent = c.name;
      var who = document.createElement("div");
      who.className = "who";
      who.textContent = c.role;
      var p = document.createElement("p");
      p.textContent = c.body;
      card.appendChild(h);
      card.appendChild(who);
      card.appendChild(p);
      var row = document.createElement("div");
      row.className = "card-links";
      if (c.place) {
        var go = document.createElement("button");
        go.type = "button";
        go.className = "text-btn";
        go.textContent = "Haritada göster";
        go.addEventListener("click", function () { goPlace(c.place); });
        row.appendChild(go);
      }
      var more = document.createElement("a");
      more.href = localHref(c.page) || "/komutanlar/" + slugify(c.name) + "/";
      more.textContent = "Sayfa";
      row.appendChild(more);
      card.appendChild(row);
      box.appendChild(card);
    });
  }

  if (D.campaign) {
    fillCommand(D.campaign.command.osmanli, "cmd-osmanli");
    fillCommand(D.campaign.command.itilaf, "cmd-itilaf");

    var osRows = document.getElementById("osmanli-rows");
    if (osRows) {
      D.campaign.navy.osmanli.forEach(function (s) {
        var tr = document.createElement("tr");
        if (s.place) {
          tr.setAttribute("data-place", s.place);
          tr.addEventListener("click", function () { goPlace(s.place); });
        }
        [s.name, s.type, s.march, s.later].forEach(function (cell) {
          var td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        osRows.appendChild(tr);
      });
    }

    var laterRows = document.getElementById("later-rows");
    if (laterRows) {
      D.campaign.navy.later.forEach(function (s) {
        var tr = document.createElement("tr");
        if (s.place) {
          tr.setAttribute("data-place", s.place);
          tr.addEventListener("click", function () { goPlace(s.place); });
        }
        [s.name, s.type, s.note].forEach(function (cell) {
          var td = document.createElement("td");
          td.textContent = cell;
          tr.appendChild(td);
        });
        laterRows.appendChild(tr);
      });
    }

    var src = document.getElementById("source-list");
    if (src) {
      D.campaign.sources.forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        src.appendChild(li);
      });
    }
  }

  var ammoRows = document.getElementById("ammo-rows");
  if (ammoRows) {
    D.ammo.forEach(function (r) {
      var tr = document.createElement("tr");
      fillCells(tr, [r.k, r.tr, r.al]);
      ammoRows.appendChild(tr);
    });
  }

  var fortPlace = {
    "Rumeli Mecidiye": "mecidiye",
    Dardanos: "dardanos",
    "Anadolu Hamidiye": "anadolu-hamidiye",
    "Namazgâh": "namazgah",
    "Çimenlik": "cimenlik",
    "Rumeli Hamidiye": "rumeli-hamidiye",
    "Mesudiye / Yıldız / Baykuş": "mesudiye"
  };
  var fortRows = document.getElementById("fort-rows");
  if (fortRows) {
  D.fortHits.forEach(function (r) {
    var tr = document.createElement("tr");
    var match = D.places.find(function (p) { return p.id === fortPlace[r.name]; });
    if (match) {
      tr.setAttribute("data-place", match.id);
      tr.addEventListener("click", function () { goPlace(match.id); });
    }
    fillCells(tr, [r.name, r.loc, r.n, r.d]);
    fortRows.appendChild(tr);
  });
  }

  var dardanosCmd = document.getElementById("dardanos-cmd");
  if (dardanosCmd) {
  D.dardanosPeople.cmd.forEach(function (c) {
    var p = document.createElement("p");
    p.appendChild(textEl("strong", (c.r || "") + ":"));
    p.appendChild(document.createTextNode(" " + (c.n || "")));
    dardanosCmd.appendChild(p);
  });
  }
  var dardanosFallen = document.getElementById("dardanos-fallen");
  if (dardanosFallen) {
  D.dardanosPeople.fallen.forEach(function (n) {
    var li = document.createElement("li");
    li.textContent = n;
    document.getElementById("dardanos-fallen").appendChild(li);
  });
  }

  function slugify(str) {
    var s = String(str).replace(/İ/g, "i").replace(/I/g, "ı");
    s = s.toLocaleLowerCase("tr");
    var map = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u", "é": "e", "è": "e", "ê": "e", "á": "a", "à": "a", "ô": "o", "ó": "o", "ú": "u", "ñ": "n" };
    s = s.replace(/[çğıöşüâîûéèêáàôóúñ]/g, function (ch) { return map[ch] || ch; });
    s = s.replace(/['’´`]/g, "");
    s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return s;
  }

  function eventPageHref(ev) {
    if (!ev || ev.quiet || ev.chronologySource || ev.id === "e-nisan2627") return "";
    return "/olaylar/" + slugify(ev.title) + "/";
  }

  function findCampByKey(key) {
    if (!D.campaign || !key) return null;
    var k = String(key).replace(/^#/, "");
    try { k = decodeURIComponent(k); } catch (err) { /* keep raw */ }
    k = k.replace(/^event-/, "").replace(/^olay-/, "");
    var found = null;
    D.campaign.events.forEach(function (ev) {
      if (found) return;
      if (ev.id === k || ev.id === "e-" + k) found = ev;
      else if (slugify(ev.title) === k || slugify(ev.title) === slugify(k)) found = ev;
    });
    return found;
  }

  function bindNav() {
    var navToggle = document.getElementById("nav-toggle");
    var navPanel = document.getElementById("nav-panel");
    if (!navToggle || !navPanel) return;
    navPanel.setAttribute("data-enhanced", "true");
    navToggle.hidden = false;
    navToggle.addEventListener("click", function () {
      var open = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navPanel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navPanel.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    function closeNav(restoreFocus) {
      navPanel.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) navToggle.focus();
    }
    document.addEventListener("click", function (e) {
      var anchor = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      var href = anchor && anchor.getAttribute ? anchor.getAttribute("href") : "";
      if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !(e.button > 0) &&
          ["#kronoloji", "#giris", "#secilmis"].indexOf(href) !== -1) {
        panelRevision += 1;
        stopPlay();
      }
      if (navPanel.classList.contains("is-open") && !navPanel.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav(navPanel.contains(document.activeElement));
      }
    });
    var mobileNav = window.matchMedia("(max-width: 860px)");
    document.addEventListener("focusin", function (event) {
      if (mobileNav.matches && navPanel.classList.contains("is-open") && !navPanel.contains(event.target) && !navToggle.contains(event.target)) closeNav(false);
    });
    mobileNav.addEventListener("change", function () {
      closeNav(mobileNav.matches && navPanel.contains(document.activeElement));
    });
  }

  function consumeDeepLink() {
    var requestedRevision = panelRevision;
    var params = null;
    try { params = new URLSearchParams(window.location.search); } catch (err) { params = null; }
    var olay = params ? params.get("olay") : "";
    var hash = window.location.hash || "";
    var hasHashEvent = hash.indexOf("#event-") === 0;
    var selections = ["olay", "mevki", "dakika", "deniz"];
    var duplicate = params && selections.some(function (key) { return params.getAll(key).length > 1; });
    var conflicting = params && (
      (params.has("olay") && (params.has("mevki") || params.has("dakika") || params.has("deniz"))) ||
      (params.has("mevki") && (params.has("dakika") || params.has("deniz"))) ||
      (hasHashEvent && (params.has("mevki") || params.has("dakika") || params.has("deniz")))
    );
    if (duplicate || conflicting) { notFound("kayıt seçimi", true); return; }
    if (params && params.has("deniz") && !params.has("dakika")) { notFound("zaman kaydı"); return; }
    var hasEventRequest = !!(params && params.has("olay")) || hash.indexOf("#event-") === 0;
    var ev = olay ? findCampByKey(olay) : null;
    if (hasHashEvent && params && params.has("olay")) {
      var hashEvent = findCampByKey(hash.slice(1));
      if (!ev || !hashEvent || ev.id !== hashEvent.id) { notFound("kayıt seçimi", true); return; }
    }
    if (!(params && params.has("olay")) && hasHashEvent) ev = findCampByKey(hash.slice(1));
    if (ev) {
      window.setTimeout(function () {
        if (panelRevision !== requestedRevision) return;
        var stage = document.getElementById("harita");
        if (stage) stage.scrollIntoView({ behavior: "auto", block: "start" });
        focusCampEvent(ev);
        var row = document.getElementById("event-" + ev.id);
        if (row) row.classList.add("is-target");
        if (map) map.invalidateSize();
        restoreAtlasView(function () { focusCampEvent(ev, true); });
      }, 350);
      return;
    }
    function notFound(kind, conflict) {
      var notice = document.getElementById("deep-link-notice");
      var message = document.getElementById("deep-link-message");
      if (!notice || !message) return;
      var heading = document.getElementById("deep-link-heading");
      if (heading) heading.textContent = conflict ? "Bağlantıdaki seçim belirsiz" : "Kayıt bulunamadı";
      message.textContent = (conflict ? "Bağlantıda birden fazla veya çelişkili kayıt seçimi var." : "Bağlantıdaki " + kind + " bu atlasta bulunamadı.") + " Harita başlangıç görünümünü gösteriyor; bağlantıdaki kayıt seçilmedi.";
      notice.hidden = false;
      notice.scrollIntoView({ behavior: "auto", block: "center" });
    }
    if (hasEventRequest) {
      notFound("olay");
      return;
    }
    var mevki = params ? params.get("mevki") : "";
    if (mevki && findPlace(mevki)) {
      window.setTimeout(function () {
        if (panelRevision !== requestedRevision) return;
        scrollToMap();
        openPlace(mevki, true);
        if (map) map.invalidateSize();
        restoreAtlasView(function () { openPlace(mevki, false); });
      }, 350);
    } else if (params && params.has("mevki")) {
      notFound("mevki");
    } else if (params && params.has("dakika")) {
      var minuteKey = params.get("dakika") || "";
      var minute = /^\d{1,4}$/.test(minuteKey) ? Number(minuteKey) : -1;
      var eventKey = params.get("deniz");
      var navalEvent = (D.events || []).find(function (item) {
        return item.m === minute && (eventKey === null || slugify(item.title) === eventKey);
      });
      if (!navalEvent) {
        notFound("zaman kaydı");
        return;
      }
      window.setTimeout(function () {
        if (panelRevision !== requestedRevision) return;
        if (mode !== "naval") setMode("naval");
        navalMinute = minute;
        range.value = String(minute);
        showTime(minute, true, eventKey === null ? null : navalEvent);
        revealDock();
        var stage = document.getElementById("harita");
        if (stage) stage.scrollIntoView({ behavior: "auto", block: "start" });
        if (map) map.invalidateSize();
        restoreAtlasView(function () { showTime(minute, false, eventKey === null ? null : navalEvent); });
      }, 350);
    }
  }

  function bindDock() {
    var dockBtn = document.getElementById("dock-toggle");
    if (dockBtn) dockBtn.addEventListener("click", function () {
      var root = document.body;
      if (!root || !root.classList) return;
      var collapsed = root.classList.toggle("is-dock-collapsed");
      dockBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
      dockBtn.textContent = collapsed ? "Panel" : "Gizle";
      dockBtn.setAttribute("aria-label", collapsed ? "Kontrol panelini göster" : "Kontrol panelini gizle");
      if (map && map.invalidateSize) setTimeout(function () { map.invalidateSize(); }, motionOn() ? 60 : 0);
    });
    function wireTool(id, cls) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", function () {
        var root = document.body;
        if (!root || !root.classList) return;
        var willOpen = !root.classList.contains(cls);
        closeTools();
        if (!willOpen) return;
        panelRevision += 1;
        stopPlay();
        root.classList.add(cls);
        btn.setAttribute("aria-expanded", "true");
        if (id === "tool-search") {
          var input = document.getElementById("q");
          if (input && input.focus) input.focus();
        }
      });
    }
    wireTool("tool-search", "is-search-open");
    wireTool("tool-filter", "is-filter-open");
    wireTool("tool-layers", "is-layer-open");
    var compactTools = window.matchMedia("(max-width: 1099px)");
    compactTools.addEventListener("change", function () { syncToolLayout(compactTools.matches); });
    var clearBtn = document.getElementById("filter-clear");
    if (clearBtn) clearBtn.addEventListener("click", clearFilters);
    var campClear = document.getElementById("camp-clear");
    if (campClear) campClear.addEventListener("click", clearFilters);
    var prev = document.getElementById("tl-prev");
    var next = document.getElementById("tl-next");
    if (prev) prev.addEventListener("click", function () { stepTime(-1); });
    if (next) next.addEventListener("click", function () { stepTime(1); });
  }

  bindNav();
  bindDock();
  renderEvents();
  renderCampList();
  showTime(Number(range.value) || 450, false);
  updateFilterStatus();
  consumeDeepLink();
  setTimeout(function () { if (map) map.invalidateSize(); }, 200);
  var pinTouch = window.matchMedia("(max-width: 860px)").matches;
  window.addEventListener("resize", function () {
    if (map) map.invalidateSize();
    var nextTouch = window.matchMedia("(max-width: 860px)").matches;
    if (nextTouch !== pinTouch) {
      pinTouch = nextTouch;
      paintIcons();
    }
  });
})();
