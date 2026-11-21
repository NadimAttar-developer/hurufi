import type { ReactNode } from 'react';
import type { Letter } from '../data/letters';
import type { LessonContent } from '../data/lessons';
import styles from './Lesson.module.css';

const FORM_LABELS = ['أوّل', 'وسط', 'آخر', 'منفصل'];

/** Side card with the letter, its hint and its four forms. The forms hide on phones. */
export function LetterAside({ letter, lesson, tip, children }: { letter: Letter; lesson: LessonContent; tip?: string; children?: ReactNode }) {
  return (
    <aside aria-label="بطاقة الحرف" className={styles.aside}>
      <div className={styles.letterCard}>
        <span className={`learn ${styles.letterBadge}`} aria-hidden="true">{letter.char}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="display" style={{ fontSize: 28 }}>{letter.name}</span>
          <span className="soft">{lesson.hint}</span>
        </div>
      </div>
      <div className={styles.hideOnPhone} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-muted)' }}>أشكال الحرف</span>
        <div className={styles.forms}>
          {lesson.forms.map((f, i) => (
            <div key={FORM_LABELS[i]} className={styles.form}>
              <span className="learn">{f}</span>
              <span>{FORM_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      {children}
      {tip && (
        <div className={`${styles.tipBox} ${styles.hideOnPhone}`}>
          <strong>تلميح</strong>
          {tip}
        </div>
      )}
    </aside>
  );
}
