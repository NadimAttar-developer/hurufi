import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Planet, type PlanetState } from '../components/Planet';
import { StarPill } from '../components/StarPill';
import { DAD_INDEX, LETTERS } from '../data/letters';
import { ACTIVITIES, ACTIVITY_LABELS } from '../data/lessons';
import { useProgress } from '../state/ProgressContext';
import { useMediaQuery } from '../lib/useMediaQuery';
import { starsText, toArabicDigits } from '../lib/arabic';
import styles from './MapPage.module.css';

interface Layout {
  cols: number;
  sx: number;
  sy: number;
  mx: number;
  my: number;
  size: number;
  bulge: number;
}

const DESKTOP: Layout = { cols: 7, sx: 112, sy: 140, mx: 64, my: 70, size: 76, bulge: 46 };
const PHONE: Layout = { cols: 3, sx: 110, sy: 124, mx: 69, my: 60, size: 64, bulge: 44 };

/** Positions the 28 planets along a winding path that reads right-to-left, then turns. */
function useMapGeometry(layout: Layout) {
  return useMemo(() => {
    const W = layout.mx * 2 + (layout.cols - 1) * layout.sx;
    const rows = Math.ceil(LETTERS.length / layout.cols);
    const H = layout.my * 2 + (rows - 1) * layout.sy + 40;
    const points = LETTERS.map((_, i) => {
      const r = Math.floor(i / layout.cols);
      const col = i % layout.cols;
      const fromRight = r % 2 === 0 ? col : layout.cols - 1 - col;
      return [W - layout.mx - fromRight * layout.sx, layout.my + r * layout.sy] as const;
    });
    const pathTo = (upto: number) => {
      let d = `M${points[0][0]} ${points[0][1]}`;
      for (let i = 1; i <= upto; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        if (ay === by) d += ` L${bx} ${by}`;
        else {
          const dx = ax < W / 2 ? -layout.bulge : layout.bulge;
          d += ` C${ax + dx} ${ay} ${ax + dx} ${by} ${bx} ${by}`;
        }
      }
      return d;
    };
    return { W, H, points, pathTo };
  }, [layout]);
}

