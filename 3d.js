/* 3D interactions: hero parallax + tilt cards. Pure visual, no dependency on script.js */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return;

  /* ---- HERO: cursor-driven depth ---- */
  var hero = document.querySelector('.hero-banner');
  if (hero) {
    var name = hero.querySelector('.banner-name');
    var bg = hero.querySelector('.hero-banner-img');
    var photo = hero.querySelector('.hero-profile-card');
    var nx = 0, ny = 0, raf = 0;

    function paint() {
      raf = 0;
      if (name) {
        name.style.setProperty('--sx', (1.2 - nx).toFixed(2) + 'px');
        name.style.setProperty('--sy', (1.2 - ny).toFixed(2) + 'px');
      }
      if (bg) bg.style.translate = (-nx * 14).toFixed(1) + 'px ' + (-ny * 10).toFixed(1) + 'px';
      if (photo && !document.documentElement.classList.contains('photo-away')) {
        photo.style.transform = (nx || ny)
          ? 'perspective(900px) rotateY(' + (nx * 12).toFixed(2) + 'deg) rotateX(' + (-ny * 12).toFixed(2) + 'deg)'
          : '';
        photo.style.setProperty('--gx', ((nx + 1) * 50).toFixed(1) + '%');
        photo.style.setProperty('--gy', ((ny + 1) * 50).toFixed(1) + '%');
      }
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(paint);
    });
    hero.addEventListener('pointerleave', function () {
      nx = 0; ny = 0;
      if (!raf) raf = requestAnimationFrame(paint);
    });
  }

  /* ---- CARDS + SHEETS (About → Contact): 3D tilt + glare ---- */
  document.querySelectorAll('.cert-card, .proj-card, .about-avatar, .skill-cat, .sheet:not(.contact-form)').forEach(function (el) {
    var isSheet = el.matches('.sheet');
    var amp = isSheet ? 4 : (el.matches('.skill-cat') ? 8 : 14);
    var lift = isSheet ? -4 : -6;
    var zoom = isSheet ? 1.005 : 1.02;
    el.addEventListener('pointermove', function (e) {
      if (el.matches('.reveal:not(.in-view)')) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      el.style.transition = 'transform .08s linear, border-color .15s ease';
      el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * amp).toFixed(2) +
        'deg) rotateY(' + ((px - 0.5) * amp).toFixed(2) + 'deg) translateY(' + lift + 'px) scale(' + zoom + ')';
      el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () {
      el.style.transition = '';
      el.style.transform = '';
    });
  });
})();

