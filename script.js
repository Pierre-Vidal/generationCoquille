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

// lightbox
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<img />';
document.body.appendChild(lightbox);

lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// event delegation sur le document entier
document.addEventListener('click', e => {
  const img = e.target.closest('.box-content-item img') || (e.target.tagName === 'IMG' && e.target.closest('.box-content-item') ? e.target : null);
  if (img) {
    lightbox.querySelector('img').src = img.src;
    lightbox.classList.add('open');
  }
});