export function MapPage() {
  const progress = useProgress();
  const { current, stars, planetStars, planets } = progress;
  const location = useLocation();
  const isPhone = useMediaQuery('(max-width: 700px)');
  const layout = isPhone ? PHONE : DESKTOP;
  const { W, H, points, pathTo } = useMapGeometry(layout);
  const initialSelect = (location.state as { select?: number } | null)?.select ?? current;
  const [selected, setSelected] = useState(initialSelect);

  const stateOf = (i: number): PlanetState => (i < current ? 'done' : i === current ? 'current' : 'locked');
  const sel = LETTERS[selected];
  const selState = stateOf(selected);
  const doneActivities = planets[sel.slug]?.activities ?? [];
  const nextActivity = ACTIVITIES.find((a) => !doneActivities.includes(a)) ?? 'listen';
  const selStars = planetStars(sel.slug);

  let info: string;
  if (selState === 'done') info = `أكملت هذا الكوكب وجمعت ${starsText(selStars)} من ٣. يمكنك اللعب فيه مرة أخرى متى شئت.`;
  else if (selState === 'current') {
    const left = ACTIVITIES.length - doneActivities.length;
    info = left === ACTIVITIES.length ? 'أنت هنا الآن. أربعة أنشطة تنتظرك في هذا الكوكب.' : `أنت هنا الآن. بقي لك ${toArabicDigits(left)} من ٤ أنشطة.`;
  } else if (selected === DAD_INDEX) info = `العربية تُسمّى «لغة الضاد». يُفتح هذا الكوكب بعد أن تكمل كوكب ${LETTERS[DAD_INDEX - 1].name}.`;
  else info = `يُفتح هذا الكوكب بعد أن تكمل كوكب ${LETTERS[selected - 1].name}.`;

  const stateLabel = { done: 'مكتمل', current: 'المحطة الحالية', locked: 'مقفل' } as const;

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div className={`container ${styles.topBar}`}>
          <Link to="/" className="icon-btn" aria-label="العودة إلى الصفحة الرئيسية">
            <Icon name="arrowBack" strokeWidth={2.5} />
          </Link>
          <h1 className={`display ${styles.title}`}>خريطة الحروف</h1>
          <div className={styles.progress}>
            <div className={styles.progressText}>
              <span>أكملت {toArabicDigits(current)} من ٢٨ كوكبًا</span>
              <div
                role="progressbar"
                aria-label="الكواكب المكتملة"
                aria-valuemin={0}
                aria-valuemax={28}
                aria-valuenow={current}
                className={styles.track}
              >
                <div className={styles.fill} style={{ width: `${(current / 28) * 100}%` }} />
              </div>
            </div>
            <StarPill count={stars} />
          </div>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <section aria-label="الكواكب الثمانية والعشرون" className={`card stars-bg ${styles.board}`}>
          <div className={styles.canvas} style={{ width: W, height: H }}>
            <svg width={W} height={H} className={styles.paths} aria-hidden="true">
              <path d={pathTo(LETTERS.length - 1)} fill="none" stroke="var(--space-600)" strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" />
              <path d={pathTo(current)} fill="none" stroke="var(--meteor-500)" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
            </svg>
            {LETTERS.map((l, i) => {
              const st = stateOf(i);
              const [x, y] = points[i];
              return (
                <div key={l.slug} className={styles.station} style={{ left: x - 50, top: y - layout.size / 2 }}>
                  {st === 'current' && <span className={styles.here}>أنت هنا</span>}
                  <Planet
                    letter={l.char}
                    state={st}
                    size={layout.size}
                    selected={i === selected}
                    special={i === DAD_INDEX}
                    label={`كوكب ${l.name}، ${stateLabel[st]}`}
                    onClick={() => setSelected(i)}
                  />
                  <span className={styles.name} style={{ color: st === 'locked' ? 'var(--text-muted)' : 'var(--text)' }}>
                    {l.name}
                  </span>
                  {st === 'done' && (
                    <span className={styles.stars} aria-hidden="true">
                      {[0, 1, 2].map((s) => (
                        <Icon key={s} name="star" size={12} style={{ color: s < planetStars(l.slug) ? 'var(--star-500)' : 'var(--space-600)' }} />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside aria-live="polite" aria-label="الكوكب المختار" className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={`learn ${styles.panelLetter} ${styles['p_' + selState]} ${selected === DAD_INDEX ? styles.p_special : ''}`}>
              {sel.char}
            </span>
            <div className={styles.panelTitle}>
              <h2 className="display">كوكب {sel.name}</h2>
              <span className={`chip ${styles['chip_' + selState]}`}>{stateLabel[selState]}</span>
            </div>
          </div>
          <p className={styles.info}>{info}</p>
          <ol className={styles.acts} aria-label="أنشطة الكوكب">
            {ACTIVITIES.map((a) => {
              const done = selState === 'done' || doneActivities.includes(a);
              return (
                <li key={a} className={styles.act}>
                  {done ? (
                    <span className={styles.actDone}><Icon name="check" size={16} strokeWidth={3} /></span>
                  ) : (
                    <span className={styles.actTodo} />
                  )}
                  {ACTIVITY_LABELS[a]}
                  <span className="sr-only">{done ? '، تمّ' : '، لم يتمّ بعد'}</span>
                </li>
              );
            })}
          </ol>
          {selState === 'done' && (
            <Link to={`/planet/${sel.slug}`} className="btn btn-secondary btn-block">العب مرة أخرى</Link>
          )}
          {selState === 'current' && (
            <Link to={`/planet/${sel.slug}/${nextActivity}`} className="btn btn-primary btn-lg btn-block">
              تابع الرحلة <Icon name="arrowNext" strokeWidth={2.5} />
            </Link>
          )}
          {selState === 'locked' && (
            <button type="button" className="btn btn-block" disabled>
              <Icon name="lock" size={20} /> مقفل
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
