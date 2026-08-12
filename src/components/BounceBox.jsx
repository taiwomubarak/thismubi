import { useEffect, useRef } from 'react';

const GLOW_MS = 2000;

function replayClass(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

export default function BounceBox() {
  const arenaRef = useRef(null);
  const boxRef = useRef(null);
  const edgeRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const bounceArena = arenaRef.current;
    const bounceBox = boxRef.current;
    const bounceEdge = edgeRef.current;
    const ownerImg = imgRef.current;
    if (!bounceArena || !bounceBox) return undefined;

    const screenGlow = document.getElementById('screen-glow');
    const aboutOwnerImg = document.getElementById('about-owner-img');
    const portraitGlow = document.getElementById('portrait-yellow-glow');

    let glowTimeout = null;
    let lastGlowTime = 0;

    function triggerWallGlow() {
      const now = performance.now();
      if (now - lastGlowTime < GLOW_MS - 100) return;
      lastGlowTime = now;

      replayClass(screenGlow, 'active');
      replayClass(bounceEdge, 'active');
      replayClass(ownerImg, 'glow');
      replayClass(aboutOwnerImg, 'glow');
      replayClass(portraitGlow, 'active');

      if (glowTimeout) clearTimeout(glowTimeout);
      glowTimeout = setTimeout(() => {
        screenGlow?.classList.remove('active');
        bounceEdge?.classList.remove('active');
        ownerImg?.classList.remove('glow');
        aboutOwnerImg?.classList.remove('glow');
        portraitGlow?.classList.remove('active');
      }, GLOW_MS + 40);
    }

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
    let raf = 0;

    function measure() {
      boxW = bounceBox.offsetWidth;
      boxH = bounceBox.offsetHeight;
      arenaW = bounceArena.clientWidth;
      arenaH = bounceArena.clientHeight;
      x = Math.min(Math.max(0, x), Math.max(0, arenaW - boxW));
      y = Math.min(Math.max(0, y), Math.max(0, arenaH - boxH));
    }

    measure();
    x = Math.max(24, arenaW * 0.18);
    y = Math.max(80, arenaH * 0.28);
    bounceBox.style.transform = `translate(${x}px, ${y}px)`;
    ready = true;

    const onResize = () => {
      measure();
      bounceBox.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('resize', onResize);

    function tick(ts) {
      if (!ready) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!lastTs) lastTs = ts;
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

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (glowTimeout) clearTimeout(glowTimeout);
    };
  }, []);

  return (
    <div id="bounce-arena" className="bounce-arena" aria-hidden="true" ref={arenaRef}>
      <div id="bounce-box" className="bounce-box" ref={boxRef}>
        <div className="bounce-edge" id="bounce-edge" ref={edgeRef} />
        <img
          id="owner-img"
          className="bounce-img"
          src="/assets/owner.png"
          alt="Mubi profile"
          draggable="false"
          ref={imgRef}
        />
        <div className="bounce-caption mono">FIG.01</div>
      </div>
    </div>
  );
}
