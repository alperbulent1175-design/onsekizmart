(function () {
  'use strict';
  var form = document.getElementById('photo-search');
  if (!form) return;
  var input = form.querySelector('input');
  var select = form.querySelector('select');
  var status = document.getElementById('photo-results');
  var empty = document.getElementById('photo-empty');
  var sections = Array.from(document.querySelectorAll('main > .naval-photos'));
  var navigation = document.getElementById('photo-sections');
  var sectionLinks = navigation ? Array.from(navigation.querySelectorAll('a')) : [];
  var sectionLabels = sectionLinks.map(function (link) { return link.textContent; });
  var sectionIds = sectionLinks.map(function (link) { return link.getAttribute('href').slice(1); });
  function fold(text) {
    return text.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  var cards = sections.flatMap(function (section) {
    return Array.from(section.querySelectorAll('.naval-photo')).map(function (card) {
      return { node: card, section: section, category: section.getAttribute('aria-labelledby'), text: fold(card.textContent) };
    });
  });
  function update(syncUrl) {
    var terms = fold(input.value.trim()).split(/\s+/).filter(Boolean);
    var count = 0;
    cards.forEach(function (card) {
      var match = (!select.value || card.category === select.value) && terms.every(function (term) { return card.text.includes(term); });
      card.node.hidden = !match;
      if (match) count++;
    });
    sections.forEach(function (section) {
      section.hidden = !cards.some(function (card) { return card.section === section && !card.node.hidden; });
    });
    status.textContent = count + ' / ' + cards.length + ' fotoğraf gösteriliyor.';
    empty.hidden = count > 0;
    sectionLinks.forEach(function (link, index) {
      var category = sectionIds[index];
      var destination = new URL(window.location.href);
      if (input.value.trim()) destination.searchParams.set('q', input.value.trim());
      else destination.searchParams.delete('q');
      destination.searchParams.set('tur', category);
      destination.hash = category;
      link.href = destination.pathname + destination.search + destination.hash;
      var available = cards.filter(function (card) {
        return card.category === category && terms.every(function (term) { return card.text.includes(term); });
      }).length;
      link.textContent = sectionLabels[index] + ' (' + available + ')';
      if (select.value === category) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (syncUrl !== false) {
      var url = new URL(window.location.href);
      if (input.value.trim()) url.searchParams.set('q', input.value.trim());
      else url.searchParams.delete('q');
      if (select.value) url.searchParams.set('tur', select.value);
      else url.searchParams.delete('tur');
      if (url.href !== window.location.href) {
        try { window.history.replaceState(window.history.state, '', url.href); } catch (_) { /* Arama çalışmaya devam eder. */ }
      }
    }
  }
  function restore() {
    var url = new URL(window.location.href);
    input.value = url.searchParams.get('q') || '';
    var type = url.searchParams.get('tur') || '';
    select.value = ['gemiler', 'denizciler', 'komutanlar', 'olaylar'].includes(type) ? type : '';
    update(false);
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    update();
    var first = cards.find(function (card) { return !card.node.hidden; });
    var target = first ? first.node.querySelector('a') : empty;
    if (!target) return;
    if (!first) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    (first ? first.node : empty).scrollIntoView({ block: 'start' });
  });
  input.addEventListener('input', update);
  input.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !input.value) return;
    event.preventDefault();
    input.value = '';
    update();
  });
  select.addEventListener('change', update);
  sectionLinks.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      if (event && (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0))) return;
      select.value = sectionIds[index];
      // Let the native link create its history entry before changing the URL.
      update(false);
    });
  });
  form.addEventListener('reset', function () { input.value = ''; select.value = ''; update(); input.focus(); });
  form.hidden = false;
  var help = document.getElementById('photo-search-help');
  if (help) help.hidden = false;
  window.addEventListener('popstate', restore);
  window.addEventListener('pageshow', restore);
  restore();
})();
