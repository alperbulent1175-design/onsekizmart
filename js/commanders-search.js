(function () {
  "use strict";
  var form = document.getElementById("commanders-search");
  if (!form) return;
  var query = document.getElementById("commanders-query");
  var side = document.getElementById("commanders-side");
  var clear = document.getElementById("commanders-clear");
  var status = document.getElementById("commanders-results");
  var share = document.getElementById("commanders-search-link");
  function fold(value) {
    return String(value).toLocaleLowerCase("tr").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");
  }
  var groups = ["osmanli", "itilaf"].map(function (id) {
    var section = document.getElementById(id);
    return { id: id, section: section, lists: Array.from(section.querySelectorAll(".roster")).map(function (list) {
      return { list: list, heading: list.previousElementSibling,
        rows: Array.from(list.querySelectorAll("li")).map(function (row) {
          return { row: row, text: fold(row.textContent), link: row.querySelector("a") };
        }) };
    }) };
  });
  var total = groups.reduce(function (sum, group) {
    return sum + group.lists.reduce(function (count, list) { return count + list.rows.length; }, 0);
  }, 0);
  function filter() {
    var terms = fold(query.value.trim()).split(/\s+/).filter(Boolean);
    var first = null, count = 0;
    groups.forEach(function (group) {
      var groupCount = 0;
      group.lists.forEach(function (list) {
        var listCount = 0;
        list.rows.forEach(function (entry) {
          var show = (side.value === "all" || side.value === group.id) && terms.every(function (term) { return entry.text.indexOf(term) !== -1; });
          entry.row.hidden = !show;
          if (show) { listCount++; if (!first) first = entry; }
        });
        list.list.hidden = !listCount;
        if (list.heading && list.heading.tagName === "H3") list.heading.hidden = !listCount;
        groupCount += listCount;
      });
      group.section.hidden = !groupCount;
      count += groupCount;
    });
    clear.disabled = !query.value && side.value === "all";
    status.textContent = count ? count + " / " + total + " komutan kaydı gösteriliyor." : "Eşleşen komutan bulunamadı. Adı veya taraf seçimini değiştirin; Temizle ile tüm kayıtları görün.";
    var params = new URLSearchParams();
    if (query.value.trim()) params.set("q", query.value.trim());
    if (side.value !== "all") params.set("taraf", side.value);
    share.href = "/komutanlar/" + (params.toString() ? "?" + params.toString() : "") + "#commanders-search";
    groups.forEach(function (group) {
      group.lists.forEach(function (list) {
        list.rows.forEach(function (entry) {
          try {
            var destination = new URL(entry.link.href, window.location.href);
            if (destination.origin !== window.location.origin || !/^\/komutanlar\/[^/]+\/$/.test(destination.pathname)) return;
            destination.searchParams.set("komutanlaraDon", share.getAttribute("href"));
            entry.link.href = destination.pathname + destination.search + destination.hash;
          } catch (error) { /* Editorial links stay usable if they cannot be rewritten. */ }
        });
      });
    });
    return first;
  }
  function edit() {
    filter();
    try {
      var url = new URL(window.location.href);
      var params = new URL(share.href, url).searchParams;
      ["q", "taraf"].forEach(function (key) {
        if (params.has(key)) url.searchParams.set(key, params.get(key));
        else url.searchParams.delete(key);
      });
      window.history.replaceState(window.history.state, "", url.href);
    } catch (error) { /* The search also works when history access is unavailable. */ }
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var first = filter();
    var target = first ? first.link : status;
    target.focus({ preventScroll: true });
    (first ? first.row : status).scrollIntoView({ block: "start" });
  });
  query.addEventListener("input", edit);
  query.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !query.value) return;
    event.preventDefault();
    query.value = "";
    edit();
  });
  side.addEventListener("change", edit);
  clear.addEventListener("click", function () { query.value = ""; side.value = "all"; edit(); query.focus(); });
  function reveal(hash) {
    var id;
    try { id = decodeURIComponent((typeof hash === "string" ? hash : window.location.hash).slice(1)); } catch (error) { return; }
    if (id === "commanders-search") { query.focus(); return; }
    var group = groups.find(function (item) { return item.id === id; });
    if (group && group.section.hidden) {
      query.value = "";
      side.value = id;
      edit();
      group.section.scrollIntoView({ block: "start" });
    }
  }
  var restoredHref = "";
  window.addEventListener("hashchange", function () {
    if (restoredHref === window.location.href) { restoredHref = ""; return; }
    restoredHref = "";
    reveal();
  });
  window.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0)) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (link) reveal(link.getAttribute("href"));
  });
  function readLocation() {
    var params = new URLSearchParams(window.location.search);
    query.value = (params.get("q") || "").slice(0, 200);
    side.value = ["osmanli", "itilaf"].indexOf(params.get("taraf")) !== -1 ? params.get("taraf") : "all";
    filter();
  }
  window.addEventListener("popstate", function () {
    restoredHref = window.location.href;
    readLocation();
    if (window.location.hash === "#commanders-search") query.focus();
  });
  window.addEventListener("pageshow", readLocation);
  form.hidden = false;
  readLocation();
  if (window.location.hash && window.location.hash !== "#commanders-search") reveal();
})();
