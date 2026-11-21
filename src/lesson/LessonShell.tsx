import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { StarPill } from '../components/StarPill';
import { ACTIVITIES, ACTIVITY_LABELS, type Activity } from '../data/lessons';
import type { Letter } from '../data/letters';
import { useProgress } from '../state/ProgressContext';
import { speak, stopSpeaking } from '../lib/speech';
import { toArabicDigits } from '../lib/arabic';
import styles from './Lesson.module.css';

/** Speaks text unless the child has muted sound. */
export function useSpeak() {
  const { muted } = useProgress();
  return (text: string, rate?: number) => {
    if (!muted) speak(text, { rate });
  };
}

interface ShellProps {
  letter: Letter;
  activity: Activity;
  children: ReactNode;
  footer: ReactNode;
}

export function LessonShell({ letter, activity, children, footer }: ShellProps) {
  const { stars, muted, toggleMute, isActivityDone } = useProgress();
  const index = ACTIVITIES.indexOf(activity);

  return (
    <div className={`stars-bg ${styles.shell}`}>
      <header className={styles.top}>
        <div className={`container ${styles.topBar}`}>
          <Link to="/map" className="icon-btn" aria-label="خروج من الدرس إلى الخريطة" onClick={stopSpeaking}>
            <Icon name="close" strokeWidth={2.5} />
          </Link>
          <div className={styles.titles}>
            <span className={`display ${styles.planetName}`}>كوكب {letter.name}</span>
            <span className={styles.stepLabel}>
              النشاط {toArabicDigits(index + 1)} من ٤ · {ACTIVITY_LABELS[activity]}
            </span>
          </div>
          <StarPill count={stars} />
          <button
            type="button"
            className="icon-btn"
            aria-label={muted ? 'تشغيل الصوت' : 'إيقاف الصوت'}
            aria-pressed={muted}
            onClick={() => {
              stopSpeaking();
              toggleMute();
            }}
          >
            <Icon name={muted ? 'soundOff' : 'sound'} />
          </button>
        </div>
        <nav aria-label="أنشطة الدرس" className="container">
          <ol className={styles.steps}>
            {ACTIVITIES.map((a, i) => {
              const done = isActivityDone(letter.slug, a);
              const state = a === activity ? 'current' : done ? 'done' : 'todo';
              return (
                <li key={a} className={`${styles.step} ${styles['step_' + state]}`} aria-current={a === activity ? 'step' : undefined}>
                  <Link to={`/planet/${letter.slug}/${a}`} className={styles.stepLink}>
                    <span className={styles.stepBar} />
                    <span className={styles.stepText}>
                      {done && a !== activity && <Icon name="check" size={16} strokeWidth={3} />}
                      {ACTIVITY_LABELS[a]}
                      <span className="sr-only">{done ? '، تمّ' : ''} — النشاط {toArabicDigits(i + 1)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <main className={`container ${styles.main}`}>{children}</main>

      <footer className={styles.footer} aria-live="polite">
        {footer}
      </footer>
    </div>
  );
}

interface FeedbackProps {
  variant: 'idle' | 'hint' | 'success';
  title?: string;
  text?: string;
  children?: ReactNode;
}

/** The bar at the bottom of every activity: a prompt, a gentle hint, or a celebration. */
export function FeedbackBar({ variant, title, text, children }: FeedbackProps) {
  return (
    <div className={`${styles.feedback} ${styles['fb_' + variant]}`}>
      <div className={`container ${styles.feedbackInner}`}>
        <div className={styles.feedbackMsg}>
          {variant === 'success' && (
            <span className={styles.feedbackIcon} style={{ background: 'var(--space-900)', color: 'var(--star-500)' }}>
              <Icon name="star" size={28} />
            </span>
          )}
          {variant === 'hint' && (
            <span className={styles.feedbackIcon} style={{ background: 'var(--star-500)', color: 'var(--space-900)' }}>
              <Icon name="bulb" size={26} />
            </span>
          )}
          <div className={styles.feedbackText}>
            {title && <span className={`display ${styles.feedbackTitle}`}>{title}</span>}
            {text && <span>{text}</span>}
          </div>
        </div>
        <div className={styles.feedbackActions}>{children}</div>
      </div>
    </div>
  );
}

export function NextLink({ to, label = 'التالي', dark }: { to: string; label?: string; dark?: boolean }) {
  return (
    <Link to={to} className={`btn btn-lg ${dark ? 'btn-dark' : 'btn-primary'}`} onClick={stopSpeaking}>
      {label} <Icon name="arrowNext" strokeWidth={2.5} />
    </Link>
  );
}

export function DisabledNext() {
  return (
    <button type="button" className="btn btn-lg" disabled>
      التالي
    </button>
  );
}

export function nextHref(slug: string, activity: Activity): string {
  const i = ACTIVITIES.indexOf(activity);
  return i < ACTIVITIES.length - 1 ? `/planet/${slug}/${ACTIVITIES[i + 1]}` : '/map';
}
