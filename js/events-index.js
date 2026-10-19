(function () {
  "use strict";
  var tools = document.getElementById("events-tools");
  var results = document.getElementById("events-results");
  if (!tools || !results) return;
  var search = document.getElementById("events-query");
  var category = document.getElementById("events-category");
  var count = document.getElementById("events-count");
  var clear = document.getElementById("events-clear");
  function readLocation() {
    try {
      var params = new URLSearchParams(window.location.search);
      search.value = params.get("q") || "";
      var requested = params.get("bolum");
      category.value = ["deniz", "kara", "tahliye"].indexOf(requested) >= 0 ? requested : "all";
    } catch (err) { /* Bağlantı okunamasa da yerel süzgeç çalışır. */ }
  }
  function updateLocation() {
    try {
      var url = new URL(window.location.href);
      var term = search.value.trim();
      if (term) url.searchParams.set("q", term);
      else url.searchParams.delete("q");
      if (category.value !== "all") url.searchParams.set("bolum", category.value);
      else url.searchParams.delete("bolum");
      // Her tuş için yeni bir geçmiş kaydı açma; diğer parametreleri ve bölümü koru.
      if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url.href);
    } catch (err) { /* Geçmiş erişimi kapalıysa arama kullanılamaz hale gelmez. */ }
  }
  function fold(value) {
    return String(value).toLocaleLowerCase("tr").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");
  }
  var groups = ["deniz", "kara", "tahliye"].map(function (id) {
    var section = document.getElementById(id);
    return {
      id: id, section: section,
      rows: Array.from(section.querySelectorAll(".roster > li")),
      subgroups: Array.from(section.querySelectorAll("section"))
    };
  });
  function filter() {
    var terms = fold(search.value.trim()).split(/\s+/).filter(Boolean);
    var visible = 0;
    groups.forEach(function (group) {
      var matches = 0;
      group.rows.forEach(function (row) {
        var text = fold(row.textContent);
        var show = (category.value === "all" || category.value === group.id) && terms.every(function (term) { return text.includes(term); });
        row.hidden = !show;
        if (show) matches++;
      });
      group.section.hidden = matches === 0;
      group.subgroups.forEach(function (section) {
        section.hidden = !Array.from(section.querySelectorAll(".roster > li")).some(function (row) { return !row.hidden; });
      });
      visible += matches;
    });
    var returnParams = new URLSearchParams();
    if (search.value.trim()) returnParams.set('q', search.value.trim());
    if (category.value !== 'all') returnParams.set('bolum', category.value);
    var back = '/olaylar/' + (returnParams.toString() ? '?' + returnParams.toString() : '') + '#events-tools';
    groups.forEach(function (group) {
      group.rows.forEach(function (row) {
        var link = row.querySelector ? row.querySelector('a') : null;
        if (!link) return;
        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || !/^\/olaylar\/[^/]+\/$/.test(url.pathname)) return;
        url.searchParams.set('listeyeDon', back);
        link.href = url.pathname + url.search + url.hash;
      });
    });
    count.textContent = visible ? visible + " olay gösteriliyor." : "Eşleşen olay bulunamadı. Aramayı veya bölümü değiştirin.";
  }
  function applySelection() {
    filter();
    updateLocation();
  }
  var restoredHref = "";
  function revealSection(hash) {
    var id;
    try { id = decodeURIComponent((typeof hash === "string" ? hash : window.location.hash).slice(1)); } catch (err) { return; }
    var target = null;
    var owner = null;
    groups.some(function (group) {
      if (group.id === id) { target = group.section; owner = group; return true; }
      return group.subgroups.some(function (section) {
        if (section.id !== id) return false;
        target = section; owner = group; return true;
      });
    });
    if (!target || (!target.hidden && !owner.section.hidden)) return;
    search.value = "";
    category.value = owner.id;
    applySelection();
    if (target.scrollIntoView) target.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", function () {
    if (restoredHref === window.location.href) { restoredHref = ""; return; }
    restoredHref = "";
    revealSection();
  });
  window.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0)) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    var url;
    try { url = new URL(link.getAttribute('href'), window.location.href); } catch (err) { return; }
    if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search) revealSection(url.hash);
  });
  search.addEventListener("input", applySelection);
  category.addEventListener("change", applySelection);
  clear.addEventListener("click", function () {
    search.value = "";
    category.value = "all";
    applySelection();
    search.focus();
  });
  tools.hidden = false;
  readLocation();
  filter();
  window.addEventListener("popstate", function () { restoredHref = window.location.href; readLocation(); filter(); });
  window.addEventListener("pageshow", function () { readLocation(); filter(); });
})();
