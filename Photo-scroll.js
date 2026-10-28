/* Scroll-linked profile photo: hero photo flies into the About section as you scroll down
   (beside the About card on desktop, beside "Hi, I'm Anjenel" on mobile) and flies back when you scroll up. */
(function () {
  var heroCard = document.querySelector('.hero-profile-card');
  var heroImg = document.getElementById('heroAvatar');
  var slots = Array.prototype.slice.call(document.querySelectorAll('.about-photo-slot'));
  if (!heroCard || !heroImg || !slots.length) return;

  var fly = document.createElement('div');
  fly.className = 'fly-photo';
  fly.setAttribute('aria-hidden', 'true');
  fly.innerHTML = '<img alt="">';
  document.body.appendChild(fly);
  var flyImg = fly.querySelector('img');

  /* document position that ignores CSS transforms (so reveal/tilt effects can't jitter the path) */
  function pos(el) {
    var x = 0, y = 0;
    while (el) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x, y: y };
  }
  var mqMobile = window.matchMedia('(max-width: 860px)');
  function activeSlot() {
    if (!mqMobile.matches) return null; /* desktop is handled by the hero-fly code in 3d.js */
    for (var i = 0; i < slots.length; i++) if (slots[i].offsetParent !== null) return slots[i];
    return null;
  }
  function syncSrc(img, src) {
    if (img.getAttribute('data-s') !== src) { img.src = src; img.setAttribute('data-s', src); }
  }

  var ticking = false;
  function update() {
    ticking = false;
    var slot = activeSlot();
    if (!slot) {
      fly.classList.remove('on');
      heroCard.style.visibility = '';
      slots.forEach(function (el) { el.classList.remove('landed'); });
      return;
    }

    var src = heroImg.currentSrc || heroImg.src;
    syncSrc(flyImg, src);
    slots.forEach(function (s) { syncSrc(s.firstElementChild, src); });

    var sx = window.pageXOffset, sy = window.pageYOffset;
    var h = pos(heroCard), s = pos(slot);
    var hw = heroCard.offsetWidth, sw = slot.offsetWidth;

    /* fully landed once the slot's centre reaches ~45% of the viewport height */
    var dist = Math.max(240, s.y + sw / 2 - window.innerHeight * 0.45);
    var raw = Math.min(1, Math.max(0, sy / dist));
    var e = raw * raw * (3 - 2 * raw);

    slots.forEach(function (el) { el.classList.toggle('landed', raw >= 0.999 && el === slot); });

    if (raw <= 0.001) {
      fly.classList.remove('on');
      heroCard.style.visibility = '';
    } else if (raw >= 0.999) {
      fly.classList.remove('on');
      heroCard.style.visibility = 'hidden';
    } else {
      heroCard.style.visibility = 'hidden';
      var w = hw + (sw - hw) * e;
      var x = h.x + (s.x - h.x) * e - sx;
      var y = h.y + (s.y - h.y) * e - sy;
      fly.style.width = w + 'px';
      fly.style.height = w + 'px';
      fly.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      fly.classList.add('on');
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', function () { onScroll(); setTimeout(onScroll, 2600); });
  window.addEventListener('pageshow', onScroll);
  update();
})();