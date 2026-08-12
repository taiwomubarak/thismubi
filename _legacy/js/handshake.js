// ============================================
// MUBI — Soul handshake gate (drag to unlock)
// ============================================

(function initHandshake() {
  const stage = document.getElementById('handshake-stage');
  const svg = document.getElementById('souls-svg');
  const hand = document.getElementById('hand-drag');
  const target = document.getElementById('hand-target');
  const armPath = document.getElementById('arm-left-path');
  const armLine = document.getElementById('arm-left-path-line');
  const claspBurst = document.getElementById('clasp-burst');
  const gate = document.getElementById('handshake-gate');
  const unlock = document.getElementById('contact-unlock');
  const hint = document.getElementById('handshake-hint');
  const lead = document.getElementById('handshake-lead');
  const localGlow = document.getElementById('handshake-glow');
  const screenGlow = document.getElementById('screen-glow');

  if (!stage || !svg || !hand || !target) return;

  const GLOW_MS = 2000;
  const SNAP = 42; // px in SVG coords (approx via CTM)
  const SHOULDER = { x: 200, y: 210 };
  const HOME = { x: 280, y: 230 };
  const TARGET = { x: 360, y: 230 };

  let dragging = false;
  let done = false;
  let pos = { ...HOME };

  function setHand(x, y) {
    pos.x = x;
    pos.y = y;
    hand.setAttribute('transform', `translate(${x} ${y})`);
    const d = `M${SHOULDER.x} ${SHOULDER.y} Q${(SHOULDER.x + x) / 2} ${(SHOULDER.y + y) / 2 - 18} ${x} ${y}`;
    if (armPath) armPath.setAttribute('d', d);
    if (armLine) armLine.setAttribute('d', d);
  }

  function svgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: HOME.x, y: HOME.y };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function replay(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function triggerYellowGlow() {
    replay(screenGlow, 'active');
    replay(localGlow, 'active');
    setTimeout(() => {
      if (screenGlow) screenGlow.classList.remove('active');
      if (localGlow) localGlow.classList.remove('active');
    }, GLOW_MS + 40);
  }

  function unlockContact() {
    if (done) return;
    done = true;
    dragging = false;
    hand.classList.remove('is-dragging');
    hand.classList.add('is-locked');
    setHand(TARGET.x, TARGET.y);

    if (claspBurst) {
      claspBurst.setAttribute('opacity', '1');
      claspBurst.classList.add('active');
    }
    stage.classList.add('is-shaken');
    if (hint) hint.textContent = 'HANDSHAKE · SOULS CONNECTED';
    if (lead) lead.textContent = 'Connected. The channel is open — send a message.';

    triggerYellowGlow();

    // Reveal contact after glow peaks
    setTimeout(() => {
      if (gate) gate.classList.add('is-done');
      if (unlock) {
        unlock.hidden = false;
        unlock.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
          unlock.classList.add('is-open');
          unlock.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        });
        const first = unlock.querySelector('input');
        if (first) setTimeout(() => first.focus({ preventScroll: false }), 400);
      }
      unlock?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  }

  function onPointerDown(e) {
    if (done) return;
    e.preventDefault();
    dragging = true;
    hand.classList.add('is-dragging');
    hand.setPointerCapture?.(e.pointerId);
    const p = svgPoint(e.clientX, e.clientY);
    setHand(p.x, p.y);
  }

  function onPointerMove(e) {
    if (!dragging || done) return;
    e.preventDefault();
    const p = svgPoint(e.clientX, e.clientY);
    // keep roughly in stage
    const x = Math.max(190, Math.min(400, p.x));
    const y = Math.max(160, Math.min(290, p.y));
    setHand(x, y);

    if (dist(pos, TARGET) < SNAP) {
      unlockContact();
    }
  }

  function onPointerUp(e) {
    if (done) return;
    dragging = false;
    hand.classList.remove('is-dragging');
    if (dist(pos, TARGET) < SNAP) {
      unlockContact();
      return;
    }
    // spring back
    setHand(HOME.x, HOME.y);
  }

  hand.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // Keyboard: Arrow keys nudge, Enter snaps if close
  hand.addEventListener('keydown', (e) => {
    if (done) return;
    const step = e.shiftKey ? 12 : 6;
    if (e.key === 'ArrowLeft') { setHand(pos.x - step, pos.y); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setHand(pos.x + step, pos.y); e.preventDefault(); }
    if (e.key === 'ArrowUp') { setHand(pos.x, pos.y - step); e.preventDefault(); }
    if (e.key === 'ArrowDown') { setHand(pos.x, pos.y + step); e.preventDefault(); }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (dist(pos, TARGET) < SNAP * 1.6) unlockContact();
      else setHand(Math.min(pos.x + 40, TARGET.x), TARGET.y);
    }
    if (dist(pos, TARGET) < SNAP) unlockContact();
  });

  setHand(HOME.x, HOME.y);
})();
