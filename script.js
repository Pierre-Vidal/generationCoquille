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
const slides     = document.querySelectorAll('.coquille-slide');
const dots       = document.querySelectorAll('.dot');
const arrowPrev  = document.getElementById('coquilleArrowPrev');
const arrowNext  = document.getElementById('coquilleArrowNext');
let currentSlide = 0;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  arrowPrev.disabled = currentSlide === 0;
  arrowNext.disabled = currentSlide === slides.length - 1;
}

arrowPrev.addEventListener('click', () => { if (currentSlide > 0) goToSlide(currentSlide - 1); });
arrowNext.addEventListener('click', () => { if (currentSlide < slides.length - 1) goToSlide(currentSlide + 1); });
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(+dot.dataset.dot)));

goToSlide(0);

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
