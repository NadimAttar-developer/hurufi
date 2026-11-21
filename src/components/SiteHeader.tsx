import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { Icon } from './Icon';
import styles from './SiteHeader.module.css';

const LINKS = [
  { to: '/map', label: 'الكواكب' },
  { to: '/#activities', label: 'الألعاب' },
  { to: '/#how', label: 'كيف تعمل' },
  { to: '/parents', label: 'للأهل' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Logo />
        <nav aria-label="القائمة الرئيسية" className={styles.nav}>
          {LINKS.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.to} to={l.to} className={styles.link}>
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.to} to={l.to} className={styles.link}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className={styles.actions}>
          <Link to="/parents" className={`btn btn-secondary ${styles.small}`}>
            دخول
          </Link>
          <Link to="/map" className={`btn btn-primary ${styles.small} ${styles.hideMobile}`}>
            ابدأ الرحلة
          </Link>
          <button
            type="button"
            className={`icon-btn ${styles.menuBtn}`}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="القائمة" className={styles.mobileNav}>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/map" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
            ابدأ الرحلة
          </Link>
        </nav>
      )}
    </header>
  );
}