/* ---- ABOUT → CONTACT: scroll-in headings + floating 3D shapes with depth parallax ---- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  root.classList.add('d3-ready');

  /* section headings flip in when they scroll into view */
  var heads = document.querySelectorAll('.sec-head');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('d3-in');
        } else {
          en.target.classList.remove('d3-in');
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -6% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  } else {
    heads.forEach(function (h) { h.classList.add('d3-in'); });
  }


  /* floating cubes + rings behind the content, from About down to Contact */
  var wrap = document.querySelector('main > .wrap');
  if (!wrap) return;
  var layer = document.createElement('div');
  layer.className = 'bg-3d';
  layer.setAttribute('aria-hidden', 'true');
  wrap.insertBefore(layer, wrap.firstChild);

  var mqMobile = window.matchMedia('(max-width: 860px)');
  var shapes = [];
  var builtFor = '';

  // desktop: [kind, top%, left%, size px, parallax speed, spin s, float s]
  var desktopSpec = [
    ['cube', 4, 88, 48, 0.10, 18, 7],
    ['ring', 9, 5, 90, -0.08, 16, 8],
    ['cube', 14, 4, 70, -0.12, 22, 8],
    ['ring', 22, 84, 110, 0.07, 18, 9],
    ['cube', 27, 92, 38, 0.14, 14, 6],
    ['ring', 36, 93, 70, -0.1, 15, 7],
    ['cube', 41, 2, 56, 0.12, 20, 7.5],
    ['ring', 49, 6, 80, 0.09, 17, 8.5],
    ['cube', 55, 90, 74, -0.1, 24, 9],
    ['ring', 62, 87, 100, 0.08, 19, 8],
    ['cube', 68, 5, 44, 0.13, 16, 6.5],
    ['ring', 75, 3, 90, -0.09, 16, 9],
    ['cube', 80, 93, 60, 0.1, 21, 7],
    ['ring', 88, 90, 80, 0.08, 18, 8],
    ['cube', 93, 3, 40, -0.12, 15, 6]
  ];

  /* mobile: shapes are spread by page height (one every ~520px), alternating edges,
     half-peeking from the screen edge so none get clipped awkwardly */
  function mobileSpec() {
    var n = Math.min(18, Math.max(6, Math.round(wrap.offsetHeight / 520)));
    var list = [];
    for (var i = 0; i < n; i++) {
      var kind = i % 2 ? 'ring' : 'cube';
      var size = kind === 'cube' ? 36 + (i * 7) % 24 : 60 + (i * 11) % 36;
      var side = (i % 4 < 2) ? 'l' : 'r';
      var speed = (i % 2 ? -1 : 1) * (0.1 + (i % 4) * 0.035);
      list.push([kind, ((i + 0.5) / n) * 100, side, size, speed, 12 + (i % 5) * 2, 5.5 + (i % 4) * 0.9]);
    }
    return list;
  }

  function build() {
    var mobile = mqMobile.matches;
    var spec = mobile ? mobileSpec() : desktopSpec;
    var key = (mobile ? 'm' : 'd') + spec.length;
    if (key === builtFor) return;
    builtFor = key;
    layer.innerHTML = '';
    layer.classList.toggle('is-mobile', mobile);
    shapes = spec.map(function (s) {
      var el = document.createElement('div');
      el.className = s[0] === 'cube' ? 'cube-wrap' : 'ring-wrap';
      el.style.top = s[1] + '%';
      if (s[2] === 'l') el.style.left = (-s[3] * 0.3) + 'px';
      else if (s[2] === 'r') el.style.right = (-s[3] * 0.3) + 'px';
      else el.style.left = s[2] + '%';
      el.style.setProperty('--s', s[3] + 'px');
      el.style.setProperty('--t', s[5] + 's');
      el.style.setProperty('--f', s[6] + 's');
      el.innerHTML = s[0] === 'cube'
        ? '<div class="cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>'
        : '<div class="ring"></div>';
      layer.appendChild(el);
      return { el: el, top: s[1] / 100, speed: s[4] };
    });
  }

  var ticking = false;
  function update() {
    ticking = false;
    var r = wrap.getBoundingClientRect();
    var h = wrap.offsetHeight;
    var mid = window.innerHeight / 2;
    for (var i = 0; i < shapes.length; i++) {
      var sh = shapes[i];
      var y = (mid - (r.top + h * sh.top)) * sh.speed;
      sh.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  function refresh() { build(); onScroll(); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(wrap);
  refresh();
  update();
})();

/* ---- MOBILE: 3D scroll transitions (alternating flip-in + scroll-linked tilt) ---- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var mq = window.matchMedia('(max-width: 860px)');
  var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!targets.length) return;

  /* cards inside the swipe carousels also rotate by horizontal position */
  var carouselIds = { certGrid: 1, skillsGrid: 1 };
  var info = targets.map(function (el, i) {
    el.style.setProperty('--ent', (i % 2 ? 38 : -38) + 'deg');
    return { el: el, carousel: !!(el.parentNode && carouselIds[el.parentNode.id]) };
  });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var ticking = false;

  function update() {
    ticking = false;
    if (!mq.matches) return;
    var vh = window.innerHeight, vw = window.innerWidth;
    for (var i = 0; i < info.length; i++) {
      var el = info[i].el;
      var r = el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;
      var cy = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2), -1, 1);
      var amp = r.height > vh * 0.8 ? 2.5 : 7;
      el.style.setProperty('--sr', (cy * amp).toFixed(2) + 'deg');
      if (info[i].carousel) {
        var cx = clamp((r.left + r.width / 2 - vw / 2) / (vw / 2), -1.3, 1.3);
        el.style.setProperty('--sry', (-cx * 24).toFixed(2) + 'deg');
      }
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  ['certGrid', 'skillsGrid'].forEach(function (id) {
    var c = document.getElementById(id);
    if (c) c.addEventListener('scroll', onScroll, { passive: true });
  });
  update();
})();


/* ---- DESKTOP: hero photo travels beside "About" while scrolling down, returns on scroll up ---- */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fly = document.getElementById('heroFly');
  var slot = document.getElementById('aboutSlot');
  if (!fly || !slot) return;
  var mq = window.matchMedia('(min-width: 861px)');
  var root = document.documentElement;
  var ticking = false;

  /* document position that ignores transforms (so it never feeds back into itself) */
  function docPos(el) {
    var x = 0, y = 0;
    while (el) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x, y: y };
  }

  function update() {
    ticking = false;
    if (!mq.matches) {
      fly.style.transform = '';
      root.classList.remove('photo-away');
      return;
    }
    var vh = window.innerHeight;
    var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    var b = docPos(fly), d = docPos(slot);
    var bw = fly.offsetWidth, bh = fly.offsetHeight;
    var dw = slot.offsetWidth, dh = slot.offsetHeight;
    if (!bw || !dw) return;
    var bcx = b.x + bw / 2, bcy = b.y + bh / 2;
    var dcx = d.x + dw / 2, dcy = d.y + dh / 2;

    /* fully arrived once the About slot reaches the middle of the screen */
    var end = Math.max(dcy - vh * 0.5, 1);
    var p = Math.min(Math.max(sy / end, 0), 1);
    var e = p * p * (3 - 2 * p);

    var dx = (dcx - bcx) * e;
    var dy = (dcy - bcy) * e;
    var s = 1 + (dw / bw - 1) * e;
    fly.style.transform = p > 0
      ? 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + s.toFixed(4) + ')'
      : '';
    root.classList.toggle('photo-away', p > 0.04);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  if (mq.addEventListener) mq.addEventListener('change', onScroll);
  if ('ResizeObserver' in window) new ResizeObserver(onScroll).observe(document.body);
  update();
})();