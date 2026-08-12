import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

type NavLinkItem = {
  to: string;
  label: string;
  end?: boolean;
  cta?: boolean;
};

const LINKS: NavLinkItem[] = [
  { to: '/', label: 'HOME', end: true },
  { to: '/about', label: 'ABOUT' },
  { to: '/skills', label: 'SKILLS' },
  { to: '/what-i-do', label: 'WHAT I DO' },
  { to: '/work', label: 'WORK' },
  { to: '/process', label: 'PROCESS' },
  { to: '/contact', label: 'CONTACT', cta: true },
];

type NavProps = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export default function Nav({ menuOpen, onToggleMenu }: NavProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return undefined;
    }

    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, location.pathname]);

  return (
    <nav id="site-nav" className={scrolled ? 'scrolled' : undefined}>
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo" aria-label="Mubi home" end>
          <img src="/assets/logo.png" alt="mubi" className="nav-logo-img" />
        </NavLink>
        <div className="nav-links">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                ['nav-link', link.cta ? 'nav-cta' : '', isActive ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
              data-hover=""
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <button
          className={`nav-burger${menuOpen ? ' active' : ''}`}
          id="nav-burger"
          aria-label="Menu"
          type="button"
          onClick={onToggleMenu}
        >
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
