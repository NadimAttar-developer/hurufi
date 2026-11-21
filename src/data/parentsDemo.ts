/**
 * Example data for the parents' dashboard. Shown with a "بيانات مثال" label
 * until real accounts and reporting exist.
 */
export interface ChildReport {
  id: string;
  name: string;
  age: string;
  initial: string;
  color: string;
  feminine: boolean;
  planetsDone: number;
  stars: number;
  /** Minutes per day from Saturday to Friday; null = day not reached yet */
  minutes: (number | null)[];
  streak: number;
  mastered: string[];
  review: string[];
  learning: string[];
  insight: { title: string; text: string; action: string };
  recent: { title: string; when: string; kind: 'done' | 'reward' | 'start' | 'practice' }[];
}

export const DEMO_CHILDREN: ChildReport[] = [
  {
    id: 'sara',
    name: 'سارة',
    age: '٧ سنوات',
    initial: 'س',
    color: 'var(--rocket-500)',
    feminine: true,
    planetsDone: 5,
    stars: 42,
    minutes: [15, 22, 10, 0, 18, 20, null],
    streak: 4,
    mastered: ['ا', 'ب', 'ت', 'ج'],
    review: ['ث'],
    learning: ['ح'],
    insight: {
      title: 'الثاء والتاء تختلطان عليها',
      text: 'اختارت التاء بدل الثاء ٣ مرات هذا الأسبوع. الفرق في عدد النقاط: نقطتان للتاء وثلاث للثاء.',
      action: 'راجِعا الثاء معًا',
    },
    recent: [
      { title: 'أكملت كوكب الجيم', when: 'الخميس', kind: 'done' },
      { title: 'ربحت وسام رائد الحروف', when: 'الخميس', kind: 'reward' },
      { title: 'بدأت كوكب الحاء', when: 'الخميس', kind: 'start' },
      { title: 'أعادت نشاط «اختر» للثاء', when: 'الأربعاء', kind: 'practice' },
    ],
  },
  {
    id: 'yusuf',
    name: 'يوسف',
    age: '٥ سنوات',
    initial: 'ي',
    color: 'var(--meteor-500)',
    feminine: false,
    planetsDone: 2,
    stars: 30,
    minutes: [10, 12, 0, 15, 10, 8, null],
    streak: 2,
    mastered: ['ا', 'ب'],
    review: [],
    learning: ['ت'],
    insight: {
      title: 'التتبّع نشاطه المفضّل',
      text: 'أعاد نشاط التتبّع ٥ مرات من نفسه. شجّعه على كتابة الحروف على الورق أيضًا.',
      action: 'افتح نشاط التتبّع',
    },
    recent: [
      { title: 'أكمل كوكب الباء', when: 'الخميس', kind: 'done' },
      { title: 'بدأ كوكب التاء', when: 'الخميس', kind: 'start' },
      { title: 'كتب الباء ٥ مرات في التتبّع', when: 'الأربعاء', kind: 'practice' },
    ],
  },
];

export const WEEK_DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
export const WEEK_DAYS_SHORT = ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'];
