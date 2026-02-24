// ── Year ──────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Modal data ────────────────────────────────
const MODALS = {
  nao: {
    title: 'NAO Comedy Robot — Audience Feedback',
    body: 'This project has been submitted for review at the <strong>ACM/IEEE THRI (Transactions on Human-Robot Interaction)</strong> conference. Details and code will be shared upon publication.',
    footer: null,
  },
};

// ── Modal logic ───────────────────────────────
const backdrop  = document.getElementById('modal');
const titleEl   = document.getElementById('modalTitle');
const bodyEl    = document.getElementById('modalBody');
const iconEl    = document.getElementById('modalIcon');
const footerEl  = document.getElementById('modalFooter');
const closeBtn  = document.getElementById('modalClose');

function openModal(key) {
  const data = MODALS[key];
  if (!data) return;
  iconEl.textContent  = data.icon || '';
  titleEl.textContent = data.title;
  bodyEl.innerHTML    = data.body;
  footerEl.innerHTML  = data.footer || '';
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
});

// ── Scroll-fade-in ────────────────────────────
const observer = new IntersectionObserver(
  (entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('section, .card').forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  observer.observe(el);
});
