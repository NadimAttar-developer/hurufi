import { useState } from 'react';
import { Icon } from '../components/Icon';
import type { ActivityProps } from './types';
import { DisabledNext, FeedbackBar, LessonShell, NextLink, nextHref, useSpeak } from './LessonShell';
import { LetterAside } from './LetterAside';
import { useProgress } from '../state/ProgressContext';
import { LETTERS } from '../data/letters';
import styles from './Lesson.module.css';
import own from './Choose.module.css';

const nameOf = (char: string) => LETTERS.find((l) => l.char === char)?.name ?? char;

export function ChooseActivity({ letter, lesson }: ActivityProps) {
  const say = useSpeak();
  const { completeActivity, addMistake } = useProgress();
  const [picked, setPicked] = useState<number | null>(null);
  const { options, answer, mistakeHint } = lesson.choose;
  const solved = picked === answer;
  const wrong = picked !== null && !solved;

  const pick = (i: number) => {
    setPicked(i);
    if (i === answer) {
      completeActivity(letter.slug, 'choose');
      say(`أحسنت! هذه ${letter.name}`);
    } else {
      addMistake(letter.slug);
    }
  };

  return (
    <LessonShell
      letter={letter}
      activity="choose"
      footer={
        solved ? (
          <FeedbackBar variant="success" title={`أحسنت! هذه ${letter.name}`} text="ربحت نجمة جديدة لمركبتك.">
            <NextLink to={nextHref(letter.slug, 'choose')} dark />
          </FeedbackBar>
        ) : wrong ? (
          <FeedbackBar variant="hint" title="قريب جدًا!" text={mistakeHint}>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => setPicked(null)}>
              حاول مرة أخرى
            </button>
          </FeedbackBar>
        ) : (
          <FeedbackBar variant="idle" text="اضغط على زر الصوت لتسمع الحرف مرة أخرى.">
            <DisabledNext />
          </FeedbackBar>
        )
      }
    >
      <section aria-labelledby="task" className={styles.stage}>
        <div className={styles.taskRow}>
          <button type="button" className={styles.soundBig} aria-label="استمع إلى الحرف" onClick={() => say(letter.spoken)}>
            <Icon name="sound" size={40} />
          </button>
          <h1 id="task" className={`display ${styles.taskTitle}`}>استمع، ثم اختر الحرف الذي سمعته</h1>
        </div>
        <div role="group" aria-label="الخيارات" className={own.options}>
          {options.map((o, i) => {
            const state = picked === i ? (i === answer ? own.correct : own.wrong) : '';
            return (
              <button
                key={o}
                type="button"
                className={`learn ${own.option} ${state}`}
                aria-label={`حرف ${nameOf(o)}${picked === i ? (i === answer ? '، إجابة صحيحة' : '، ليست الإجابة') : ''}`}
                aria-pressed={picked === i}
                disabled={solved && i !== answer}
                onClick={() => pick(i)}
              >
                {o}
                {picked === i && i === answer && (
                  <span className={own.tick} aria-hidden="true"><Icon name="check" size={22} strokeWidth={3} /></span>
                )}
              </button>
            );
          })}
        </div>
      </section>
      <LetterAside letter={letter} lesson={lesson} />
    </LessonShell>
  );
}
