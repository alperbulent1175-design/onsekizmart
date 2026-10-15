(function () {
  "use strict";
  var D = window.OM;
  if (!D) return;
  var Model = window.OMModel;

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

  function showMapError(message) {
    var host = document.getElementById("map");
    if (!host) return;
    var box = document.createElement("div");
    box.className = "map-fallback";
    box.setAttribute("role", "alert");
    box.appendChild(textEl("p", message + " Kronoloji ve olay listesi kullanılabilir."));
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
    note.className = "map-tile-note";
    note.setAttribute("role", "status");
    note.appendChild(document.createTextNode("Harita karoları yüklenemedi. İşaretler duruyor. "));
    var retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Karoları yeniden dene";
    retry.addEventListener("click", function () {
      tileWarned = false;
      if (note.parentNode) note.parentNode.removeChild(note);
      if (tiles && tiles.uydu && tiles.uydu.redraw) tiles.uydu.redraw();
      if (tiles && tiles.yol && map && map.hasLayer(tiles.yol) && tiles.yol.redraw) tiles.yol.redraw();
    });
    note.appendChild(retry);
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
        zoomControl: true,
        attributionControl: true,
        minZoom: 8,
        maxZoom: 16
      }).setView(D.center, D.defaultZoom);
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
      tiles.uydu.on("tileerror", noteTileFailure);
      tiles.yol.on("tileerror", noteTileFailure);
      tiles.uydu.addTo(map);
      L.control.layers({ Uydu: tiles.uydu, "Yol haritası": tiles.yol }, null, { position: "bottomright" }).addTo(map);
      return true;
    } catch (err) {
      map = null;
      showMapError("Harita açılamadı.");
      return false;
    }
  }

  var mapReady = bootMap();
  var activeId = null;
  var mode = "naval";
  var sideFilter = "both";
  var campFilter = "all";
  var campIndex = 0;
  var navalMinute = 450;
  var playing = false;
  var playTimer = null;

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

  function paintIcons() {
    Object.keys(markers).forEach(function (k) {
      var pl = findPlace(k);
      if (pl) markers[k].setIcon(iconFor(pl.type, k === activeId));
    });
  }

  function openPlace(id, fly) {
    var p = findPlace(id);
    if (!p) return;
    activeId = id;
    paintIcons();
    if (map && fly !== false) {
      map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 13), { duration: motionOn() ? 0.85 : 0 });
    }
    var panel = document.getElementById("panel");
    document.getElementById("panel-title").textContent = p.name;
    document.getElementById("panel-meta").textContent = p.meta || "";
    var body = document.getElementById("panel-body");
    if (body.replaceChildren) body.replaceChildren();
    else body.innerHTML = "";
    if (p.hits) body.appendChild(textEl("span", p.hits, "hits"));
    if (p.strength) body.appendChild(textEl("span", p.strength, "hits"));
    (p.note || []).forEach(function (n) { body.appendChild(textEl("p", n)); });
    body.appendChild(textEl("p", accuracyText(p)));
    body.appendChild(textEl("p", sourceText(p)));
    var related = [];
    if (D.campaign) {
      related = D.campaign.events.filter(function (ev) { return ev.place === id; });
    }
    if (related.length) {
      body.appendChild(textEl("h3", "Bu mevkideki sefer olayları"));
      related.forEach(function (ev) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ev-btn";
        btn.setAttribute("data-camp", ev.id);
        btn.appendChild(textEl("strong", ev.date));
        btn.appendChild(document.createTextNode(" " + (ev.title || "")));
        body.appendChild(btn);
        var pageHref = localHref(eventPageHref(ev));
        if (pageHref) {
          var link = document.createElement("a");
          link.className = "event-page-link";
          link.href = pageHref;
          link.textContent = "Olay sayfası";
          body.appendChild(link);
        }
      });
    }
    panel.classList.add("open");
    panel.inert = false;
    var search = document.querySelector(".search");
    if (search) search.classList.add("is-hidden");
  }

  function closePanel() {
    activeId = null;
    var panel = document.getElementById("panel");
    panel.classList.remove("open");
    panel.inert = true;
    var search = document.querySelector(".search");
    if (search) search.classList.remove("is-hidden");
    paintIcons();
  }

  function addMarker(p) {
    var m = L.marker([p.lat, p.lng], { icon: iconFor(p.type), title: p.name })
      .addTo(groups[p.type] || groups.tabya)
      .on("click", function () { openPlace(p.id, false); });
    m.bindTooltip(p.name, { direction: "top", offset: [0, -12] });
    markers[p.id] = m;
  }

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
    pl.bindTooltip(ln.name);
    pl.on("click", function () {
      document.getElementById("panel-title").textContent = ln.name;
      document.getElementById("panel-meta").textContent = "Hat / manevra";
      var lineBody = document.getElementById("panel-body");
      if (lineBody.replaceChildren) lineBody.replaceChildren(textEl("p", ln.note));
      else lineBody.appendChild(textEl("p", ln.note));
      var panel = document.getElementById("panel");
      panel.classList.add("open");
      panel.inert = false;
      var lineSearch = document.querySelector(".search");
      if (lineSearch) lineSearch.classList.add("is-hidden");
    });
  });

  D.mineLines.forEach(function (ln) {
    L.polyline([ln.a, ln.b], {
      color: "#c9a227",
      weight: 1.5,
      dashArray: "4 8",
      opacity: 0.55
    }).addTo(groups.mayin).bindTooltip(ln.name + " · şematik gösterim");
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
    });
    if (layerBox) layerBox.appendChild(b);
  });
  applyDateLayers("naval");
  }

  document.getElementById("panel-close").addEventListener("click", closePanel);
  document.getElementById("panel-body").addEventListener("click", function (e) {
    var b = e.target.closest("[data-camp]");
    if (!b || !D.campaign) return;
    var ev = null;
    D.campaign.events.forEach(function (item) {
      if (item.id === b.getAttribute("data-camp")) ev = item;
    });
    if (ev) focusCampEvent(ev);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  var q = document.getElementById("q");
  var qRes = document.getElementById("q-results");
  q.addEventListener("input", function () {
    var v = q.value.trim().toLocaleLowerCase("tr");
    qRes.innerHTML = "";
    if (v.length < 2) { qRes.hidden = true; return; }
    allPlaces().filter(function (p) {
      return (p.name + " " + (p.meta || "")).toLocaleLowerCase("tr").indexOf(v) !== -1;
    }).slice(0, 8).forEach(function (p) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = p.name;
      btn.addEventListener("click", function () {
        openPlace(p.id);
        qRes.hidden = true;
        q.value = p.name;
      });
      li.appendChild(btn);
      qRes.appendChild(li);
    });
    qRes.hidden = qRes.childElementCount === 0;
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

  function eventsAt(m, side) {
    return D.events.filter(function (ev) {
      if (ev.m > m) return false;
      if (side === "both") return true;
      return ev.side === side || ev.side === "both";
    });
  }

  function showTime(m, fly) {
    clock.textContent = minsToClock(m);
    var list = eventsAt(m, sideFilter);
    var last = list[list.length - 1];
    if (!last) {
      tlEvent.replaceChildren(textEl("em", minsToClock(m)), document.createTextNode(" Bu saatten önce kayıtlı olay yok."));
      return;
    }
    tlEvent.replaceChildren(textEl("em", last.t), document.createTextNode(" " + last.title + " — " + last.text));
    if (fly && last.place) openPlace(last.place);
  }

  function sideLabel(s) {
    if (s === "osmanli") return "Osmanlı";
    if (s === "itilaf") return "İtilaf";
    return "İki taraf";
  }

  function domainLabel(d) {
    if (d === "deniz") return "Deniz";
    if (d === "kara") return "Kara";
    return "Deniz ve kara";
  }

  function campEvents() {
    if (!D.campaign) return [];
    return D.campaign.events.filter(function (ev) {
      if (campFilter === "all") return true;
      if (campFilter === "osmanli") return ev.side === "osmanli" || ev.side === "both";
      if (campFilter === "itilaf") return ev.side === "itilaf" || ev.side === "both";
      if (campFilter === "deniz") return ev.domain === "deniz" || ev.domain === "ikisi";
      if (campFilter === "kara") return ev.domain === "kara" || ev.domain === "ikisi";
      return true;
    });
  }

  function showCamp(i, fly) {
    var list = campEvents();
    var ev = list[i];
    campIndex = i;
    if (!ev) {
      clock.textContent = "—";
      tlEvent.textContent = "Bu süzgeçte olay yok.";
      return;
    }
    clock.textContent = ev.date;
    tlEvent.replaceChildren(textEl("em", ev.date), document.createTextNode(" " + ev.title + " — " + ev.text));
    if (fly && ev.place) openPlace(ev.place, true);
  }

  function stopPlay() {
    playing = false;
    var b = document.getElementById("tl-play");
    if (b) b.textContent = "Oynat";
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
  }

  function setMode(next) {
    stopPlay();
    if (mode === "naval") navalMinute = Number(range.value);
    if (mode === "camp") campIndex = Number(range.value);
    mode = next;
    document.getElementById("mode-18").setAttribute("aria-pressed", next === "naval" ? "true" : "false");
    document.getElementById("mode-camp").setAttribute("aria-pressed", next === "camp" ? "true" : "false");
    var navalSide = document.getElementById("naval-side");
    if (navalSide) navalSide.hidden = next !== "naval";
    if (hint) {
      hint.textContent = next === "naval"
        ? "Saat çubuğu 18 Mart 1915 günüdür."
        : "Gün çubuğu, Kronoloji süzgecindeki olayları gezer.";
    }
    applyDateLayers(next);
    if (next === "naval") {
      range.min = "450";
      range.max = "1350";
      range.step = "1";
      range.value = String(navalMinute);
      range.setAttribute("aria-label", "Saat");
      showTime(navalMinute, false);
    } else {
      var list = campEvents();
      range.min = "0";
      range.max = String(Math.max(0, list.length - 1));
      range.step = "1";
      if (campIndex >= list.length) campIndex = 0;
      range.value = String(campIndex);
      range.setAttribute("aria-label", "Sefer olayı");
      showCamp(campIndex, false);
    }
  }

  range.addEventListener("input", function () {
    if (mode === "camp") showCamp(Number(range.value), true);
    else showTime(Number(range.value), true);
  });

  function setSide(s) {
    sideFilter = s;
    document.getElementById("tl-both").setAttribute("aria-pressed", s === "both" ? "true" : "false");
    document.getElementById("tl-turk").setAttribute("aria-pressed", s === "turk" ? "true" : "false");
    document.getElementById("tl-itilaf").setAttribute("aria-pressed", s === "itilaf" ? "true" : "false");
    Array.prototype.forEach.call(document.querySelectorAll("#kron-filters .chip"), function (c) {
      c.setAttribute("aria-pressed", c.getAttribute("data-side") === s ? "true" : "false");
    });
    renderEvents();
    if (mode === "naval") showTime(Number(range.value), false);
  }
  document.getElementById("tl-both").addEventListener("click", function () { setSide("both"); });
  document.getElementById("tl-turk").addEventListener("click", function () { setSide("turk"); });
  document.getElementById("tl-itilaf").addEventListener("click", function () { setSide("itilaf"); });
  document.getElementById("mode-18").addEventListener("click", function () { setMode("naval"); });
  document.getElementById("mode-camp").addEventListener("click", function () { setMode("camp"); });

  document.getElementById("tl-play").addEventListener("click", function () {
    playing = !playing;
    this.textContent = playing ? "Durdur" : "Oynat";
    if (playTimer) clearInterval(playTimer);
    if (!playing) return;
    playTimer = setInterval(function () {
      if (mode === "camp") {
        var list = campEvents();
        if (!list.length) { stopPlay(); return; }
        var i = Number(range.value) + 1;
        if (i >= list.length) i = 0;
        range.value = String(i);
        showCamp(i, true);
        return;
      }
      var cur = Number(range.value);
      var next = D.events.find(function (ev) {
        if (ev.m <= cur) return false;
        if (sideFilter !== "both" && ev.side !== sideFilter && ev.side !== "both") return false;
        return true;
      });
      if (!next) {
        range.value = "450";
        showTime(450, true);
        return;
      }
      range.value = String(next.m);
      showTime(next.m, true);
    }, 2400);
  });

  showTime(450, false);

  function goPlace(id) {
    var stage = document.getElementById("harita");
    if (stage) stage.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "start" });
    setTimeout(function () { openPlace(id); }, motionOn() ? 250 : 0);
  }

  function openLoose(title, meta, text) {
    var stage = document.getElementById("harita");
    if (stage) stage.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "start" });
    document.getElementById("panel-title").textContent = title;
    document.getElementById("panel-meta").textContent = meta || "";
    document.getElementById("panel-body").replaceChildren(textEl("p", text));
    var panel = document.getElementById("panel");
    panel.classList.add("open");
    panel.inert = false;
    document.querySelector(".search").classList.add("is-hidden");
  }

  function focusCampEvent(ev) {
    if (ev.navalMinute) {
      navalMinute = ev.navalMinute;
      if (mode !== "naval") setMode("naval");
      else {
        range.value = String(navalMinute);
        showTime(navalMinute, false);
      }
      if (ev.place) goPlace(ev.place);
      else openLoose(ev.title, ev.date, ev.text);
      return;
    }
    if (campFilter !== "all") {
      var visible = campEvents().indexOf(ev);
      if (visible < 0) setCampFilter("all");
    }
    var list = campEvents();
    var idx = list.indexOf(ev);
    if (idx < 0) idx = 0;
    campIndex = idx;
    if (mode !== "camp") setMode("camp");
    range.max = String(Math.max(0, list.length - 1));
    range.value = String(idx);
    showCamp(idx, false);
    if (ev.place) goPlace(ev.place);
    else openLoose(ev.title, ev.date + " · haritada ayrı nokta yok", ev.text);
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
    }).forEach(function (ev) {
      var li = document.createElement("li");
      li.className = ev.side;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.appendChild(textEl("time", ev.t));
      btn.appendChild(textEl("h3", ev.title));
      btn.appendChild(textEl("p", ev.text));
      btn.addEventListener("click", function () {
        navalMinute = ev.m;
        if (mode !== "naval") setMode("naval");
        range.value = String(ev.m);
        showTime(ev.m, false);
        if (ev.place) goPlace(ev.place);
        else {
          var hourStage = document.getElementById("harita");
          if (hourStage) hourStage.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto" });
        }
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
    ol.innerHTML = "";
    campEvents().forEach(function (ev) {
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
      btn.addEventListener("click", function () { focusCampEvent(ev); });
      li.appendChild(btn);
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
    stopPlay();
    campFilter = f;
    Array.prototype.forEach.call(document.querySelectorAll("#camp-filters .chip"), function (c) {
      c.setAttribute("aria-pressed", c.getAttribute("data-camp") === f ? "true" : "false");
    });
    renderCampList();
    if (mode === "camp") {
      var list = campEvents();
      range.max = String(Math.max(0, list.length - 1));
      campIndex = 0;
      range.value = "0";
      showCamp(0, false);
    }
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
      more.href = "/komutanlar/" + slugify(c.name) + "/";
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
    if (!ev || ev.quiet || ev.id === "e-nisan2627") return "";
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
  }

  function consumeDeepLink() {
    var params = null;
    try { params = new URLSearchParams(window.location.search); } catch (err) { params = null; }
    var olay = params ? params.get("olay") : "";
    var hash = window.location.hash || "";
    var ev = olay ? findCampByKey(olay) : null;
    if (!ev && hash.indexOf("#event-") === 0) ev = findCampByKey(hash.slice(1));
    if (ev) {
      window.setTimeout(function () {
        var stage = document.getElementById("harita");
        if (stage) stage.scrollIntoView({ behavior: "auto", block: "start" });
        focusCampEvent(ev);
        var row = document.getElementById("event-" + ev.id);
        if (row) row.classList.add("is-target");
        if (map) map.invalidateSize();
      }, 350);
      return;
    }
    var mevki = params ? params.get("mevki") : "";
    if (mevki && findPlace(mevki)) {
      window.setTimeout(function () {
        goPlace(mevki);
        if (map) map.invalidateSize();
      }, 350);
    }
  }

  bindNav();
  showTime(Number(range.value) || 450, false);
  renderEvents();
  renderCampList();
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
