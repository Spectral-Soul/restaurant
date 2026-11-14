/* MS Biriyani — motion + interactions */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ═══════════ MENU DATA ═══════════ */
const MENU = [
  { c:'biriyani', n:'Chicken Dum Biriyani',   d:'Long-grain basmati, house masala chicken, saffron and mint — sealed and slow-cooked.', p:'180', v:false, s:2, t:'Bestseller' },
  { c:'biriyani', n:'Mutton Dum Biriyani',    d:'Tender mutton pieces marinated overnight, layered with fragrant rice and fried onions.', p:'260', v:false, s:2 },
  { c:'biriyani', n:'Chicken 65 Biriyani',    d:'Our crispy Chicken 65 folded through dum rice — a house favourite.', p:'220', v:false, s:3, t:"Chef's Special", tg:true },
  { c:'biriyani', n:'Egg Biriyani',           d:'Masala-coated boiled eggs over saffron rice with caramelised onions.', p:'140', v:false, s:1 },
  { c:'biriyani', n:'Veg Dum Biriyani',       d:'Garden vegetables, paneer and whole spices under a dough-sealed dum.', p:'130', v:true,  s:1 },
  { c:'biriyani', n:'MS Family Pack',         d:'A full handi of chicken biriyani with raita, brinjal curry and onion salad — serves 3–4.', p:'549', v:false, s:2, t:'Family', tg:true },

  { c:'meals', n:'South Indian Full Meals',   d:'Rice, sambar, rasam, kootu, poriyal, appalam, pickle and payasam on banana leaf.', p:'150', v:true, s:1, t:'Classic' },
  { c:'meals', n:'Chicken Meals',             d:'Full meals with our Nadan-style chicken curry and a boiled egg.', p:'220', v:false, s:2 },
  { c:'meals', n:'Mutton Meals',              d:'Full meals with slow-cooked mutton gravy — Sunday energy, any day.', p:'300', v:false, s:2 },
  { c:'meals', n:'Mini Meals',                d:'A lighter spread — rice, sambar, one curry, poriyal and appalam.', p:'120', v:true, s:1 },
  { c:'meals', n:'Curd Rice',                 d:'Soft rice tempered with mustard, curry leaves and ginger, served cool.', p:'80', v:true, s:0 },

  { c:'infused', n:'Classic Herb Infused Chicken', d:'Overnight herb marinade, roasted golden — served half or full.', p:'240', v:false, s:1, t:'Signature', tg:true },
  { c:'infused', n:'Peri-Peri Infused Chicken',    d:'Fiery peri-peri rub with a citrus kick — served half or full.', p:'260', v:false, s:3 },
  { c:'infused', n:'Lemon Pepper Infused Chicken', d:'Bright lemon and cracked pepper, butter-basted — served half or full.', p:'250', v:false, s:1 },
  { c:'infused', n:'Mint & Coriander Infused',     d:'Green herb paste under crisp skin, with mint chutney — served half or full.', p:'250', v:false, s:2 },

  { c:'grill', n:'Tandoori Chicken',        d:'Clay-oven char, yoghurt-spice marinade, onion rings and lemon.', p:'260', v:false, s:2 },
  { c:'grill', n:'BBQ Chicken',             d:'Smoky-sweet glaze, finished over live coals.', p:'280', v:false, s:1, t:'Bestseller' },
  { c:'grill', n:'Chicken Tikka',           d:'Boneless cubes, charred edges, mint chutney on the side.', p:'180', v:false, s:2 },
  { c:'grill', n:'Grill Chicken (Half)',    d:'Our classic flame-grilled half bird with pepper masala.', p:'260', v:false, s:2 },
  { c:'grill', n:'Fish Fry',                d:'Catch of the day, Chettinad masala crust, curry-leaf crackle.', p:'220', v:false, s:2 },
  { c:'grill', n:'Mutton Chops',            d:'Slow-grilled chops, pepper-heavy and fall-off-the-bone.', p:'320', v:false, s:2 },

  { c:'bev', n:'Filter Coffee',             d:'Strong decoction, frothed milk, brass davara-tumbler style.', p:'40', v:true, s:0 },
  { c:'bev', n:'Masala Chai',               d:'Ginger, cardamom and clove, brewed slow.', p:'35', v:true, s:0 },
  { c:'bev', n:'Fresh Lime Soda',           d:'Sweet, salt or mixed — squeezed to order.', p:'50', v:true, s:0 },
  { c:'bev', n:'Rose Milk',                 d:'Chilled milk with rose syrup and basil seeds.', p:'60', v:true, s:0 },
  { c:'bev', n:'Badam Milk',                d:'Almond-saffron milk, served warm or chilled.', p:'70', v:true, s:0 },
  { c:'bev', n:'Sweet Lassi',               d:'Thick curd churned with sugar and a touch of cardamom.', p:'70', v:true, s:0 },
  { c:'bev', n:'Virgin Mojito',             d:'Lime, mint and soda over crushed ice.', p:'90', v:true, s:0 },
  { c:'bev', n:'Cold Coffee',               d:'Blended cold coffee with a scoop of vanilla.', p:'90', v:true, s:0 },
];

