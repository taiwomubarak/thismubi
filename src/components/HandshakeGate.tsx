import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

const GLOW_MS = 2000;
const SNAP = 42;
const SHOULDER = { x: 200, y: 210 };
const HOME = { x: 280, y: 230 };
const TARGET = { x: 360, y: 230 };

type Point = { x: number; y: number };

function replay(el: Element | null, cls: string) {
  if (!el) return;
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
}

type HandshakeGateProps = {
  onUnlock?: () => void;
  onLeadChange?: (lead: string) => void;
  children: ReactNode;
};

export default function HandshakeGate({ onUnlock, children, onLeadChange }: HandshakeGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [hint, setHint] = useState('DRAG THE YELLOW HAND → TOUCH THE OTHER');
  const [shaken, setShaken] = useState(false);
  const [gateDone, setGateDone] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const armPathRef = useRef<SVGPathElement>(null);
  const armLineRef = useRef<SVGPathElement>(null);
  const claspBurstRef = useRef<SVGGElement>(null);
  const localGlowRef = useRef<HTMLDivElement>(null);
  const unlockRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const posRef = useRef<Point>({ ...HOME });
  const draggingRef = useRef(false);
  const doneRef = useRef(false);

  const setHand = useCallback((x: number, y: number) => {
    posRef.current = { x, y };
    const hand = handRef.current;
    if (hand) hand.setAttribute('transform', `translate(${x} ${y})`);
    const d = `M${SHOULDER.x} ${SHOULDER.y} Q${(SHOULDER.x + x) / 2} ${(SHOULDER.y + y) / 2 - 18} ${x} ${y}`;
    armPathRef.current?.setAttribute('d', d);
    armLineRef.current?.setAttribute('d', d);
  }, []);

  const svgPoint = useCallback((clientX: number, clientY: number): Point => {
    const svg = svgRef.current;
    if (!svg) return { ...HOME };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { ...HOME };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }, []);

  const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const triggerYellowGlow = useCallback(() => {
    const screenGlow = document.getElementById('screen-glow');
    const localGlow = localGlowRef.current;
    replay(screenGlow, 'active');
    replay(localGlow, 'active');
    setTimeout(() => {
      screenGlow?.classList.remove('active');
      localGlow?.classList.remove('active');
    }, GLOW_MS + 40);
  }, []);

  const unlockContact = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    draggingRef.current = false;
    const hand = handRef.current;
    hand?.classList.remove('is-dragging');
    hand?.classList.add('is-locked');
    setHand(TARGET.x, TARGET.y);

    const claspBurst = claspBurstRef.current;
    if (claspBurst) {
      claspBurst.setAttribute('opacity', '1');
      claspBurst.classList.add('active');
    }
    setShaken(true);
    setHint('HANDSHAKE · SOULS CONNECTED');
    onLeadChange?.('Connected. The channel is open — send a message.');
    triggerYellowGlow();

    setTimeout(() => {
      setGateDone(true);
      setUnlocked(true);
      onUnlock?.();
      requestAnimationFrame(() => {
        unlockRef.current?.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        const first = unlockRef.current?.querySelector('input');
        if (first) setTimeout(() => (first as HTMLInputElement).focus({ preventScroll: false }), 400);
      });
      unlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  }, [onLeadChange, onUnlock, setHand, triggerYellowGlow]);

  useEffect(() => {
    setHand(HOME.x, HOME.y);
    const hand = handRef.current;
    if (!hand) return undefined;

    function onPointerDown(e: PointerEvent) {
      if (doneRef.current) return;
      e.preventDefault();
      draggingRef.current = true;
      hand!.classList.add('is-dragging');
      hand!.setPointerCapture?.(e.pointerId);
      const p = svgPoint(e.clientX, e.clientY);
      setHand(p.x, p.y);
    }

    function onPointerMove(e: PointerEvent) {
      if (!draggingRef.current || doneRef.current) return;
      e.preventDefault();
      const p = svgPoint(e.clientX, e.clientY);
      const x = Math.max(190, Math.min(400, p.x));
      const y = Math.max(160, Math.min(290, p.y));
      setHand(x, y);
      if (dist(posRef.current, TARGET) < SNAP) unlockContact();
    }

    function onPointerUp() {
      if (doneRef.current) return;
      draggingRef.current = false;
      hand!.classList.remove('is-dragging');
      if (dist(posRef.current, TARGET) < SNAP) {
        unlockContact();
        return;
      }
      setHand(HOME.x, HOME.y);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (doneRef.current) return;
      const step = e.shiftKey ? 12 : 6;
      const pos = posRef.current;
      if (e.key === 'ArrowLeft') {
        setHand(pos.x - step, pos.y);
        e.preventDefault();
      }
      if (e.key === 'ArrowRight') {
        setHand(pos.x + step, pos.y);
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') {
        setHand(pos.x, pos.y - step);
        e.preventDefault();
      }
      if (e.key === 'ArrowDown') {
        setHand(pos.x, pos.y + step);
        e.preventDefault();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (dist(posRef.current, TARGET) < SNAP * 1.6) unlockContact();
        else setHand(Math.min(posRef.current.x + 40, TARGET.x), TARGET.y);
      }
      if (dist(posRef.current, TARGET) < SNAP) unlockContact();
    }

    hand.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    hand.addEventListener('keydown', onKeyDown);

    return () => {
      hand.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      hand.removeEventListener('keydown', onKeyDown);
    };
  }, [setHand, svgPoint, unlockContact]);

  return (
    <>
      <div
        className={`handshake-gate${gateDone ? ' is-done' : ''}`}
        id="handshake-gate"
        aria-live="polite"
      >
        <div
          className={`handshake-stage${shaken ? ' is-shaken' : ''}`}
          id="handshake-stage"
          ref={stageRef}
        >
          <div className="handshake-glow" id="handshake-glow" aria-hidden="true" ref={localGlowRef} />

          <svg
            className="souls-svg"
            id="souls-svg"
            viewBox="0 0 640 360"
            role="img"
            aria-label="Two souls ready to handshake. Drag the left hand to the right hand."
            ref={svgRef}
          >
            <defs>
              <radialGradient id="soulGlowA" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fce83a" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fce83a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="soulGlowB" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fce83a" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#fce83a" stopOpacity="0" />
              </radialGradient>
              <filter id="softYellow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="170" cy="160" r="90" fill="url(#soulGlowA)" opacity="0.5" />
            <circle cx="470" cy="160" r="90" fill="url(#soulGlowB)" opacity="0.5" />

            <g className="soul soul-left" id="soul-left">
              <ellipse cx="170" cy="230" rx="42" ry="58" fill="#141414" stroke="#2a2a2a" strokeWidth="2" />
              <ellipse
                cx="170"
                cy="230"
                rx="28"
                ry="40"
                fill="none"
                stroke="#fce83a"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
              <circle cx="170" cy="145" r="36" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
              <circle
                cx="170"
                cy="145"
                r="22"
                fill="none"
                stroke="#fce83a"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
              <circle cx="158" cy="142" r="2.5" fill="#9a9a9a" />
              <circle cx="182" cy="142" r="2.5" fill="#9a9a9a" />
              <path
                d="M160 158 Q170 166 180 158"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="162" y="178" width="16" height="14" rx="4" fill="#1a1a1a" />
              <path
                d="M140 210 Q118 230 112 268"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M140 210 Q118 230 112 268"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                id="arm-left-path"
                ref={armPathRef}
                d="M200 210 Q240 220 280 230"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                id="arm-left-path-line"
                ref={armLineRef}
                d="M200 210 Q240 220 280 230"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text x="170" y="320" textAnchor="middle" className="soul-caption">
                YOU
              </text>
            </g>

            <g className="soul soul-right" id="soul-right">
              <ellipse cx="470" cy="230" rx="42" ry="58" fill="#141414" stroke="#2a2a2a" strokeWidth="2" />
              <ellipse
                cx="470"
                cy="230"
                rx="28"
                ry="40"
                fill="none"
                stroke="#fce83a"
                strokeOpacity="0.18"
                strokeWidth="1"
              />
              <circle cx="470" cy="145" r="36" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="2" />
              <circle
                cx="470"
                cy="145"
                r="22"
                fill="none"
                stroke="#fce83a"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
              <circle cx="458" cy="142" r="2.5" fill="#9a9a9a" />
              <circle cx="482" cy="142" r="2.5" fill="#9a9a9a" />
              <path
                d="M460 158 Q470 166 480 158"
                fill="none"
                stroke="#555"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="462" y="178" width="16" height="14" rx="4" fill="#1a1a1a" />
              <path
                d="M500 210 Q522 230 528 268"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M500 210 Q522 230 528 268"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M440 210 Q400 220 360 230"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M440 210 Q400 220 360 230"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <g id="hand-target" transform="translate(360 230)">
                <circle r="18" fill="#0c0c0c" stroke="#fce83a" strokeWidth="2" strokeOpacity="0.55" />
                <circle r="8" fill="#fce83a" fillOpacity="0.25" />
                <path
                  d="M-6 -4 L6 -4 M-6 2 L6 2 M-4 8 L4 8"
                  stroke="#fce83a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>
              <text x="470" y="320" textAnchor="middle" className="soul-caption">
                MUBI
              </text>
            </g>

            <g
              id="hand-drag"
              className="hand-drag"
              transform="translate(280 230)"
              tabIndex={0}
              role="button"
              aria-label="Drag this hand to Mubi's hand"
              ref={handRef}
            >
              <circle className="hand-hit" r="26" fill="transparent" />
              <circle className="hand-body" r="18" fill="#111" stroke="#fce83a" strokeWidth="2.5" />
              <circle r="7" fill="#fce83a" fillOpacity="0.35" />
              <path
                d="M-6 -4 L6 -4 M-6 2 L6 2 M-4 8 L4 8"
                stroke="#fce83a"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle className="hand-pulse" r="22" fill="none" stroke="#fce83a" strokeOpacity="0.35" />
            </g>

            <g
              id="clasp-burst"
              className="clasp-burst"
              opacity="0"
              pointerEvents="none"
              ref={claspBurstRef}
            >
              <circle
                cx="320"
                cy="230"
                r="28"
                fill="#fce83a"
                fillOpacity="0.35"
                filter="url(#softYellow)"
              />
              <circle cx="320" cy="230" r="10" fill="#fce83a" />
            </g>
          </svg>

          <p className="handshake-hint mono" id="handshake-hint">
            {hint}
          </p>
        </div>
      </div>

      <div
        className={`contact-unlock${unlocked ? ' is-open' : ''}`}
        id="contact-unlock"
        hidden={!unlocked}
        aria-hidden={!unlocked}
        ref={unlockRef}
      >
        {unlocked ? children : null}
      </div>
    </>
  );
}
