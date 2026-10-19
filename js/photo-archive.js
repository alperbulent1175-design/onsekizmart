(function () {
  "use strict";
  var links = Array.from(document.querySelectorAll('.naval-photo > a'));
  if (!links.length || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  var dialog = document.createElement('dialog');
  dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-labelledby', 'photo-viewer-title');
  function el(tag, text, parent) {
    var node = document.createElement(tag);
    if (text) node.textContent = text;
    parent.appendChild(node);
    return node;
  }
  var bar = el('div', '', dialog);
  bar.className = 'photo-viewer-bar';
  var heading = el('h2', 'Fotoğraf', bar);
  heading.id = 'photo-viewer-title';
  var close = el('button', 'Kapat', bar);
  close.type = 'button';
  var figure = el('figure', '', dialog);
  var image = el('img', '', figure);
  var loading = el('p', 'Fotoğraf yükleniyor…', figure);
  loading.hidden = true;
  loading.setAttribute('role', 'status');
  var error = el('p', 'Fotoğraf yüklenemedi. Kaynak kaydını açabilirsiniz.', figure);
  error.hidden = true;
  error.setAttribute('role', 'status');
  var retry = el('button', 'Fotoğrafı yeniden yükle', figure);
  retry.type = 'button';
  retry.hidden = true;
  var caption = el('figcaption', '', figure);
  var controls = el('div', '', bar);
  controls.className = 'photo-viewer-controls';
  var previous = el('button', 'Önceki', controls);
  previous.type = 'button';
  previous.setAttribute('aria-label', 'Önceki fotoğraf');
  var status = el('p', '', controls);
  status.setAttribute('aria-live', 'polite');
  var next = el('button', 'Sonraki', controls);
  next.type = 'button';
  next.setAttribute('aria-label', 'Sonraki fotoğraf');
  var permalink = el('a', 'Bu fotoğrafa bağlantı', dialog);
  permalink.className = 'photo-permalink';
  controls.hidden = links.length < 2;
  var index = 0;
  var activeLinks = links;
  var trigger = null;
  function show(position) {
    var link = activeLinks[position];
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/images/')) return false;
    index = position;
    var photoId = link.parentElement.getAttribute('data-photo-id');
    heading.textContent = photoId ? 'Fotoğraf · ' + photoId : 'Fotoğraf';
    permalink.hidden = !photoId;
    if (photoId) permalink.href = '/fotograf-arsivi/?q=' + encodeURIComponent(photoId) + '#foto-' + encodeURIComponent(photoId);
    dialog.scrollTop = 0;
    var thumbnail = link.querySelector('img');
    image.alt = thumbnail.alt;
    error.hidden = true;
    retry.hidden = true;
    loading.hidden = false;
    image.hidden = true;
    image.setAttribute('aria-busy', 'true');
    image.src = url.href;
    caption.replaceChildren();
    var original = link.parentElement.querySelector('figcaption');
    if (original) Array.from(original.children).forEach(function (child) { caption.appendChild(child.cloneNode(true)); });
    caption.querySelectorAll('details').forEach(function (detail) { detail.open = true; });
    controls.hidden = activeLinks.length < 2;
    status.textContent = 'Fotoğraf ' + (index + 1) + ' / ' + activeLinks.length;
    return true;
  }
  function step(delta) {
    var restoreFocus = caption.contains(document.activeElement) || document.activeElement === retry;
    if (!show((index + delta + activeLinks.length) % activeLinks.length)) return;
    if (restoreFocus) (delta < 0 ? previous : next).focus();
  }
  image.addEventListener('load', function () {
    loading.hidden = true;
    image.hidden = false;
    image.setAttribute('aria-busy', 'false');
  });
  image.addEventListener('error', function () {
    loading.hidden = true;
    image.hidden = true;
    image.setAttribute('aria-busy', 'false');
    error.hidden = false;
    retry.hidden = false;
  });
  retry.addEventListener('click', function () {
    image.removeAttribute('src');
    show(index);
    close.focus();
  });
  close.addEventListener('click', function () { dialog.close(); });
  previous.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  dialog.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target && event.target.closest && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (activeLinks.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('photo-viewer-open');
    image.removeAttribute('src');
    loading.hidden = true;
    retry.hidden = true;
    image.hidden = true;
    image.setAttribute('aria-busy', 'false');
    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  });
  function openPhoto(link) {
    activeLinks = links.filter(function (item) { return !item.closest('[hidden]'); });
    var activePosition = activeLinks.indexOf(link);
    if (activePosition < 0 || !show(activePosition)) return false;
    trigger = link;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('photo-viewer-open');
    close.focus();
    return true;
  }
  function photoFromHash(hash) {
    if (hash.indexOf('#foto-') !== 0) return null;
    try {
      var id = decodeURIComponent(hash.slice(6));
      return links.find(function (link) { return link.parentElement.getAttribute('data-photo-id') === id && !link.closest('[hidden]'); }) || null;
    } catch (error) { return null; }
  }
  links.forEach(function (link) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!openPhoto(link)) return;
      event.preventDefault();
    });
  });
  document.body.appendChild(dialog);
  var linkNotice = document.createElement('p');
  linkNotice.className = 'photo-link-notice';
  linkNotice.setAttribute('role', 'status');
  linkNotice.hidden = true;
  var main = document.querySelector('main') || document.body;
  main.insertBefore(linkNotice, main.firstChild);
  function photoLinkMessage(hash) {
    if (hash.indexOf('#foto-') !== 0) return null;
    var id = '';
    try { id = decodeURIComponent(hash.slice(6)); } catch (_) {}
    var known = id && links.some(function (link) { return link.parentElement.getAttribute('data-photo-id') === id; });
    return known ? {
      text: 'Bağlantıdaki fotoğraf mevcut arama veya görsel türü seçimiyle gizlenmiş olabilir. ',
      label: 'Bu fotoğrafı arşivde bul',
      href: '/fotograf-arsivi/?q=' + encodeURIComponent(id) + '#foto-' + encodeURIComponent(id)
    } : {
      text: 'Bağlantıdaki fotoğraf bu sayfanın kayıtlarında bulunamadı. ',
      label: 'Fotoğraf arşivinde ara', href: '/fotograf-arsivi/#photo-search'
    };
  }
  function updatePhotoLinkNotice(scroll) {
    var link = photoFromHash(location.hash);
    linkNotice.hidden = true;
    if (!link) {
      var message = photoLinkMessage(location.hash);
      if (!message) return null;
      linkNotice.replaceChildren(document.createTextNode(message.text));
      var action = el('a', message.label, linkNotice);
      action.href = message.href;
      linkNotice.hidden = false;
      if (scroll) linkNotice.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    return link;
  }
  function openLinkedPhoto() {
    var link = updatePhotoLinkNotice(true);
    if (link) openPhoto(link);
  }
  var searchForm = document.getElementById('photo-search');
  if (searchForm) ['input', 'change', 'reset'].forEach(function (type) {
    searchForm.addEventListener(type, function () { updatePhotoLinkNotice(false); });
  });
  window.addEventListener('popstate', function () { updatePhotoLinkNotice(false); });
  window.addEventListener('pageshow', function () { updatePhotoLinkNotice(false); });
  window.addEventListener('hashchange', openLinkedPhoto);
  openLinkedPhoto();
})();