const CHILI = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 4c0-1 1-2 2-2 0 2-1 3-2 3 1 1 2 3 2 5 0 6-5 11-11 12-2 .3-3.5-1-3-3C5 13 10 8 16 7c0-1 0-2 0-3z"/></svg>';
const STAR  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.4 1.15 6.8L12 17.3l-5.9 3.2 1.15-6.8L2.5 9.3l6.6-1.04z"/></svg>';

const grid = $('#menuGrid');

function cardHTML(m, i) {
  const mark = m.v
    ? '<span class="veg-mark veg" title="Vegetarian"><svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg></span>'
    : '<span class="veg-mark nonveg" title="Non-vegetarian"><svg viewBox="0 0 10 10"><path d="M5 1l4 8H1z"/></svg></span>';
  const tag = m.t ? `<span class="m-tag${m.tg ? ' gold' : ''}">${m.t}</span>` : '';
  const spice = m.s > 0
    ? `<span class="spice" title="Spice level ${m.s} of 3">${[1,2,3].map(k => CHILI.replace('<svg', `<svg class="${k <= m.s ? 'on' : ''}"`)).join('')}</span>`
    : '<span class="spice" title="Mild"></span>';
  return `<article class="m-card" style="--i:${Math.min(i, 12)}">
    <div class="m-top">${mark}<h3 class="m-name">${m.n}</h3>${tag}</div>
    <p class="m-desc">${m.d}</p>
    <div class="m-bottom">${spice}</div>
  </article>`;
}

function renderMenu(cat) {
  const items = cat === 'all' ? MENU : MENU.filter(m => m.c === cat);
  grid.innerHTML = items.map(cardHTML).join('');
}

/* tabs */
const tabs = $$('.tab');
const ind = $('#tabInd');

