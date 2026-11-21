import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LogoMark } from '../components/Logo';
import { DEMO_CHILDREN, WEEK_DAYS, WEEK_DAYS_SHORT } from '../data/parentsDemo';
import { daysText, minutesText, toArabicDigits } from '../lib/arabic';
import { useMediaQuery } from '../lib/useMediaQuery';
import styles from './ParentsPage.module.css';

const SETTINGS_KEY = 'hurufi-parent-settings-v1';
const LIMITS = [15, 20, 30];
const SCALE_MAX = 30;

function loadSettings(): { limit: number; remind: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { limit: 20, remind: true, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { limit: 20, remind: true };
}

const DOT: Record<string, string> = {
  done: 'var(--meteor-700)',
  reward: 'var(--nebula-500)',
  start: 'var(--rocket-500)',
  practice: 'var(--space-400)',
};

export function ParentsPage() {
  const [kidIndex, setKidIndex] = useState(0);
  const [settings, setSettings] = useState(loadSettings);
  const [hover, setHover] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const isPhone = useMediaQuery('(max-width: 600px)');
  const kid = DEMO_CHILDREN[kidIndex];

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const played = kid.minutes.filter((m): m is number => m !== null);
  const total = played.reduce((a, b) => a + b, 0);
  const average = Math.round(total / Math.max(1, played.length));
  const overDays = played.filter((m) => m > settings.limit).length;
  const limitPct = (settings.limit / SCALE_MAX) * 100;

  return (
    <div className={`theme-day ${styles.page}`}>
      <header className={styles.header}>
        <div className={`container ${styles.headerBar}`}>
          <Link to="/" className={styles.brand} aria-label="حروفي، الصفحة الرئيسية">
            <LogoMark size={40} />
            <span className="display" style={{ fontSize: 28, lineHeight: 1 }}>حروفي</span>
            <span className={`chip ${styles.badge}`}>للأهل</span>
          </Link>
          <Link to="/map" className="btn btn-dark" style={{ minHeight: 48, fontSize: 15 }}>
            إلى عالم الطفل
          </Link>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <div className={styles.titleRow}>
          <div className={styles.titleBlock}>
            <div className={styles.titleLine}>
              <h1 className="display" style={{ fontSize: 'clamp(32px, 4vw, 40px)' }}>هذا الأسبوع</h1>
              <span className={`chip ${styles.example}`}>بيانات مثال</span>
            </div>
            <p className="muted">من السبت إلى الجمعة. يتجدّد التقرير كل سبت.</p>
          </div>
          <div role="tablist" aria-label="اختر الطفل" className={styles.kids}>
            {DEMO_CHILDREN.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === kidIndex}
                className={`${styles.kid} ${i === kidIndex ? styles.kidActive : ''}`}
                onClick={() => {
                  setKidIndex(i);
                  setHover(null);
                }}
              >
                <span className={`display ${styles.kidInitial}`} style={{ background: c.color }}>{c.initial}</span>
                <span className={styles.kidText}>
                  <strong>{c.name}</strong>
                  <small>{c.age}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tiles}>
          <div className={`card ${styles.tile}`}>
            <span className={styles.tileLabel}>كواكب مكتملة</span>
            <span className={`display ${styles.tileValue}`}>{toArabicDigits(kid.planetsDone)} من ٢٨</span>
            <div className={styles.miniTrack}><div style={{ width: `${(kid.planetsDone / 28) * 100}%` }} /></div>
          </div>
          <div className={`card ${styles.tile}`}>
            <span className={styles.tileLabel}>وقت التعلّم</span>
            <span className={`display ${styles.tileValue}`}>{minutesText(total)}</span>
            <span className={styles.tileNote}>بمعدّل {minutesText(average)} في اليوم</span>
          </div>
          <div className={`card ${styles.tile}`}>
            <span className={styles.tileLabel}>نجوم الأسبوع</span>
            <span className={`display ${styles.tileValue}`}>
              <Icon name="star" size={28} style={{ color: 'var(--star-700)' }} /> {toArabicDigits(kid.stars)}
            </span>
          </div>
          <div className={`card ${styles.tile}`}>
            <span className={styles.tileLabel}>أيام متتالية</span>
            <span className={`display ${styles.tileValue}`}>{daysText(kid.streak)}</span>
            <span className={styles.tileNote}>تعلّم كل يوم ولو قليلًا</span>
          </div>
        </div>

        <div className={styles.row}>
          <section aria-labelledby="chart-title" className={`card ${styles.chartCard}`}>
            <div className={styles.cardHead}>
              <div>
                <h2 id="chart-title" className={styles.h2}>دقائق التعلّم كل يوم</h2>
                <span className="muted" style={{ fontSize: 14 }}>
                  {overDays === 0 ? 'لا أيام فوق الحدّ اليومي هذا الأسبوع' : `أيام فوق الحدّ اليومي: ${toArabicDigits(overDays)}`}
                </span>
              </div>
              <button type="button" className={styles.toggle} aria-pressed={asTable} onClick={() => setAsTable((t) => !t)}>
                {asTable ? 'عرض الرسم' : 'عرض كجدول'}
              </button>
            </div>

            {asTable ? (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr><th scope="col">اليوم</th><th scope="col">الدقائق</th></tr>
                  </thead>
                  <tbody>
                    {kid.minutes.map((m, i) => (
                      <tr key={WEEK_DAYS[i]}>
                        <td>{WEEK_DAYS[i]}</td>
                        <td>{m === null ? 'لم يأتِ بعد' : toArabicDigits(m)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.chart}>
                <div className={styles.yAxis} aria-hidden="true">
                  {[30, 20, 10, 0].map((v) => (
                    <span key={v} style={{ bottom: `${(v / SCALE_MAX) * 100}%` }}>{toArabicDigits(v)}</span>
                  ))}
                </div>
                <div className={styles.plotWrap}>
                  <div className={styles.plot}>
                    {[10, 20, 30].map((v) => (
                      <div key={v} className={styles.grid} style={{ bottom: `${(v / SCALE_MAX) * 100}%` }} aria-hidden="true" />
                    ))}
                    <div className={styles.limit} style={{ bottom: `${limitPct}%` }} aria-hidden="true">
                      <span>الحدّ اليومي {toArabicDigits(settings.limit)} د</span>
                    </div>
                    <div className={styles.bars}>
                      {kid.minutes.map((m, i) => (
                        <div key={WEEK_DAYS[i]} className={styles.barSlot}>
                          {m === null ? (
                            <span role="img" aria-label={`${WEEK_DAYS[i]}: لم يأتِ بعد`} className={styles.future} />
                          ) : (
                            <button
                              type="button"
                              className={styles.barBtn}
                              aria-label={`${WEEK_DAYS[i]}: ${minutesText(m)}`}
                              onMouseEnter={() => setHover(i)}
                              onMouseLeave={() => setHover(null)}
                              onFocus={() => setHover(i)}
                              onBlur={() => setHover(null)}
                              onClick={() => setHover((h) => (h === i ? null : i))}
                            >
                              {hover === i && (
                                <span className={styles.tip} style={{ bottom: `calc(${(m / SCALE_MAX) * 100}% + 8px)` }}>
                                  {WEEK_DAYS[i]} · {m ? minutesText(m) : 'بلا تعلّم'}
                                </span>
                              )}
                              <span
                                className={styles.bar}
                                style={{ height: `${(Math.min(m, SCALE_MAX) / SCALE_MAX) * 100}%`, background: hover === i ? 'var(--meteor-900)' : 'var(--meteor-700)' }}
                              />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.xAxis} aria-hidden="true">
                    {(isPhone ? WEEK_DAYS_SHORT : WEEK_DAYS).map((d, i) => (
                      <span key={d} style={{ color: kid.minutes[i] === null ? 'var(--text-muted)' : 'var(--text)' }}>{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section aria-labelledby="letters-title" className={`card ${styles.lettersCard}`}>
            <h2 id="letters-title" className={styles.h2}>الحروف</h2>
            <LetterGroup title={`أتقنها · ${toArabicDigits(kid.mastered.length)}`} color="var(--meteor-900)" letters={kid.mastered} kind="mastered" />
            <LetterGroup
              title={`يحتاج مراجعة · ${toArabicDigits(kid.review.length)}`}
              color="var(--rocket-900)"
              letters={kid.review}
              kind="review"
              empty="لا حروف تحتاج مراجعة الآن."
            />
            <LetterGroup title="يتعلّمه الآن" color="var(--text-muted)" letters={kid.learning} kind="learning" />
          </section>
        </div>

        <div className={styles.row}>
          <section aria-labelledby="note-title" className={styles.note}>
            <span className={styles.noteEyebrow}><Icon name="bulb" size={20} /> ملاحظة الأسبوع</span>
            <h2 id="note-title" className="display" style={{ fontSize: 28 }}>{kid.insight.title}</h2>
            <p style={{ color: 'var(--space-100)' }}>{kid.insight.text}</p>
            <Link to="/map" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>{kid.insight.action}</Link>
          </section>

          <section aria-labelledby="recent-title" className={`card ${styles.listCard}`}>
            <h2 id="recent-title" className={styles.h2}>آخر الإنجازات</h2>
            <ul className={styles.recent}>
              {kid.recent.map((r) => (
                <li key={r.title}>
                  <span className={styles.dot} style={{ background: DOT[r.kind] }} />
                  <span style={{ flex: 1, fontWeight: 600 }}>{r.title}</span>
                  <span className="muted" style={{ fontSize: 14 }}>{r.when}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="settings-title" className={`card ${styles.listCard}`}>
            <h2 id="settings-title" className={styles.h2}>إعدادات {kid.name}</h2>
            <span id="limit-label" className={styles.tileLabel}>وقت اللعب اليومي</span>
            <div role="group" aria-labelledby="limit-label" className={styles.segments}>
              {LIMITS.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={settings.limit === v}
                  className={`${styles.segment} ${settings.limit === v ? styles.segmentOn : ''}`}
                  onClick={() => setSettings((s) => ({ ...s, limit: v }))}
                >
                  {minutesText(v)}
                </button>
              ))}
            </div>
            <label htmlFor="remind" className={styles.switchRow}>
              <span>تذكير يومي في الخامسة مساءً</span>
              <input
                id="remind"
                type="checkbox"
                checked={settings.remind}
                onChange={() => setSettings((s) => ({ ...s, remind: !s.remind }))}
              />
            </label>
          </section>
        </div>
      </main>
    </div>
  );
}

function LetterGroup(props: { title: string; color: string; letters: string[]; kind: 'mastered' | 'review' | 'learning'; empty?: string }) {
  const { title, color, letters, kind, empty } = props;
  return (
    <div className={styles.group}>
      <span style={{ fontSize: 15, fontWeight: 800, color }}>{title}</span>
      {letters.length === 0 ? (
        <span className="muted" style={{ fontSize: 15 }}>{empty}</span>
      ) : (
        <div className={styles.letterRow}>
          {letters.map((l) => (
            <span key={l} className={`learn ${styles.letter} ${styles[kind]}`}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
