(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  };
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('open', !expanded);
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
    root.classList.add('js');
  }

  // Decorative network, intentionally unrelated to patient data or scientific outputs.
  const network = document.querySelector('#brain-network');
  if (!network) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  let seed = 31;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const points = [];
  for (let i = 0; i < 115; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random());
    const side = random() > 0.5 ? 1 : -1;
    const x = 250 + side * (13 + Math.abs(Math.cos(angle)) * radius * 132);
    const y = 205 + Math.sin(angle) * radius * 135;
    points.push({ x, y });
  }
  points.forEach((point, i) => {
    points.slice(i + 1).filter(next => Math.hypot(point.x - next.x, point.y - next.y) < 46).slice(0, 5).forEach(next => {
      const line = document.createElementNS(svgNS, 'line');
      Object.entries({ x1: point.x, y1: point.y, x2: next.x, y2: next.y, stroke: '#b7c99a', 'stroke-opacity': 0.19, 'stroke-width': 0.7 }).forEach(([key, value]) => line.setAttribute(key, value));
      network.append(line);
    });
  });
  points.forEach(point => {
    const dot = document.createElementNS(svgNS, 'circle');
    Object.entries({ cx: point.x, cy: point.y, r: random() * 1.8 + 1.4, fill: '#d2dfb8', 'fill-opacity': random() * 0.6 + 0.35 }).forEach(([key, value]) => dot.setAttribute(key, value));
    network.append(dot);
  });
})();

// Lazy video: attach the source when near the viewport, play while visible, pause otherwise.
(() => {
  const videos = document.querySelectorAll('video.demo');
  if (!videos.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.dataset.loaded) { v.querySelectorAll('source[data-src]').forEach(s => { s.src = s.dataset.src; }); v.dataset.loaded = '1'; v.load(); }
        if (!reduce) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px', threshold: 0.1 });
  videos.forEach(v => { io.observe(v); v.addEventListener('click', () => { v.paused ? v.play() : v.pause(); }); });
})();

// Lightbox for screenshots and figures.
(() => {
  const box = document.querySelector('#lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  const img = box.querySelector('img');
  const cap = box.querySelector('.lightbox-caption');
  document.querySelectorAll('a.zoomable').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      const fc = a.closest('figure')?.querySelector('figcaption');
      cap.textContent = fc ? fc.textContent : (thumb ? thumb.alt : '');
      box.showModal();
    });
  });
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('close', () => { img.removeAttribute('src'); });
})();
