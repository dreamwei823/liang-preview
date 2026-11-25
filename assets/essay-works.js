/* 2026-11-25c 藝評頁：滑到全文裡的作品連結，旁邊淡入作品縮圖（只在有滑鼠的電腦上；圖取自末尾「文中提到的作品」同一件） */
(function () {
  if (!window.matchMedia || !matchMedia('(hover:hover) and (pointer:fine) and (min-width:701px)').matches) return;
  var links = document.querySelectorAll('.essay a.art-link');
  if (!links.length) return;
  var W = 140, GAP = 28, EDGE = 12;
  var tip = document.createElement('div');
  tip.className = 'art-peek';
  tip.setAttribute('aria-hidden', 'true');
  var im = document.createElement('img');
  im.alt = '';
  im.decoding = 'async';
  tip.appendChild(im);
  document.body.appendChild(tip);
  var cards = document.querySelectorAll('.essay-works a');
  function cardImg(a) {
    var href = a.getAttribute('href');
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('href') === href) return cards[i].querySelector('img');
    }
    return null;
  }
  var cur = null;
  function show(a) {
    var src = cardImg(a);
    if (!src) return;
    cur = a;
    var url = src.currentSrc || src.src;
    if (im.getAttribute('src') !== url) im.src = url;
    var w = +src.getAttribute('width') || 1, h = +src.getAttribute('height') || 1;
    var H = Math.round(W * h / w);
    var r = a.getBoundingClientRect();
    var col = (a.closest('.fulltext') || a.parentNode).getBoundingClientRect();
    var x = col.right + GAP;
    if (x + W > window.innerWidth - EDGE) x = col.left - GAP - W;
    if (x < EDGE) x = Math.min(r.right + 16, window.innerWidth - W - EDGE);
    var y = r.top + r.height / 2 - H / 2;
    y = Math.max(EDGE, Math.min(y, window.innerHeight - H - EDGE));
    tip.style.left = Math.round(x) + 'px';
    tip.style.top = Math.round(y) + 'px';
    tip.classList.add('on');
  }
  function hide() { cur = null; tip.classList.remove('on'); }
  for (var i = 0; i < links.length; i++) {
    (function (a) {
      a.addEventListener('mouseenter', function () { show(a); });
      a.addEventListener('mouseleave', hide);
      a.addEventListener('focus', function () { show(a); });
      a.addEventListener('blur', hide);
    })(links[i]);
  }
  window.addEventListener('scroll', function () { if (cur) hide(); }, { passive: true });
})();
