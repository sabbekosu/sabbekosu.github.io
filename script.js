// ── Year ──────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Modal data ────────────────────────────────
const MODALS = {
  gestures: {
    title: 'Gesture Generation from Natural Prompts',
    body: 'Turns natural language prompts into robot joint motions, making it easier for non-experts to describe expressive gestures and test them safely in simulation.',
    footer: '<a class="card-btn" href="https://github.com/sabbekosu/AI_Gestures" target="_blank" rel="noopener">View on GitHub ↗</a>',
  },
  nao: {
    title: 'NAO Comedy Robot — Audience Feedback',
    body: 'A real-time system that helps a humanoid robot read audience reactions through audio and vision, then adjust comedic responses so human-robot interaction feels more responsive and natural.',
    footer: '<button class="card-btn card-btn-link" type="button" onclick="openModal(\'naoDetails\')">View details</button>',
  },
  naoDetails: {
    title: 'NAO Comedy Robot — Audience Feedback',
    body: 'This project has been submitted for review at the <strong>ACM/IEEE THRI (Transactions on Human-Robot Interaction)</strong> conference. Details and code will be shared upon publication.',
    footer: null,
  },
  reward: {
    title: 'Adaptive Querying for Reward Learning',
    body: 'Improves how robots learn from human feedback by choosing more useful questions, reducing the burden on people while helping reward models better match human preferences.<br /><br /><span class="modal-authors">Anand · Nwagwu · <strong>Sabbe</strong> · Fitter · Saisubramanian</span>',
    footer: '<a class="card-btn" href="https://arxiv.org/abs/2412.07990" target="_blank" rel="noopener">View on arXiv ↗</a>',
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
  footerEl.hidden = !data.footer;
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
