import { Link, useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { Planet } from '../components/Planet';
import { LETTERS } from '../data/letters';
import { useProgress } from '../state/ProgressContext';
import { toArabicDigits } from '../lib/arabic';
import styles from './HomePage.module.css';

const STEPS = [
  { title: 'اختر كوكبك', text: 'كل حرف كوكب على الخريطة. يبدأ طفلك بالألف، ثم ينفتح الكوكب التالي كلما أكمل واحدًا.', color: 'var(--rocket-500)' },
  { title: 'استمع والعب', text: 'يسمع صوت الحرف، ويرسمه بإصبعه، ويبحث عنه في الكلمات من خلال ألعاب قصيرة.', color: 'var(--meteor-500)' },
  { title: 'اجمع النجوم', text: 'كل نشاط يكمله يمنحه نجمة، وعند إكمال الأنشطة الأربعة يطير إلى الكوكب التالي.', color: 'var(--star-500)' },
];

const ACTIVITY_CARDS: { title: string; text: string; icon: IconName; color: string }[] = [
  { title: 'استمع', text: 'صوت الحرف بنطق واضح، مع كلمات تبدأ به.', icon: 'sound', color: 'var(--rocket-500)' },
  { title: 'اختر', text: 'يميّز الحرف بين حروف تشبهه ولا تختلف إلا بالنقاط.', icon: 'grid', color: 'var(--star-500)' },
  { title: 'تتبّع', text: 'يرسم الحرف بإصبعه، من اليمين إلى اليسار وبالترتيب الصحيح.', icon: 'pen', color: 'var(--meteor-500)' },
  { title: 'ركّب', text: 'يجمع الحروف ليصنع كلمة، ويرى كيف تتصل الحروف.', icon: 'book', color: 'var(--nebula-500)' },
];

export function HomePage() {
  const { current } = useProgress();
  const navigate = useNavigate();
  const preview = LETTERS.slice(0, 12);
  const startHref = `/planet/${LETTERS[current].slug}`;

  return (
    <>
      {/* البطل */}
      <section className="stars-bg">
        <div className={`container ${styles.hero}`}>
          <div className={styles.heroText}>
            <span className={styles.ageChip}>لأطفال من ٦ إلى ١٠ سنوات</span>
            <h1 className={`display ${styles.heroTitle}`}>انطلق واجمع نجوم الحروف!</h1>
            <p className={styles.lead}>
              في حروفي، كل حرف عربي كوكب يزوره طفلك. يستمع إلى صوته، ويرسمه بإصبعه، ويلعب به، ويجمع النجوم حتى يكمل رحلة
              الأبجدية.
            </p>
            <div className={styles.ctas}>
              <Link to={startHref} className="btn btn-primary btn-lg">
                ابدأ الرحلة <Icon name="arrowNext" strokeWidth={2.5} />
              </Link>
              <Link to="/#how" className="btn btn-secondary btn-lg">
                <Icon name="play" style={{ color: 'var(--meteor-500)' }} /> كيف تعمل؟
              </Link>
            </div>
            <p className={styles.facts}>
              ٢٨ كوكبًا <span aria-hidden="true">·</span> ألعاب صوتية <span aria-hidden="true">·</span> حكايات قصيرة
            </p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.bigPlanet}>
              <span className="learn">ض</span>
            </div>
            <div className={`${styles.moon} ${styles.moonA}`}><span className="learn">ب</span></div>
            <div className={`${styles.moon} ${styles.moonB}`}><span className="learn">م</span></div>
            <Icon name="star" size={40} className={styles.starA} />
          </div>
        </div>
      </section>

      {/* كيف تعمل */}
      <section id="how" className={styles.band}>
        <div className={`container ${styles.section}`}>
          <header className={styles.sectionHead}>
            <h2 className={`display ${styles.h2}`}>كيف تعمل الرحلة؟</h2>
            <p className={styles.sub}>ثلاث خطوات تتكرّر في كل كوكب، فيعرف طفلك دائمًا ما الذي ينتظره.</p>
          </header>
          <ol className={styles.cards3}>
            {STEPS.map((s, i) => (
              <li key={s.title} className={styles.stepCard}>
                <div className={styles.stepHead}>
                  <span className={`display ${styles.stepNum}`} style={{ background: s.color }}>{toArabicDigits(i + 1)}</span>
                  <h3 className={styles.h3}>{s.title}</h3>
                </div>
                <p className="soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* الخريطة */}
      <section id="map">
        <div className={`container ${styles.section}`}>
          <header className={styles.mapHead}>
            <div className={styles.sectionHead}>
              <h2 className={`display ${styles.h2}`}>خريطة كواكب الحروف</h2>
              <p className={styles.sub}>٢٨ كوكبًا من الألف إلى الياء. يرى طفلك أين وصل، وما الكوكب الذي ينتظره.</p>
            </div>
            <Link to="/map" className="btn btn-secondary">افتح الخريطة كاملة</Link>
          </header>
          <div className={`card ${styles.mapStrip}`}>
            {preview.map((l, i) => {
              const state = i < current ? 'done' : i === current ? 'current' : 'locked';
              const caption = state === 'done' ? 'مكتمل' : state === 'current' ? 'أنت هنا' : 'قريبًا';
              return (
                <div key={l.slug} className={styles.mapItem}>
                  <Planet
                    letter={l.char}
                    state={state}
                    size={76}
                    label={`كوكب ${l.name}، ${state === 'done' ? 'مكتمل' : state === 'current' ? 'المحطة الحالية' : 'مقفل'}`}
                    onClick={() => navigate('/map', { state: { select: i } })}
                  />
                  <span className={styles.mapCaption}>{caption}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* الأنشطة */}
      <section id="activities" className={styles.band}>
        <div className={`container ${styles.section}`}>
          <header className={styles.sectionHead}>
            <h2 className={`display ${styles.h2}`}>ماذا يفعل طفلك في كل كوكب؟</h2>
            <p className={styles.sub}>أربعة أنشطة قصيرة، كل واحد منها يعلّم الحرف بطريقة مختلفة.</p>
          </header>
          <div className={styles.cards4}>
            {ACTIVITY_CARDS.map((a) => (
              <div key={a.title} className={styles.activityCard}>
                <span className={styles.activityIcon} style={{ background: a.color }}>
                  <Icon name={a.icon} size={30} />
                </span>
                <h3 className={styles.h3}>{a.title}</h3>
                <p className="soft">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* للأهل */}
      <section className={`theme-day ${styles.parents}`}>
        <div className={`container ${styles.section} ${styles.parentsInner}`}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>للأهل</span>
            <h2 className={`display ${styles.h2}`}>تابع تقدّم طفلك بوضوح</h2>
            <p className={styles.sub}>لوحة بسيطة تخبرك بما تعلّمه طفلك، وأين يحتاج إلى مساعدة، دون أرقام معقّدة.</p>
            <ul className={styles.checks}>
              {['الحروف التي أتقنها، والتي تحتاج إلى مراجعة', 'ملف مستقل لكل طفل في العائلة', 'تحديد وقت اللعب اليومي'].map((t) => (
                <li key={t}>
                  <Icon name="check" strokeWidth={2.5} style={{ color: 'var(--meteor-900)' }} />
                  {t}
                </li>
              ))}
            </ul>
            <Link to="/parents" className="btn btn-outline-dark" style={{ alignSelf: 'flex-start' }}>
              افتح لوحة الأهل
            </Link>
          </div>
        </div>
      </section>

      {/* الدعوة الأخيرة */}
      <section>
        <div className={`container ${styles.section}`}>
          <div className={styles.finalCta}>
            <div className={styles.finalBlob} aria-hidden="true" />
            <div className={styles.finalText}>
              <h2 className={`display ${styles.h2}`}>جاهز للانطلاق؟</h2>
              <p className={styles.sub}>ابدأ من الكوكب الذي وصلت إليه، وأكمل الرحلة اليوم.</p>
            </div>
            <Link to={startHref} className="btn btn-primary btn-lg" style={{ position: 'relative' }}>
              ابدأ الرحلة
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
