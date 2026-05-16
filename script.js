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

// carousel avis (3 cartes visibles)
(function () {
  const win     = document.getElementById('avisWindow');
  const track   = document.getElementById('avisTrack');
  const cards   = Array.from(track.querySelectorAll('.avis-card'));
  const dotsEl  = document.getElementById('avisDots');
  const prev    = document.getElementById('avisPrev');
  const next    = document.getElementById('avisNext');
  const gap     = 12; // px, correspond au gap: 1.2rem
  const visible = 3;
  const total   = cards.length;
  const steps   = total - visible;
  let current   = 0;

  function setCardWidths() {
    const winW  = win.offsetWidth;
    const cardW = (winW - gap * (visible - 1)) / visible;
    cards.forEach(c => { c.style.width = cardW + 'px'; });
    return cardW;
  }

  // Crée les dots
  for (let i = 0; i <= steps; i++) {
    const dot = document.createElement('button');
    dot.className = 'cq-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Page ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }

  function goTo(index) {
    current = index;
    const cardW = cards[0].offsetWidth + gap;
    track.style.transform = 'translateX(-' + (current * cardW) + 'px)';
    dotsEl.querySelectorAll('.cq-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    prev.disabled = current === 0;
    next.disabled = current === steps;
  }

  prev.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  next.addEventListener('click', () => { if (current < steps) goTo(current + 1); });

  setCardWidths();
  goTo(0);
  window.addEventListener('resize', () => { setCardWidths(); goTo(current); });
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
  if (e.target.tagName === 'IMG' && e.target.closest('.box-content-item')) {
    lightbox.querySelector('img').src = e.target.src;
    lightbox.classList.add('open');
  }
});
