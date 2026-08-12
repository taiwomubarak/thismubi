import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type FooterLink = { to: string; label: string; external?: boolean };

type FooterProps = {
  extraLinks?: FooterLink[];
  copyright?: string;
  right?: ReactNode;
};

export default function Footer({
  extraLinks,
  copyright = '© 2026 MUBI',
  right,
}: FooterProps) {
  return (
    <footer className="site-footer-mini">
      <div className="container footer-mini-inner">
        <span className="mono">{copyright}</span>
        {extraLinks ? (
          <div className="footer-mini-links">
            {extraLinks.map((link) =>
              link.external ? (
                <a key={link.to + link.label} href={link.to} className="mono">
                  {link.label}
                </a>
              ) : (
                <Link key={link.to + link.label} to={link.to} className="mono">
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ) : right ? (
          <span className="mono">{right}</span>
        ) : (
          <Link to="/contact" className="mono">
            CONTACT →
          </Link>
        )}
      </div>
    </footer>
  );
}
