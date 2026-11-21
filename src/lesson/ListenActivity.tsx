import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import type { ActivityProps } from './types';
import { FeedbackBar, LessonShell, NextLink, DisabledNext, nextHref, useSpeak } from './LessonShell';
import { LetterAside } from './LetterAside';
import { useProgress } from '../state/ProgressContext';
import styles from './Lesson.module.css';
import own from './Listen.module.css';

export function ListenActivity({ letter, lesson }: ActivityProps) {
  const say = useSpeak();
  const { completeActivity } = useProgress();
  const [heard, setHeard] = useState<Set<string>>(new Set());
  const words = lesson.listen.words;
  const needed = 1 + words.length;
  const done = heard.size >= needed;

  useEffect(() => {
    if (done) completeActivity(letter.slug, 'listen');
  }, [done, completeActivity, letter.slug]);

  const hear = (key: string, text: string) => {
    say(text);
    setHeard((prev) => new Set(prev).add(key));
  };

  return (
    <LessonShell
      letter={letter}
      activity="listen"
      footer={
        done ? (
          <FeedbackBar variant="success" title={`أحسنت! سمعت صوت ${letter.name}`} text="ربحت نجمة جديدة لمركبتك.">
            <NextLink to={nextHref(letter.slug, 'listen')} dark />
          </FeedbackBar>
        ) : (
          <FeedbackBar variant="idle" text="اضغط على الحرف ثم على كل كلمة لتسمعها.">
            <DisabledNext />
          </FeedbackBar>
        )
      }
    >
      <section aria-labelledby="task" className={styles.stage}>
        <h1 id="task" className={`display ${styles.taskTitle}`}>استمع إلى صوت الحرف</h1>
        <button
          type="button"
          className={own.bigLetter}
          aria-label={`استمع إلى حرف ${letter.name}`}
          onClick={() => hear('letter', `${letter.spoken}. ${letter.char}`)}
        >
          <span className="learn" aria-hidden="true">{letter.char}</span>
          <span className={own.bigLetterSound}><Icon name="sound" size={26} /></span>
        </button>
        <ul className={own.words}>
          {words.map((w) => (
            <li key={w.plain}>
              <button type="button" className={`${own.word} ${heard.has(w.plain) ? own.wordHeard : ''}`} onClick={() => hear(w.plain, w.word)}>
                <span className={own.wordIcon}><Icon name={w.icon} size={36} /></span>
                <span className="learn" style={{ fontSize: 32 }}>{w.word}</span>
                <span className={own.wordSound}>
                  <Icon name={heard.has(w.plain) ? 'check' : 'sound'} size={20} strokeWidth={heard.has(w.plain) ? 3 : 2} />
                </span>
                <span className="sr-only">{heard.has(w.plain) ? '، سمعتها' : '، اضغط لتسمعها'}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <LetterAside letter={letter} lesson={lesson} tip={`كل الكلمات هنا تبدأ بحرف ${letter.name}. استمع إلى أوّل صوت فيها.`} />
    </LessonShell>
  );
}
