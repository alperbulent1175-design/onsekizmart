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
  var error = el('p', 'Fotoğraf yüklenemedi. Kaynak kaydını açabilirsiniz.', figure);
  error.hidden = true;
  error.setAttribute('role', 'status');
  var caption = el('figcaption', '', figure);
  var controls = el('div', '', dialog);
  controls.className = 'photo-viewer-bar';
  var previous = el('button', 'Önceki fotoğraf', controls);
  previous.type = 'button';
  var status = el('p', '', controls);
  status.setAttribute('aria-live', 'polite');
  var next = el('button', 'Sonraki fotoğraf', controls);
  next.type = 'button';
  controls.hidden = links.length < 2;
  var index = 0;
  var activeLinks = links;
  var trigger = null;
  function show(position) {
    var link = activeLinks[position];
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/images/')) return false;
    index = position;
    var thumbnail = link.querySelector('img');
    image.alt = thumbnail.alt;
    error.hidden = true;
    image.src = url.href;
    caption.replaceChildren();
    var original = link.parentElement.querySelector('figcaption');
    if (original) Array.from(original.children).forEach(function (child) { caption.appendChild(child.cloneNode(true)); });
    caption.querySelectorAll('details').forEach(function (detail) { detail.open = true; });
    controls.hidden = activeLinks.length < 2;
    status.textContent = 'Fotoğraf ' + (index + 1) + ' / ' + activeLinks.length;
    return true;
  }
  function step(delta) { show((index + delta + activeLinks.length) % activeLinks.length); }
  image.addEventListener('error', function () { error.hidden = false; });
  close.addEventListener('click', function () { dialog.close(); });
  previous.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  dialog.addEventListener('keydown', function (event) {
    if (activeLinks.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('photo-viewer-open');
    image.removeAttribute('src');
    if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  });
  links.forEach(function (link, position) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (event) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      activeLinks = links.filter(function (item) { return !item.closest('[hidden]'); });
      var activePosition = activeLinks.indexOf(link);
      if (activePosition < 0 || !show(activePosition)) return;
      event.preventDefault();
      trigger = link;
      dialog.showModal();
      document.documentElement.classList.add('photo-viewer-open');
      close.focus();
    });
  });
  document.body.appendChild(dialog);
})();
