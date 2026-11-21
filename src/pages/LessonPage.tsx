import { Link, Navigate, useParams } from 'react-router-dom';
import { ACTIVITIES, LESSONS, type Activity } from '../data/lessons';
import { LETTERS, letterIndex } from '../data/letters';
import { useProgress } from '../state/ProgressContext';
import { ListenActivity } from '../lesson/ListenActivity';
import { ChooseActivity } from '../lesson/ChooseActivity';
import { TraceActivity } from '../lesson/TraceActivity';
import { BuildActivity } from '../lesson/BuildActivity';
import { LogoMark } from '../components/Logo';

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="stars-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <section className="container" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', paddingBlock: 64 }}>
        <LogoMark size={72} />
        <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>{title}</h1>
        <p className="soft" style={{ fontSize: 19, maxWidth: '34rem' }}>{text}</p>
        <Link to="/map" className="btn btn-primary btn-lg">إلى الخريطة</Link>
      </section>
    </div>
  );
}

export function LessonPage() {
  const { slug = '', activity } = useParams();
  const { current, planets } = useProgress();
  const index = letterIndex(slug);

  if (index === -1) return <Message title="تاهت المركبة!" text="لم نجد هذا الكوكب. لنعد إلى الخريطة." />;

  const letter = LETTERS[index];
  if (index > current) {
    return <Message title={`كوكب ${letter.name} مقفل`} text={`أكمل كوكب ${LETTERS[current].name} أولًا، ثم ينفتح لك هذا الكوكب.`} />;
  }

  const lesson = LESSONS[slug];
  if (!lesson) {
    return <Message title={`كوكب ${letter.name} قريبًا`} text="ما زلنا نجهّز أنشطة هذا الكوكب. عُد إليه قريبًا!" />;
  }

  if (!activity || !ACTIVITIES.includes(activity as Activity)) {
    const done = planets[slug]?.activities ?? [];
    const first = ACTIVITIES.find((a) => !done.includes(a)) ?? 'listen';
    return <Navigate to={`/planet/${slug}/${first}`} replace />;
  }

  const props = { letter, lesson };
  switch (activity as Activity) {
    case 'listen':
      return <ListenActivity key={slug} {...props} />;
    case 'choose':
      return <ChooseActivity key={slug} {...props} />;
    case 'trace':
      return <TraceActivity key={slug} {...props} />;
    case 'build':
      return <BuildActivity key={slug} {...props} />;
  }
}
