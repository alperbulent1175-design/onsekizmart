(function () {
  "use strict";
  var form = document.getElementById('navy-search');
  if (!form) return;
  var input = document.getElementById('navy-query');
  var nameOnly = document.getElementById('navy-name-only');
  var clear = document.getElementById('navy-clear');
  var share = document.getElementById('navy-search-link');
  var status = document.getElementById('navy-results');
  var cards = Array.from(document.querySelectorAll('.ship-card'));
  var groups = Array.from(document.querySelectorAll('[data-navy-group]'));
  function fold(value) {
    return value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  }
  var index = cards.map(function (card) { return fold(card.textContent); });
  var names = cards.map(function (card) {
    var heading = card.querySelector('h3');
    return fold(heading ? heading.textContent : '');
  });
  cards.forEach(function (card) {
    var back = document.createElement('a');
    back.href = '#navy-search';
    back.className = 'navy-search-return';
    back.textContent = 'Gemi aramasına dön';
    card.appendChild(back);
  });
  function filter() {
    var words = fold(input.value.trim()).split(/\s+/).filter(Boolean);
    var haystack = nameOnly && nameOnly.checked ? names : index;
    var count = 0;
    cards.forEach(function (card, i) {
      card.hidden = !words.every(function (word) { return haystack[i].indexOf(word) !== -1; });
      if (!card.hidden) count++;
    });
    groups.forEach(function (group) {
      group.hidden = !Array.from(group.querySelectorAll('.ship-card')).some(function (card) { return !card.hidden; });
    });
    if (share) {
      var params = new URLSearchParams();
      if (input.value.trim()) params.set('q', input.value.trim());
      if (nameOnly && nameOnly.checked) params.set('ad', '1');
      share.href = '/donanma/' + (params.toString() ? '?' + params.toString() : '') + '#navy-search';
    }
    clear.disabled = !input.value;
    status.textContent = count ? count + ' / ' + cards.length + ' gemi veya grup kaydı gösteriliyor.' + (nameOnly && nameOnly.checked ? ' Yalnız adlarda aranıyor.' : '') : 'Eşleşen kayıt yok. Başka bir ad deneyin veya aramayı temizleyin.';
  }
  var returnSearch = null;
  function revealHash(hash) {
    var id;
    try { id = decodeURIComponent((typeof hash === 'string' ? hash : location.hash).slice(1)); } catch (error) { return; }
    if (id === 'navy-search') {
      if (returnSearch) {
        input.value = returnSearch.query;
        if (nameOnly) nameOnly.checked = returnSearch.nameOnly;
        returnSearch = null;
        filter();
      }
      input.focus();
      return;
    }
    var target = cards.find(function (card) { return card.id === id; });
    var group = groups.find(function (item) { var heading = item.querySelector('h2'); return heading && heading.id === id; });
    if (!target && group) target = group;
    if (target && (target.hidden || (group && group.hidden))) {
      if (!returnSearch) returnSearch = { query: input.value, nameOnly: !!(nameOnly && nameOnly.checked) };
      input.value = '';
      filter();
      target.scrollIntoView({ block: 'start' });
    }
  }
  function editSearch() { returnSearch = null; filter(); }
  input.addEventListener('input', editSearch);
  if (nameOnly) nameOnly.addEventListener('change', editSearch);
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  clear.addEventListener('click', function () { returnSearch = null; input.value = ''; filter(); input.focus(); });
  window.addEventListener('hashchange', revealHash);
  window.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.button != null && event.button !== 0)) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (link) revealHash(link.getAttribute('href'));
  });
  var initial = new URLSearchParams(location.search || '');
  input.value = initial.get('q') || '';
  if (nameOnly) nameOnly.checked = initial.get('ad') === '1';
  form.hidden = false;
  filter();
  if (location.hash && location.hash !== '#navy-search') revealHash();
})();