function moveInd(btn) {
  if (!btn) return;
  ind.style.width = btn.offsetWidth + 'px';
  ind.style.height = btn.offsetHeight + 'px';
  ind.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop - 5}px)`;
}

function setTab(cat, scroll = false) {
  const btn = tabs.find(b => b.dataset.cat === cat);
  if (!btn) return;
  tabs.forEach(b => {
    const on = b === btn;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on);
  });
  moveInd(btn);
  renderMenu(cat);
  if (scroll) $('.tabs-wrap').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
}

tabs.forEach(b => b.addEventListener('click', () => setTab(b.dataset.cat)));
$$('.sig-card').forEach(c => c.addEventListener('click', () => setTab(c.dataset.cat, true)));

renderMenu('all');
const syncInd = () => moveInd(tabs.find(b => b.classList.contains('active')));
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncInd);
addEventListener('resize', syncInd);

/* ═══════════ PRELOADER ═══════════ */
const pre = $('#preloader');
const preBar = $('.pre-bar i');
let preP = 0, preDone = false;
const preTick = setInterval(() => {
  preP = Math.min(preP + Math.random() * 14, 90);
  preBar.style.transform = `scaleX(${preP / 100})`;
}, 120);

function finishPre() {
  if (preDone) return;
  preDone = true;
  clearInterval(preTick);
  preBar.style.transform = 'scaleX(1)';
  setTimeout(() => {
    document.body.classList.add('loaded');
    pre.classList.add('done');
    setTimeout(() => pre.remove(), 950);
    syncInd();
  }, 300);
}
addEventListener('load', () => setTimeout(finishPre, 450));
setTimeout(finishPre, 3400);

/* ═══════════ SCROLL REVEALS ═══════════ */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
$$('[data-reveal]').forEach(el => revealIO.observe(el));

/* counters */
const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, target = +el.dataset.count, t0 = performance.now();
    const dur = RM ? 1 : 1400;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: .5 });
$$('[data-count]').forEach(el => countIO.observe(el));

/* active nav link */
const navLinks = $$('.nav-link');
const secIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
['home', 'story', 'menu', 'gallery', 'hall', 'visit'].forEach(id => {
  const s = document.getElementById(id);
  if (s) secIO.observe(s);
});

/* ═══════════ EMBER CANVAS ═══════════ */
const cv = $('#embers');
const ctx = cv.getContext('2d');
const hero = $('#home');
let W = 0, H = 0, heroVisible = true;
const DPR = Math.min(devicePixelRatio || 1, 1.75);
const parts = [];

function sizeCanvas() {
  const r = hero.getBoundingClientRect();
  W = r.width; H = r.height;
  cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function makePart(init) {
  return {
    x: Math.random() * W,
    y: init ? Math.random() * H : H + 12,
    r: Math.random() * 2.1 + .6,
    vy: -(Math.random() * .35 + .12),
    vx: (Math.random() - .5) * .16,
    a: Math.random() * .45 + .15,
    hue: 36 + Math.random() * 16,
    ph: Math.random() * Math.PI * 2,
  };
}

function initParts() {
  parts.length = 0;
  const n = Math.min(60, Math.floor(W / 22));
  for (let i = 0; i < n; i++) parts.push(makePart(true));
}

function drawEmbers(t) {
  ctx.clearRect(0, 0, W, H);
  for (const p of parts) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(t / 1600 + p.ph) * .12;
    if (p.y < -14 || p.x < -14 || p.x > W + 14) Object.assign(p, makePart(false));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 7);
    ctx.fillStyle = `hsla(${p.hue},85%,62%,${p.a})`;
    ctx.shadowColor = 'hsla(40,90%,60%,.8)';
    ctx.shadowBlur = 8;
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

if (!RM) {
  sizeCanvas();
  initParts();
  new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  if ('ResizeObserver' in window) new ResizeObserver(() => { sizeCanvas(); initParts(); }).observe(hero);
  else addEventListener('resize', () => { sizeCanvas(); initParts(); });
}

/* ═══════════ MAIN rAF LOOP ═══════════ */
const nav = $('#nav');
const progress = $('#progress');
const toTop = $('#toTop');
const pxEls = $$('[data-parallax]').map(el => ({ el, sp: parseFloat(el.dataset.parallax) || .1 }));

function loop(t) {
  const y = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  nav.classList.toggle('scrolled', y > 40);
  toTop.classList.toggle('show', y > 600);

  if (!RM) {
    for (const o of pxEls) {
      const r = o.el.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const off = Math.max(-r.height * .08, Math.min(r.height * .08, (r.top + r.height / 2 - innerHeight / 2) * o.sp));
        o.el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      }
    }
    if (heroVisible && W > 0) drawEmbers(t);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

/* ═══════════ MOBILE MENU ═══════════ */
const burger = $('#burger');
const mMenu = $('#mobileMenu');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  mMenu.classList.toggle('open', open);
  mMenu.setAttribute('aria-hidden', !open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('.m-link, .m-call').forEach(l => l.addEventListener('click', () => setMenu(false)));

/* ═══════════ REVIEWS ═══════════ */
const slides = $$('.rev-slide');
const dotsWrap = $('.rev-dots');
let revI = 0, revTimer = null;

$$('.rev-stars').forEach(el => { el.innerHTML = STAR.repeat(5); });
slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'rev-dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Review ' + (i + 1));
  d.addEventListener('click', () => { goRev(i); restartRev(); });
  dotsWrap.appendChild(d);
});
const dots = $$('.rev-dot');

function goRev(i) {
  revI = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('active', k === revI));
  dots.forEach((d, k) => d.classList.toggle('active', k === revI));
}
function restartRev() {
  clearInterval(revTimer);
  if (!RM) revTimer = setInterval(() => goRev(revI + 1), 6500);
}
$('#revPrev').addEventListener('click', () => { goRev(revI - 1); restartRev(); });
$('#revNext').addEventListener('click', () => { goRev(revI + 1); restartRev(); });
const carousel = $('.rev-carousel');
carousel.addEventListener('mouseenter', () => clearInterval(revTimer));
carousel.addEventListener('mouseleave', restartRev);
restartRev();

/* ═══════════ SCROLL LOCK ═══════════ */
const modal = $('#bookingModal');
const lb = $('#lightbox');
function syncLock() {
  const locked = modal.classList.contains('open') || lb.classList.contains('open') || document.body.classList.contains('menu-open');
  document.body.style.overflow = locked ? 'hidden' : '';
}

/* ═══════════ LIGHTBOX ═══════════ */
const gItems = $$('.g-item');
const shots = gItems.map(f => ({ src: $('img', f).src, alt: $('img', f).alt, cap: f.dataset.cap }));
const lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
let lbI = 0;

function showShot(i) {
  lbI = (i + shots.length) % shots.length;
  const s = shots[lbI];
  lbImg.src = s.src;
  lbImg.alt = s.alt;
  lbCap.textContent = s.cap;
  lbCount.textContent = (lbI + 1) + ' / ' + shots.length;
}
function openLB(i) {
  showShot(i);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  syncLock();
  $('#lbClose').focus();
}
function closeLB() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  syncLock();
}
gItems.forEach((f, i) => {
  f.addEventListener('click', () => openLB(i));
  f.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(i); }
  });
});
$('#lbClose').addEventListener('click', closeLB);
$('#lbPrev').addEventListener('click', () => showShot(lbI - 1));
$('#lbNext').addEventListener('click', () => showShot(lbI + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

/* ═══════════ BOOKING MODAL ═══════════ */
const form = $('#bookForm');
const formView = $('#bookFormView');
const successView = $('#bookSuccess');
const bName = $('#bName'), bPhone = $('#bPhone'), bType = $('#bType'),
      bDate = $('#bDate'), bTime = $('#bTime'), bGuests = $('#bGuests'), bNotes = $('#bNotes');
const gLabel = $('#gLabel');
let gMax = 20;

/* time slots 11:00 – 22:30 */
for (let h = 11; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m > 30) break;
    const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const h12 = ((h + 11) % 12) + 1;
    const label = `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    const o = document.createElement('option');
    o.value = val; o.textContent = label;
    bTime.appendChild(o);
  }
}

