/* Kaynak çerçevesi ve kayıt durumu.
   Sayfa veya belge numarası yoksa kayıt "doğrulanmış" sayılmaz.
   Belge, kullanım hakkı "izinli" değilse yayımlanmaz. */
(function (root) {
  var catalog = [
    {
      id: "atase",
      kind: "ikincil",
      institution: "Genelkurmay ATASE",
      title: "Yayımlanmış Çanakkale sefer özetleri",
      page: null,
      documentNo: null,
      url: null,
      scope: "kurum",
      claimSupport: false
    },
    {
      id: "awm",
      kind: "ikincil",
      institution: "Australian War Memorial",
      title: "Gallipoli kronolojileri",
      page: null,
      documentNo: null,
      url: "https://www.awm.gov.au/",
      scope: "kurum",
      claimSupport: false
    },
    {
      id: "iwm",
      kind: "ikincil",
      institution: "Imperial War Museum",
      title: "Gallipoli anlatıları",
      page: null,
      documentNo: null,
      url: "https://www.iwm.org.uk/",
      scope: "kurum",
      claimSupport: false
    }
  ];

  var archive = {
    fields: ["id", "title", "date", "kind", "institution", "documentNo", "url", "rights", "eventIds"],
    documents: []
  };

  function byId(id) {
    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === id) return catalog[i];
    }
    return null;
  }

  function sourceIdsFor(item) {
    if (item.sourceIds && item.sourceIds.length) return item.sourceIds.slice();
    var ids = ["atase"];
    var side = item.side || "";
    if (side === "itilaf" || side === "both" || item.type === "gemi" || item.type === "enkaz") {
      ids.push("awm", "iwm");
    }
    return ids;
  }

  function hasPageCitation(ids) {
    return ids.every(function (id) {
      var src = byId(id);
      return src && src.page && src.documentNo;
    });
  }

  function annotate(item) {
    if (!item || typeof item !== "object") return item;
    item.sourceIds = sourceIdsFor(item);
    if (!item.accuracy) item.accuracy = item.schematic ? "sema" : "yaklasik";
    if (!item.uncertainty) {
      item.uncertainty = item.accuracy === "sema"
        ? "Şematik gösterim. Kesin hat geometrisi değildir."
        : "Mevki veya saha merkezi. Kesin koordinat değildir.";
    }
    item.verification = hasPageCitation(item.sourceIds) ? "sayfa" : "cerceve";
    if (item.quiet) item.recordStatus = "aralik-notu";
    else if (item.title) item.recordStatus = item.recordStatus || "olay";
    return item;
  }

  function eventsOnDate(events, date) {
    return (events || []).filter(function (ev) {
      return ev && ev.date === date && !ev.quiet;
    });
  }

  function dayMessage(events, date) {
    var hits = eventsOnDate(events, date);
    if (hits.length) return { status: "olay", events: hits };
    return {
      status: "kayit-yok",
      text: date + " için kronolojide olay kaydı yok. Sahte olay eklenmedi."
    };
  }

  function publishable(doc) {
    return !!(doc && doc.rights === "izinli" && doc.title && doc.date);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeUrl(value) {
    var s = String(value == null ? "" : value).trim();
    if (!s || /[\u0000-\u001F\s]/.test(s)) return "";
    if (s.indexOf("//") === 0) return "";
    if (s.charAt(0) === "/" || s.charAt(0) === "#" || s.charAt(0) === "?") return s;
    var match = s.match(/^([a-z][a-z0-9+.-]*):/i);
    if (!match) return "";
    if (match[1].toLowerCase() === "https" || match[1].toLowerCase() === "http") return s;
    return "";
  }

  root.OMModel = {
    catalog: catalog,
    archive: archive,
    byId: byId,
    annotate: annotate,
    eventsOnDate: eventsOnDate,
    dayMessage: dayMessage,
    publishable: publishable,
    escapeHtml: escapeHtml,
    safeUrl: safeUrl
  };
})(typeof window !== "undefined" ? window : globalThis);
