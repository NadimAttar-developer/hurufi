import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { toArabicDigits } from '../lib/arabic';

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--space-950)', color: 'var(--space-50)' }}>
      <div
        className="container"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', paddingBlock: 40 }}
      >
        <Logo size={36} />
        <nav aria-label="روابط التذييل" style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontWeight: 600, fontSize: 15 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>عن حروفي</Link>
          <Link to="/parents" style={{ textDecoration: 'none' }}>للأهل</Link>
          <span className="muted">الخصوصية</span>
          <span className="muted">تواصل معنا</span>
        </nav>
        <span style={{ fontSize: 14, color: 'var(--space-200)' }}>© {toArabicDigits(new Date().getFullYear())} حروفي</span>
      </div>
    </footer>
  );
}
