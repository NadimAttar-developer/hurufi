import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Icon } from '../components/Icon';
import type { ActivityProps } from './types';
import type { Point } from '../data/lessons';
import { DisabledNext, FeedbackBar, LessonShell, NextLink, nextHref, useSpeak } from './LessonShell';
import { LetterAside } from './LetterAside';
import { useProgress } from '../state/ProgressContext';
import { toArabicDigits } from '../lib/arabic';
import styles from './Lesson.module.css';
import own from './Trace.module.css';

const VIEW_W = 400;
const VIEW_H = 300;
const HIT = 34; // how close (in board units) the finger must pass a checkpoint
const START_RADIUS = 44;
const OFF_PATH = 52;

type Hint = null | 'start' | 'continue' | 'off' | 'dot';

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function TraceActivity({ letter, lesson }: ActivityProps) {
  const say = useSpeak();
  const { completeActivity } = useProgress();
  const { path, checkpoints, dot, tip } = lesson.trace;
  const total = checkpoints.length;

  const [next, setNext] = useState(0);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [dotDone, setDotDone] = useState(dot === null);
  const [hint, setHint] = useState<Hint>(null);
  const drawing = useRef(false);
  const nextRef = useRef(0);

  const bodyDone = next >= total;
  const done = bodyDone && dotDone;

  useEffect(() => {
    if (done) {
      completeActivity(letter.slug, 'trace');
      say(`رائع! كتبت حرف ${letter.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const toBoard = (e: PointerEvent<SVGSVGElement>): Point => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) * VIEW_W) / r.width, ((e.clientY - r.top) * VIEW_H) / r.height];
  };

  const advance = (p: Point) => {
    let n = nextRef.current;
    while (n < total && dist(p, checkpoints[n]) < HIT) n++;
    if (n !== nextRef.current) {
      nextRef.current = n;
      setNext(n);
      if (n >= total) drawing.current = false;
    }
  };

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (done) return;
    const p = toBoard(e);
    if (bodyDone) {
      if (dot && dist(p, dot) < 40) {
        setDotDone(true);
        setHint(null);
      } else setHint('dot');
      return;
    }
    const n = nextRef.current;
    const anchor = n === 0 ? checkpoints[0] : checkpoints[n - 1];
    if (dist(p, anchor) > START_RADIUS && dist(p, checkpoints[n]) > START_RADIUS) {
      setHint(n === 0 ? 'start' : 'continue');
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    setHint(null);
    setStrokes((s) => [...s, [p]]);
    advance(p);
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drawing.current) return;
    const p = toBoard(e);
    setStrokes((s) => {
      const last = s[s.length - 1];
      if (!last || dist(p, last[last.length - 1]) < 4) return s;
      return [...s.slice(0, -1), [...last, p]];
    });
    const near = Math.min(...checkpoints.map((c) => dist(p, c)));
    setHint(near > OFF_PATH ? 'off' : null);
    advance(p);
  };

  const onUp = () => {
    drawing.current = false;
  };

  const reset = () => {
    nextRef.current = 0;
    drawing.current = false;
    setNext(0);
    setStrokes([]);
    setDotDone(dot === null);
    setHint(null);
  };

  const traceD = strokes.map((st) => 'M' + st.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')).join(' ');
  const nextPoint = !bodyDone ? checkpoints[next] : null;

  let message = 'ابدأ من النقطة البرتقالية رقم ١، واتبع الطريق.';
  let tone = 'var(--text-soft)';
  if (hint === 'start') [message, tone] = ['ابدأ من النقطة رقم ١ في أعلى اليمين.', 'var(--star-500)'];
  else if (hint === 'continue') [message, tone] = ['أكمل من حيث توقفت، عند الدائرة الصفراء.', 'var(--star-500)'];
  else if (hint === 'off') [message, tone] = ['ابقَ داخل الطريق، أنت تقترب!', 'var(--star-500)'];
  else if (hint === 'dot') [message, tone] = ['ضع النقطة في الدائرة رقم ٢ تحت السطر.', 'var(--star-500)'];
  else if (done) [message, tone] = [`${letter.name} كاملة!`, 'var(--meteor-500)'];
  else if (bodyDone) [message, tone] = ['ممتاز! الآن ضع النقطة.', 'var(--meteor-500)'];
  else if (next > 0) message = 'رائع، أكمل الطريق حتى نهايته.';

  const steps = [
    { label: 'ابدأ من النقطة رقم ١', done: next > 0 },
    { label: 'اتبع الطريق حتى آخره', done: bodyDone },
    ...(dot ? [{ label: 'ضع النقطة', done: dotDone }] : []),
  ];
  const firstOpen = steps.findIndex((s) => !s.done);

  return (
    <LessonShell
      letter={letter}
      activity="trace"
      footer={
        done ? (
          <FeedbackBar variant="success" title={`رائع! كتبت حرف ${letter.name}`} text="ربحت نجمة جديدة لمركبتك.">
            <button type="button" className="btn btn-outline-dark btn-lg" onClick={reset}>اكتبه مرة أخرى</button>
            <NextLink to={nextHref(letter.slug, 'trace')} dark />
          </FeedbackBar>
        ) : bodyDone && dot ? (
          <FeedbackBar variant="idle" text="اضغط على الدائرة رقم ٢ أو على الزر.">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setDotDone(true)}>ضع النقطة</button>
          </FeedbackBar>
        ) : (
          <FeedbackBar variant="idle" text="أكمل الحرف لتربح نجمة.">
            <DisabledNext />
          </FeedbackBar>
        )
      }
    >
      <section aria-labelledby="task" className={styles.stage}>
        <div className={own.head}>
          <h1 id="task" className={`display ${styles.taskTitle}`}>اكتب حرف {letter.name} بإصبعك</h1>
          <div className={own.tools}>
            <button type="button" className={styles.soundSmall} aria-label="استمع إلى الحرف" onClick={() => say(letter.spoken)}>
              <Icon name="sound" size={22} />
            </button>
            <button type="button" className={styles.soundSmall} aria-label="امسح وابدأ من جديد" onClick={reset}>
              <Icon name="replay" size={22} />
            </button>
          </div>
        </div>

        <svg
          className={own.board}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`لوح الكتابة: حرف ${letter.name} مع طريق للتتبّع`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <line x1="24" y1="220" x2="376" y2="220" stroke="var(--space-600)" strokeWidth="2" strokeDasharray="10 8" />
          <path d={path} fill="none" stroke="var(--space-700)" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="var(--space-400)" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
          {checkpoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill={i < next ? 'var(--meteor-500)' : 'var(--space-400)'} />
          ))}
          <path d={traceD} fill="none" stroke="var(--rocket-500)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          {nextPoint && <circle cx={nextPoint[0]} cy={nextPoint[1]} r="18" fill="none" stroke="var(--star-500)" strokeWidth="4" className={own.pulse} />}
          {dot && (
            <>
              <circle
                cx={dot[0]}
                cy={dot[1]}
                r="20"
                fill={dotDone ? 'var(--rocket-500)' : 'none'}
                stroke={dotDone ? 'var(--rocket-500)' : bodyDone ? 'var(--star-500)' : 'var(--space-400)'}
                strokeWidth="4"
                strokeDasharray={dotDone ? undefined : '6 6'}
              />
              <circle cx={dot[0] + 44} cy={dot[1]} r="15" fill="var(--space-700)" />
              <text x={dot[0] + 44} y={dot[1] + 7} textAnchor="middle" fontFamily="Cairo, sans-serif" fontWeight="800" fontSize="17" fill="var(--space-50)">٢</text>
            </>
          )}
          <path
            d={`M${checkpoints[0][0] + 36} ${checkpoints[0][1] - 18} l0 48 m-10 -14 l10 14 l10 -14`}
            fill="none"
            stroke="var(--star-500)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={checkpoints[0][0]} cy={checkpoints[0][1] - 38} r="17" fill="var(--rocket-500)" />
          <text x={checkpoints[0][0]} y={checkpoints[0][1] - 30} textAnchor="middle" fontFamily="Cairo, sans-serif" fontWeight="800" fontSize="20" fill="var(--space-900)">١</text>
        </svg>

        <p className={styles.message} style={{ color: tone }}>{message}</p>
      </section>

      <LetterAside letter={letter} lesson={lesson} tip={tip}>
        <ol className={own.steps} aria-label="خطوات الكتابة">
          {steps.map((s, i) => (
            <li key={s.label} className={own.stepItem}>
              <span className={`${own.stepDot} ${s.done ? own.stepDone : i === firstOpen ? own.stepNow : ''}`}>
                {s.done ? <Icon name="check" size={20} strokeWidth={3} /> : toArabicDigits(i + 1)}
              </span>
              {s.label}
            </li>
          ))}
        </ol>
      </LetterAside>
    </LessonShell>
  );
}
