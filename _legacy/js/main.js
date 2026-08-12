// ============================================
// MUBI — Interactions + bouncing profile frame
// ============================================

const GLOW_MS = 2000;

// --- Preloader ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
    document.body.classList.remove('loading');
  }, 1400);
  setTimeout(() => {
    const p = document.getElementById('preloader');
    if (p && !p.classList.contains('hidden')) {
      p.classList.add('hidden');
      document.body.classList.remove('loading');
    }
  }, 4000);
});

// --- Custom Cursor ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
  }
});

function animateCursor() {
  ringX += (cursorX - ringX) * 0.15;
  ringY += (cursorY - ringY) * 0.15;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .work-card, .capability-card, .service-row, .orbit-node, .page-card').forEach((el) => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

if (window.matchMedia('(hover: none)').matches) {
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
}

// --- Navigation ---
const nav = document.getElementById('site-nav');
const mobileMenu = document.getElementById('mobile-menu');
const navBurger = document.getElementById('nav-burger');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

if (navBurger) {
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    if (mobileMenu) {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    }
  });
}

if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navBurger) navBurger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Scroll Reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// --- Yellow stain hover ---
document.querySelectorAll('.work-card, .capability-card, .portrait-frame, .btn, .service-row').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--stain-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--stain-y', (e.clientY - rect.top) + 'px');
  });
});

// --- Smooth scroll only for same-page hash links ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Inner pages: keep nav solid
if (document.body.classList.contains('page-inner') && nav) {
  nav.classList.add('scrolled');
}

// --- Parallax on section labels ---
window.addEventListener('scroll', () => {
  const vh = window.innerHeight;
  document.querySelectorAll('.section-label').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      el.style.transform = `translateX(${(rect.top + rect.height / 2 - vh / 2) * -0.1}px)`;
    }
  });
});

// --- Keyboard ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    if (navBurger) navBurger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// --- Work card label hover ---
document.querySelectorAll('.work-art').forEach((art) => {
  art.addEventListener('mouseenter', () => {
    const label = art.querySelector('.work-art-label');
    if (label) label.style.letterSpacing = '0.35em';
  });
  art.addEventListener('mouseleave', () => {
    const label = art.querySelector('.work-art-label');
    if (label) label.style.letterSpacing = '0.2em';
  });
});

// --- Contact form (demo) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const prev = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'SENT — THANK YOU';
      btn.disabled = true;
    }
    setTimeout(() => {
      contactForm.reset();
      if (btn) {
        btn.textContent = prev;
        btn.disabled = false;
      }
    }, 2200);
  });
}

// ============================================
// BOUNCING PROFILE BOX + WALL-HIT GLOW (1.5s)
// ============================================

const screenGlow = document.getElementById('screen-glow');
const bounceArena = document.getElementById('bounce-arena');
const bounceBox = document.getElementById('bounce-box');
const bounceEdge = document.getElementById('bounce-edge');
const ownerImg = document.getElementById('owner-img');
const aboutOwnerImg = document.getElementById('about-owner-img');
const portraitGlow = document.getElementById('portrait-yellow-glow');

let glowTimeout = null;
let lastGlowTime = 0;

function replayClass(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function triggerWallGlow() {
  const now = performance.now();
  // Allow retrigger after glow mostly finishes
  if (now - lastGlowTime < GLOW_MS - 100) return;
  lastGlowTime = now;

  replayClass(screenGlow, 'active');
  replayClass(bounceEdge, 'active');
  replayClass(ownerImg, 'glow');
  replayClass(aboutOwnerImg, 'glow');
  replayClass(portraitGlow, 'active');

  if (glowTimeout) clearTimeout(glowTimeout);
  glowTimeout = setTimeout(() => {
    if (screenGlow) screenGlow.classList.remove('active');
    if (bounceEdge) bounceEdge.classList.remove('active');
    if (ownerImg) ownerImg.classList.remove('glow');
    if (aboutOwnerImg) aboutOwnerImg.classList.remove('glow');
    if (portraitGlow) portraitGlow.classList.remove('active');
  }, GLOW_MS + 40);
}

function initBounceBox() {
  if (!bounceArena || !bounceBox) return;

  let x = 40;
  let y = 120;
  let vx = 1.75;
  let vy = 1.35;
  let boxW = bounceBox.offsetWidth;
  let boxH = bounceBox.offsetHeight;
  let arenaW = bounceArena.clientWidth;
  let arenaH = bounceArena.clientHeight;
  let lastTs = 0;
  let ready = false;

  function measure() {
    boxW = bounceBox.offsetWidth;
    boxH = bounceBox.offsetHeight;
    arenaW = bounceArena.clientWidth;
    arenaH = bounceArena.clientHeight;
    x = Math.min(Math.max(0, x), Math.max(0, arenaW - boxW));
    y = Math.min(Math.max(0, y), Math.max(0, arenaH - boxH));
  }

  // Start mid-arena, angled so it hits soon
  measure();
  x = Math.max(24, arenaW * 0.18);
  y = Math.max(80, arenaH * 0.28);
  bounceBox.style.transform = `translate(${x}px, ${y}px)`;
  ready = true;

  window.addEventListener('resize', () => {
    measure();
    bounceBox.style.transform = `translate(${x}px, ${y}px)`;
  });

  function tick(ts) {
    if (!ready) {
      requestAnimationFrame(tick);
      return;
    }

    if (!lastTs) lastTs = ts;
    // Cap delta so tab-switch doesn't teleport
    const dt = Math.min(32, ts - lastTs) / 16.6667;
    lastTs = ts;

    x += vx * dt;
    y += vy * dt;

    let hit = false;

    if (x <= 0) {
      x = 0;
      vx = Math.abs(vx);
      hit = true;
    } else if (x + boxW >= arenaW) {
      x = arenaW - boxW;
      vx = -Math.abs(vx);
      hit = true;
    }

    if (y <= 0) {
      y = 0;
      vy = Math.abs(vy);
      hit = true;
    } else if (y + boxH >= arenaH) {
      y = arenaH - boxH;
      vy = -Math.abs(vy);
      hit = true;
    }

    bounceBox.style.transform = `translate(${x}px, ${y}px)`;

    if (hit) triggerWallGlow();

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

initBounceBox();

console.log('%cMUBI®', 'font-size: 3rem; font-weight: 700; color: #fce83a; font-family: monospace;');
console.log('%cPORTFOLIO · WALL-HIT GLOW 1.5s', 'font-size: 0.8rem; color: #555; font-family: monospace; letter-spacing: 0.3em;');