function todayStr() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
bDate.min = todayStr();

function setType(type) {
  bType.value = type;
  const hall = type === 'hall';
  gMax = hall ? 100 : 20;
  gLabel.textContent = hall ? 'Guests (up to 100)' : 'Guests';
  $('#bookTitle').textContent = hall ? 'Enquire — Party Hall' : 'Book a table';
  $('#bookSubmit').textContent = hall ? 'Send Enquiry' : 'Request Booking';
  let g = parseInt(bGuests.value, 10) || 2;
  if (hall && g < 10) g = 50;
  bGuests.value = Math.min(g, gMax);
}
bType.addEventListener('change', () => setType(bType.value));

$('#gMinus').addEventListener('click', () => { bGuests.value = Math.max(1, (parseInt(bGuests.value, 10) || 2) - 1); });
$('#gPlus').addEventListener('click', () => { bGuests.value = Math.min(gMax, (parseInt(bGuests.value, 10) || 2) + 1); });

function openBooking(type = 'table') {
  formView.hidden = false;
  successView.hidden = true;
  $$('.field', form).forEach(f => f.classList.remove('error'));
  bDate.min = todayStr();
  setType(type);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  syncLock();
  setTimeout(() => bName.focus(), 380);
}
function closeBooking() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  syncLock();
}
$$('[data-book]').forEach(b => b.addEventListener('click', () => openBooking(b.dataset.book)));
$('#bookClose').addEventListener('click', closeBooking);
$('#bookDone').addEventListener('click', closeBooking);
$('.modal-backdrop', modal).addEventListener('click', closeBooking);
modal.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeBooking(); });

