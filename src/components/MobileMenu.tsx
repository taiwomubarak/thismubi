import { NavLink } from 'react-router-dom';

type MobileLink = {
  to: string;
  label: string;
  end?: boolean;
};

const LINKS: MobileLink[] = [
  { to: '/', label: 'HOME', end: true },
  { to: '/about', label: 'ABOUT' },
  { to: '/skills', label: 'SKILLS' },
  { to: '/what-i-do', label: 'WHAT I DO' },
  { to: '/work', label: 'WORK' },
  { to: '/process', label: 'PROCESS' },
  { to: '/contact', label: 'CONTACT' },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
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
