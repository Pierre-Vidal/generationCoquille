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

// lightbox
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = '<img />';
document.body.appendChild(lightbox);

lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// lecteur audio
const audio    = document.getElementById('histoire-audio');
const playBtn  = document.getElementById('audio-play-btn');
const progress = document.getElementById('audio-progress');
const timeEl   = document.getElementById('audio-time');

if (audio && playBtn) {
  playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
    else              { audio.pause(); playBtn.textContent = '▶'; }
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progress.style.width = pct + '%';
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60).toString().padStart(2,'0');
    timeEl.textContent = `${m}:${s}`;
  });

  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    progress.style.width = '0%';
    timeEl.textContent = '0:00';
  });

  document.getElementById('audio-progress-wrap') &&
  document.querySelector('.audio-progress-wrap').addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
}

// event delegation sur le document entier
document.addEventListener('click', e => {
  const img = e.target.closest('.box-content-item img') || (e.target.tagName === 'IMG' && e.target.closest('.box-content-item') ? e.target : null);
  if (img) {
    lightbox.querySelector('img').src = img.src;
    lightbox.classList.add('open');
  }
});
