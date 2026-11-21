import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import type { ActivityProps } from './types';
import { FeedbackBar, LessonShell, useSpeak } from './LessonShell';
import { LetterAside } from './LetterAside';
import { useProgress } from '../state/ProgressContext';
import { LETTERS, letterIndex } from '../data/letters';
import { ACTIVITIES } from '../data/lessons';
import styles from './Lesson.module.css';
import own from './Build.module.css';

const ORDER = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
const nameOf = (char: string) => LETTERS.find((l) => l.char === char)?.name ?? char;

export function BuildActivity({ letter, lesson }: ActivityProps) {
  const say = useSpeak();
  const { completeActivity, addMistake, isActivityDone } = useProgress();
  const planetComplete = ACTIVITIES.every((a) => isActivityDone(letter.slug, a));
  const { word, letters: answer, tiles, icon, slow } = lesson.build;
  const [slots, setSlots] = useState<(number | null)[]>(() => answer.map(() => null));

  const full = slots.every((s) => s !== null);
  const right = full && slots.every((s, i) => tiles[s as number] === answer[i]);
  const wrong = full && !right;
  const firstEmpty = slots.indexOf(null);
  const nextLetter = LETTERS[Math.min(letterIndex(letter.slug) + 1, LETTERS.length - 1)];

  useEffect(() => {
    if (right) {
      completeActivity(letter.slug, 'build');
      say(`أحسنت! ${word}`);
    } else if (wrong) {
      addMistake(letter.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [right, wrong]);

  const place = (tile: number) => {
    setSlots((s) => {
      const at = s.indexOf(null);
      if (at === -1 || s.includes(tile)) return s;
      const next = [...s];
      next[at] = tile;
      return next;
    });
  };

  const remove = (slot: number) => {
    if (right) return;
    setSlots((s) => s.map((v, i) => (i === slot ? null : v)));
  };

  const reset = () => setSlots(answer.map(() => null));

  let message = `اضغط على الحرف الأوّل في الكلمة.`;
  let tone = 'var(--text-soft)';
  if (right) [message, tone] = ['أحسنت! الحروف اتصلت وصارت كلمة.', 'var(--meteor-500)'];
  else if (wrong) [message, tone] = ['قريب جدًا! استمع مرة أخرى، وأعِد الحرف الذي حوله خط متقطع.', 'var(--star-500)'];
  else if (firstEmpty > 0) message = 'رائع، ما الحرف التالي؟';

  return (
    <LessonShell
      letter={letter}
      activity="build"
      footer={
        right ? (
          <FeedbackBar
            variant="success"
            title={planetComplete ? `أكملت كوكب ${letter.name}!` : `أحسنت! ركّبت كلمة ${word}`}
            text={planetComplete ? `ركّبت كلمة ${word}، وانفتح لك كوكب ${nextLetter.name}.` : 'أكمل بقية أنشطة الكوكب لتفتح الكوكب التالي.'}
          >
            <button type="button" className="btn btn-outline-dark btn-lg" onClick={reset}>ركّبها مرة أخرى</button>
            <Link to="/map" className="btn btn-dark btn-lg">إلى الخريطة <Icon name="arrowNext" strokeWidth={2.5} /></Link>
          </FeedbackBar>
        ) : (
          <FeedbackBar variant={wrong ? 'hint' : 'idle'} title={wrong ? 'قريب جدًا!' : undefined} text={wrong ? 'اضغط على الحرف الخطأ لتعيده.' : 'أكمل الكلمة لتربح نجمة.'}>
            <button type="button" className="btn btn-secondary btn-lg" onClick={reset}>ابدأ من جديد</button>
          </FeedbackBar>
        )
      }
    >
      <section aria-labelledby="task" className={styles.stage}>
        <h1 id="task" className={`display ${styles.taskTitle}`}>استمع، ثم ركّب الكلمة من الحروف</h1>

        <div className={own.clue}>
          <div role="img" aria-label="صورة الكلمة" className={own.picture}>
            <Icon name={icon} size={90} strokeWidth={1.8} />
          </div>
          <button type="button" className={styles.soundBig} aria-label="استمع إلى الكلمة" onClick={() => say(word)}>
            <Icon name="sound" size={40} />
          </button>
        </div>

        <div role="group" aria-label="خانات الكلمة" className={own.slots}>
          {slots.map((s, i) => {
            const char = s === null ? '' : tiles[s];
            const bad = wrong && char !== answer[i];
            if (s === null) {
              return (
                <span key={i} role="img" aria-label={`الخانة ${ORDER[i]}، فارغة`} className={`${own.slot} ${own.empty} ${i === firstEmpty ? own.nextSlot : ''}`}>
                  <span className={own.line} />
                </span>
              );
            }
            return (
              <button
                key={i}
                type="button"
                className={`learn ${own.slot} ${right ? own.right : bad ? own.bad : own.filled}`}
                aria-label={`الخانة ${ORDER[i]}، حرف ${nameOf(char)}${right ? '' : '. اضغط لإعادته'}`}
                onClick={() => remove(i)}
              >
                {char}
              </button>
            );
          })}
        </div>

        {right && (
          <div className={own.joined}>
            <span className="learn" style={{ fontSize: 30, color: 'var(--text-muted)' }}>{answer.join(' + ')}</span>
            <Icon name="arrowNext" size={26} strokeWidth={2.5} style={{ color: 'var(--star-500)' }} />
            <span className="learn" style={{ fontSize: 52, lineHeight: 1.3, color: 'var(--star-500)' }}>{word}</span>
          </div>
        )}

        <p className={styles.message} style={{ color: tone }} aria-live="polite">{message}</p>

        <div role="group" aria-label="الحروف المتاحة" className={own.tiles}>
          {tiles.map((t, i) =>
            slots.includes(i) ? (
              <span key={i} className={own.usedTile} aria-hidden="true" />
            ) : (
              <button key={i} type="button" className={`learn ${own.tile}`} aria-label={`حرف ${nameOf(t)}`} disabled={right} onClick={() => place(i)}>
                {t}
              </button>
            ),
          )}
        </div>
      </section>

      <LetterAside letter={letter} lesson={lesson}>
        <ol className={own.howto}>
          <li>استمع إلى الكلمة.</li>
          <li>اضغط على الحروف بالترتيب، من اليمين إلى اليسار.</li>
          <li>اضغط على حرف في الخانة لتعيده.</li>
        </ol>
        <button type="button" className="btn btn-secondary" onClick={() => say(slow, 0.6)}>
          <Icon name="sound" size={22} style={{ color: 'var(--meteor-500)' }} /> استمع ببطء: <span className="learn">{slow}</span>
        </button>
      </LetterAside>
    </LessonShell>
  );
}
