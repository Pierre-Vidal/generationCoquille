// header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// burger menu
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
});

// close nav when a link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#nav a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`#nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// carousel "Trouve ta coquille"
(function () {
  const slidesEl = document.getElementById('cqSlides');
  const slides   = slidesEl.querySelectorAll('.cq-slide');
  const dotsEl   = document.getElementById('cqDots');
  const prev     = document.getElementById('cqPrev');
  const next     = document.getElementById('cqNext');
  const total    = slides.length;
  let current    = 0;

  // Crée la piste flex
  const track = document.createElement('div');
  track.className = 'cq-track';
  slides.forEach(s => track.appendChild(s));
  slidesEl.appendChild(track);

  // Crée les dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cq-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Coquille ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsEl.querySelectorAll('.cq-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
  }

  prev.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  next.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });

  goTo(0);
})();

// carousel avis — bande infinie
(function () {
  const belt = document.getElementById('avisBelt');
  if (!belt) return;
  // Duplique les cartes pour que la boucle CSS soit seamless
  belt.innerHTML += belt.innerHTML;
})();

// carte partenaires — Leaflet
(function () {
  const mapEl = document.getElementById('partenaireMap');
  const panel = document.getElementById('mapInfoPanel');
  if (!mapEl || !panel) return;

  const map = L.map('partenaireMap', { scrollWheelZoom: true }).setView([46.8, 2.3], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: '<div style="width:18px;height:18px;background:#A177DB;border:3px solid #2a2a2a;border-radius:50%;box-shadow:2px 2px 0 #2a2a2a;transition:transform .15s"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  const partenaires = [
    { nom: 'Librairie Les Mots Doux',  type: 'Librairie jeunesse',  adresse: '12 rue de la Paix, Lyon',       horaires: 'Mar–Sam : 10h–19h / Dim : 11h–17h',  lat: 45.7640, lng: 4.8357  },
    { nom: 'Espace ESS Bordeaux',       type: 'Tiers-lieu éducatif', adresse: '5 allée des Arts, Bordeaux',   horaires: 'Lun–Ven : 9h–18h / Sam : 10h–14h',   lat: 44.8378, lng: -0.5792 },
    { nom: 'Atelier Parenthèse',        type: 'Atelier parents',     adresse: '8 rue des Lilas, Nantes',      horaires: 'Mar–Sam : 9h30–18h30',                lat: 47.2184, lng: -1.5536 },
    { nom: 'Boutique Imagine',          type: 'Boutique solidaire',  adresse: '3 bd Voltaire, Paris',         horaires: 'Lun–Sam : 10h–20h / Dim : 11h–18h',  lat: 48.8566, lng: 2.3522  },
    { nom: 'Médiathèque du Midi',       type: 'Médiathèque',         adresse: '22 av. Jean Jaurès, Toulouse', horaires: 'Mar–Ven : 10h–19h / Sam : 10h–17h',  lat: 43.6047, lng: 1.4442  },
  ];

  function showInfo(p) {
    panel.innerHTML = `
      <span class="map-info-name">${p.nom}</span>
      <span class="map-info-badge">${p.type}</span>
      <hr class="map-info-divider" />
      <p class="map-info-addr">📍 ${p.adresse}</p>
      <p class="map-info-hours">🕐 ${p.horaires}</p>
    `;
  }

  partenaires.forEach(p => {
    L.marker([p.lat, p.lng], { icon })
      .addTo(map)
      .on('click', () => showInfo(p));
  });
})();

// modale précommande
(function () {
  const overlay = document.getElementById('precommandeOverlay');
  const openBtn = document.getElementById('openPrecommande');
  const closeBtn = document.getElementById('closePrecommande');
  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // décompte vers le 3 mars 2026
  const target = new Date('2027-03-03T00:00:00');
  const pad = n => String(n).padStart(2, '0');
  const els = {
    d: document.getElementById('pcDays'),
    h: document.getElementById('pcHours'),
    m: document.getElementById('pcMinutes'),
    s: document.getElementById('pcSeconds'),
  };
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
      return;
    }
    els.d.textContent = pad(Math.floor(diff / 86400000));
    els.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    els.s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

// lightbox
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<img />';
document.body.appendChild(lightbox);

lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// event delegation lightbox
document.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && (e.target.closest('.box-content-item') || e.target.closest('.pc-content-item'))) {
    lightbox.querySelector('img').src = e.target.src;
    lightbox.classList.add('open');
  }
});
