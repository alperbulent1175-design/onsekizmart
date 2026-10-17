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
    var term = fold(search.value.trim());
    var visible = 0;
    groups.forEach(function (group) {
      var matches = 0;
      group.rows.forEach(function (row) {
        var show = (category.value === "all" || category.value === group.id) && fold(row.textContent).includes(term);
        row.hidden = !show;
        if (show) matches++;
      });
      group.section.hidden = matches === 0;
      group.subgroups.forEach(function (section) {
        section.hidden = !Array.from(section.querySelectorAll(".roster > li")).some(function (row) { return !row.hidden; });
      });
      visible += matches;
    });
    count.textContent = visible ? visible + " olay gösteriliyor." : "Eşleşen olay bulunamadı. Aramayı veya bölümü değiştirin.";
  }
  function applySelection() {
    filter();
    updateLocation();
  }
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
  window.addEventListener("popstate", function () { readLocation(); filter(); });
  window.addEventListener("pageshow", function () { readLocation(); filter(); });
})();
