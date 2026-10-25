(function () {
  'use strict';
  var form = document.getElementById('glossary-search');
  if (!form) return;
  var input = document.getElementById('glossary-query');
  var category = document.getElementById('glossary-category');
  var clear = document.getElementById('glossary-clear');
  var status = document.getElementById('glossary-results');
  var groups = Array.from(document.querySelectorAll('.glossary-group'));
  var entries = Array.from(document.querySelectorAll('.glossary-entry'));
  function fold(value) {
    return value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  }
  var index = entries.map(function (entry) {
    return fold(entry.textContent + ' ' + (entry.getAttribute('data-aliases') || ''));
  });
  function filter() {
    var words = fold(input.value.trim()).split(/\s+/).filter(Boolean);
    var count = 0;
    groups.forEach(function (group) {
      var matchesCategory = !category.value || group.getAttribute('data-category') === category.value;
      var visible = 0;
      Array.from(group.querySelectorAll('.glossary-entry')).forEach(function (entry) {
        var i = entries.indexOf(entry);
        entry.hidden = !matchesCategory || !words.every(function (word) { return index[i].includes(word); });
        if (!entry.hidden) visible++;
      });
      group.hidden = !visible;
      count += visible;
    });
    clear.disabled = !input.value && !category.value;
    status.textContent = count ? count + ' / ' + entries.length + ' terim gösteriliyor.' :
      'Eşleşen terim yok. Başka bir kelime deneyin veya süzgeci temizleyin.';
  }
  function saveLocation() {
    try {
      var url = new URL(window.location.href);
      if (input.value.trim()) url.searchParams.set('q', input.value.trim());
      else url.searchParams.delete('q');
      if (category.value) url.searchParams.set('konu', category.value);
      else url.searchParams.delete('konu');
      window.history.replaceState(window.history.state, '', url.href);
    } catch (error) { /* Filtering also works without history access. */ }
  }
  function edit() { filter(); saveLocation(); }
  function reset() { input.value = ''; category.value = ''; edit(); }
  function readLocation() {
    var params = new URLSearchParams(window.location.search);
    input.value = params.get('q') || '';
    var requested = params.get('konu') || '';
    category.value = groups.some(function (group) { return group.getAttribute('data-category') === requested; }) ? requested : '';
    filter();
  }
  function reveal(hash, focus) {
    var id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (error) { return; }
    var target = entries.find(function (entry) { return entry.id === id; });
    var group = groups.find(function (item) { return 'konu-' + item.getAttribute('data-category') === id; });
    if (!target && !group) return;
    var wasHidden = (target && target.hidden) || (group && group.hidden);
    if (wasHidden) reset();
    if (wasHidden && target) target.scrollIntoView({ block: 'start' });
    if (focus && target) target.focus({ preventScroll: true });
  }
  input.addEventListener('input', edit);
  category.addEventListener('change', edit);
  clear.addEventListener('click', function () { reset(); input.focus(); });
  form.addEventListener('submit', function (event) { event.preventDefault(); edit(); });
  input.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!input.value && !category.value) return;
    event.preventDefault(); reset();
  });
  window.addEventListener('hashchange', function () { reveal(window.location.hash, true); });
  // A repeated link to the current hash does not fire hashchange.
  window.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0)) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (link) reveal(link.getAttribute('href'), true);
  });
  window.addEventListener('popstate', function () { readLocation(); reveal(window.location.hash, false); });
  form.hidden = false;
  readLocation();
  reveal(window.location.hash, false);
}());
