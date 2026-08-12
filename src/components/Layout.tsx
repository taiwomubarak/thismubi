import { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav';
import MobileMenu from './MobileMenu';
import Preloader, { type PreloaderHandle } from './Preloader';
import styles from '../styles/Layout.module.css';

export type OutletContext = { dismissPreloader?: () => void };

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const preloaderRef = useRef<PreloaderHandle>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => {
      const next = !open;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  // Body page classes
  useEffect(() => {
    document.body.classList.toggle('page-home', isHome);
    document.body.classList.toggle('page-inner', !isHome);
    return () => {
      document.body.classList.remove('page-home', 'page-inner');
    };
  }, [isHome]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Custom cursor
  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    if (!cursorDot || !cursorRing) return undefined;

    if (window.matchMedia('(hover: none)').matches) {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
      return undefined;
    }

    let cursorX = 0;
    let cursorY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
    };

    const animateCursor = () => {
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      raf = requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animateCursor);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Cursor hover targets + yellow stain + scroll reveal + work-art hover (rebind on route)
  useEffect(() => {
    const hoverSelector =
      'a, button, .work-card, .capability-card, .service-row, .orbit-node, .page-card';
    const hoverEls = document.querySelectorAll(hoverSelector);
    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const stainSelector = '.work-card, .capability-card, .portrait-frame, .btn, .service-row';
    const stainEls = document.querySelectorAll<HTMLElement>(stainSelector);
    const onStain = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--stain-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--stain-y', `${e.clientY - rect.top}px`);
    };
    stainEls.forEach((card) => card.addEventListener('mousemove', onStain));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    const workArts = document.querySelectorAll<HTMLElement>('.work-art');
    const onArtEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const label = target.querySelector<HTMLElement>('.work-art-label');
      if (label) label.style.letterSpacing = '0.35em';
    };
    const onArtLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const label = target.querySelector<HTMLElement>('.work-art-label');
      if (label) label.style.letterSpacing = '0.2em';
    };
    workArts.forEach((art) => {
      art.addEventListener('mouseenter', onArtEnter);
      art.addEventListener('mouseleave', onArtLeave);
    });

    return () => {
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      stainEls.forEach((card) => card.removeEventListener('mousemove', onStain));
      revealObserver.disconnect();
      workArts.forEach((art) => {
        art.removeEventListener('mouseenter', onArtEnter);
        art.removeEventListener('mouseleave', onArtLeave);
      });
      document.body.classList.remove('cursor-hover');
    };
  }, [location.pathname]);

  // Section-label parallax
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('.section-label').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          el.style.transform = `translateX(${(rect.top + rect.height / 2 - vh / 2) * -0.1}px)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Escape closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  const dismissPreloader = useCallback(() => {
    preloaderRef.current?.dismiss();
  }, []);

  const outletContext: OutletContext = { dismissPreloader };

  return (
    <div className={styles.shell}>
      {isHome && <Preloader ref={preloaderRef} />}
      <div id="screen-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      <Nav menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />

      <Outlet context={outletContext} />
    </div>
  );
}
