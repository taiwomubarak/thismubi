import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'HOME', end: true },
  { to: '/about', label: 'ABOUT' },
  { to: '/skills', label: 'SKILLS' },
  { to: '/what-i-do', label: 'WHAT I DO' },
  { to: '/work', label: 'WORK' },
  { to: '/process', label: 'PROCESS' },
  { to: '/contact', label: 'CONTACT' },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mobile-menu">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          onClick={onClose}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}
