/* =========================================================
   lightbox.js — shared figure viewer.

   Page wiring required:
     1. <link rel="stylesheet" href="/assets/lightbox.css">
     2. <script src="/assets/lightbox.js" defer></script>
     3. Each clickable figure wrapped in:
          <a class="figure-entry" href="<full-image>"
             data-caption="<optional caption text>">
            ...whatever markup, must include an <img> for alt text...
          </a>

   The modal HTML is auto-injected on first run if the page does
   not already include it (legacy pages may include it inline).

   Caption resolution priority:
     1. data-caption on the entry link (cleanest)
     2. .figure-num + .figure-title (GHGRP legacy markup)
     3. <figcaption> first line (HTML5 figure pattern)
     4. nothing
   ========================================================= */

(function () {
  var entries = Array.prototype.slice.call(document.querySelectorAll('.figure-entry'));
  if (!entries.length) return;

  // Auto-inject the modal if the page has not provided one inline.
  var lightbox = document.getElementById('figure-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'figure-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Figure viewer');
    lightbox.setAttribute('aria-hidden', 'true');

    function btn(cls, label, glyph) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lightbox__btn ' + cls;
      b.setAttribute('aria-label', label);
      b.textContent = glyph;
      return b;
    }
    lightbox.appendChild(btn('lightbox__close', 'Close viewer (Esc)', '×'));
    lightbox.appendChild(btn('lightbox__prev',  'Previous figure (Left arrow)', '‹'));
    lightbox.appendChild(btn('lightbox__next',  'Next figure (Right arrow)', '›'));

    var stage = document.createElement('div');
    stage.className = 'lightbox__stage';
    var img = document.createElement('img');
    img.className = 'lightbox__img';
    img.setAttribute('alt', '');
    var meta = document.createElement('div');
    meta.className = 'lightbox__meta';
    var capSpan = document.createElement('span'); capSpan.className = 'lightbox__caption';
    var ctrSpan = document.createElement('span'); ctrSpan.className = 'lightbox__counter';
    meta.appendChild(capSpan); meta.appendChild(ctrSpan);
    stage.appendChild(img); stage.appendChild(meta);
    lightbox.appendChild(stage);

    document.body.appendChild(lightbox);
  }

  var imgEl     = lightbox.querySelector('.lightbox__img');
  var captionEl = lightbox.querySelector('.lightbox__caption');
  var counterEl = lightbox.querySelector('.lightbox__counter');
  var btnClose  = lightbox.querySelector('.lightbox__close');
  var btnPrev   = lightbox.querySelector('.lightbox__prev');
  var btnNext   = lightbox.querySelector('.lightbox__next');
  var currentIdx = -1;
  var lastFocus  = null;

  // If only one figure on the page, hide nav controls + counter.
  if (entries.length === 1) {
    lightbox.classList.add('single-figure');
  }

  function preload(i) {
    if (entries.length <= 1) return;
    var wrapped = (i + entries.length) % entries.length;
    var href = entries[wrapped].getAttribute('href');
    if (href) { var im = new Image(); im.src = href; }
  }

  function getAlt(entry) {
    // Prefer a thumb img (GHGRP) but fall back to any img inside.
    var img = entry.querySelector('.thumb img') || entry.querySelector('img');
    return img ? (img.getAttribute('alt') || '') : '';
  }

  function getCaption(entry) {
    if (entry.dataset.caption) return entry.dataset.caption;
    var num   = entry.querySelector('.figure-num');
    var title = entry.querySelector('.figure-title');
    if (num || title) {
      return [num && num.textContent, title && title.textContent]
                .filter(Boolean).join(' — ');
    }
    var fc = entry.querySelector('figcaption');
    if (fc) {
      // First sentence only, so the caption stays one-line in the lightbox.
      var txt = fc.textContent.trim();
      var m = txt.match(/^[^.!?]+[.!?]/);
      return m ? m[0] : txt.split('\n')[0];
    }
    return '';
  }

  function open(i) {
    currentIdx = i;
    var entry = entries[i];
    var href  = entry.getAttribute('href');

    imgEl.setAttribute('src', href);
    imgEl.setAttribute('alt', getAlt(entry));
    captionEl.textContent = getCaption(entry);

    if (entries.length > 1) {
      counterEl.textContent = (i + 1 < 10 ? '0' : '') + (i + 1)
                            + ' / '
                            + (entries.length < 10 ? '0' : '') + entries.length;
    }

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lastFocus = document.activeElement;
    btnClose.focus();
    preload(i + 1);
    preload(i - 1);
  }

  function close() {
    if (currentIdx < 0) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    imgEl.removeAttribute('src');
    currentIdx = -1;
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function step(delta) {
    if (currentIdx < 0 || entries.length <= 1) return;
    open((currentIdx + delta + entries.length) % entries.length);
  }

  entries.forEach(function (entry, i) {
    entry.addEventListener('click', function (e) {
      // Allow modifier-clicks to follow the href naturally (open in tab).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener('click', close);
  if (btnPrev) btnPrev.addEventListener('click', function () { step(-1); });
  if (btnNext) btnNext.addEventListener('click', function () { step(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.getAttribute('aria-hidden') !== 'false') return;
    if (e.key === 'Escape')          { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });
})();