function fieldError(name, on) {
  const f = $(`.field[data-field="${name}"]`, form);
  if (f) f.classList.toggle('error', on);
  return !on;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = bName.value.trim();
  let phone = bPhone.value.replace(/\D/g, '');
  if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
  const date = bDate.value;
  const time = bTime.value;
  const guests = parseInt(bGuests.value, 10) || 0;

  let ok = true;
  ok = fieldError('name', name.length < 2) && ok;
  ok = fieldError('phone', !/^[6-9]\d{9}$/.test(phone)) && ok;
  ok = fieldError('date', !date || date < todayStr()) && ok;
  ok = fieldError('time', !time) && ok;
  if (!ok) {
    $('.field.error input, .field.error select', form)?.focus();
    return;
  }

  const booking = { name, phone, type: bType.value, guests, date, time, notes: bNotes.value.trim(), ts: Date.now() };
  try {
    const all = JSON.parse(localStorage.getItem('msb-bookings') || '[]');
    all.push(booking);
    localStorage.setItem('msb-bookings', JSON.stringify(all));
  } catch (_) { /* storage unavailable — request still shown */ }

  const d = new Date(date + 'T00:00:00');
  const dateNice = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeNice = bTime.options[bTime.selectedIndex].textContent;
  const what = booking.type === 'hall' ? `Party hall enquiry · ${guests} guests` : `Table for ${guests}`;
  $('#sumLine').textContent = `${what} · ${dateNice} at ${timeNice}`;
  $('#sumPhone').textContent = `Thank you, ${name} — our team will call +91 ${phone.slice(0, 5)} ${phone.slice(5)} shortly to confirm.`;

  formView.hidden = true;
  successView.hidden = false;
  toast('Booking request received');
});

/* ═══════════ TOAST ═══════════ */
const toastEl = $('#toast');
let toastT = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* ═══════════ KEYBOARD ═══════════ */
addEventListener('keydown', e => {
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') showShot(lbI - 1);
    if (e.key === 'ArrowRight') showShot(lbI + 1);
    return;
  }
  if (e.key === 'Escape') {
    if (modal.classList.contains('open')) closeBooking();
    else if (document.body.classList.contains('menu-open')) setMenu(false);
  }
});

/* ═══════════ MAGNETIC BUTTONS ═══════════ */
if (FINE && !RM) {
  $$('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      btn.style.transform = `translate(${(dx * 7).toFixed(1)}px, ${(dy * 5 - 2).toFixed(1)}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ═══════════ MISC ═══════════ */
$('#year').textContent = new Date().getFullYear();
addEventListener('load', syncInd);
syncInd();

})();