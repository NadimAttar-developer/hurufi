import { Link } from 'react-router-dom';
import markUrl from '../assets/hurufi-mark.svg';

export function LogoMark({ size = 44 }: { size?: number }) {
  return <img src={markUrl} alt="" width={size} height={size} style={{ display: 'block' }} />;
}

export function Logo({ size = 44, to = '/' }: { size?: number; to?: string }) {
  return (
    <Link
      to={to}
      aria-label="حروفي، الصفحة الرئيسية"
      style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
    >
      <LogoMark size={size} />
      <span className="display" style={{ fontSize: size * 0.72, lineHeight: 1 }}>
        حروفي
      </span>
    </Link>
  );
}
