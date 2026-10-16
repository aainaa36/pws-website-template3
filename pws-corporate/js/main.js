// Mobile menu
const btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
btn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});

// Nav shadow on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Scroll reveal + stat counters
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function countUp(el) {
  const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
  const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  if (reduce) { el.textContent = fmt(target); return; }
  const start = performance.now(), dur = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Connect form
const form = document.getElementById('signup');
if (form) {
  const setErr = (id, msg) => {
    const input = document.getElementById(id);
    document.getElementById(id + '-err').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okName = setErr('name', document.getElementById('name').value.trim() ? '' : 'Enter your name.');
    const okMail = setErr('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(document.getElementById('email').value.trim()) ? '' : 'Enter a valid email address.');
    if (okName && okMail) {
      // Static site: connect this to Formspree / Netlify Forms to actually receive messages.
      document.getElementById('success').classList.add('show');
      form.reset();
    }
  });
}
