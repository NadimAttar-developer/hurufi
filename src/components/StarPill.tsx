import { Icon } from './Icon';
import { starsText, toArabicDigits } from '../lib/arabic';

export function StarPill({ count }: { count: number }) {
  return (
    <span
      role="img"
      aria-label={starsText(count)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 999,
        background: 'var(--surface-raised)',
        fontWeight: 800,
        fontSize: 17,
        flexShrink: 0,
      }}
    >
      <Icon name="star" size={20} style={{ color: 'var(--star-500)' }} />
      {toArabicDigits(count)}
    </span>
  );
}
