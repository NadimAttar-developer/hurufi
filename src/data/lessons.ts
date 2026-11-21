import type { IconName } from '../components/Icon';

export const ACTIVITIES = ['listen', 'choose', 'trace', 'build'] as const;
export type Activity = (typeof ACTIVITIES)[number];

export const ACTIVITY_LABELS: Record<Activity, string> = {
  listen: 'استمع',
  choose: 'اختر',
  trace: 'تتبّع',
  build: 'ركّب',
};

export type Point = [number, number];

export interface LessonContent {
  /** One-line description of the letter's shape */
  hint: string;
  /** Initial, medial, final and isolated forms */
  forms: [string, string, string, string];
  listen: {
    words: { word: string; plain: string; icon: IconName }[];
  };
  choose: {
    options: string[];
    answer: number;
    mistakeHint: string;
  };
  trace: {
    /** SVG path in a 400×300 box, written in the order the letter is written */
    path: string;
    /** Points along the path the finger must pass, in order */
    checkpoints: Point[];
    /** Where the dot goes; null for letters without dots */
    dot: Point | null;
    tip: string;
  };
  build: {
    word: string;
    letters: string[];
    tiles: string[];
    icon: IconName;
    slow: string;
  };
}

/**
 * Lesson content per letter. Only ب is written so far; every other planet
 * shows a "coming soon" screen until its content is added here.
 */
export const LESSONS: Record<string, LessonContent> = {
  ba: {
    hint: 'نقطة واحدة تحت الحرف',
    forms: ['بـ', 'ـبـ', 'ـب', 'ب'],
    listen: {
      words: [
        { word: 'بَيْت', plain: 'بيت', icon: 'house' },
        { word: 'بَاب', plain: 'باب', icon: 'door' },
        { word: 'بَحْر', plain: 'بحر', icon: 'wave' },
      ],
    },
    choose: {
      options: ['ت', 'ب', 'ن', 'ث'],
      answer: 1,
      mistakeHint: 'كم نقطة تحت الحرف؟ جرّب مرة أخرى.',
    },
    trace: {
      path: 'M330 110 C330 165 322 192 280 195 L120 195 C88 195 72 180 70 152',
      checkpoints: [
        [330, 110], [329, 150], [316, 180], [285, 194], [245, 195],
        [205, 195], [165, 195], [125, 195], [90, 186], [72, 162],
      ],
      dot: [200, 262],
      tip: 'الباء تجلس على السطر، ونقطتها الواحدة تحت السطر في الوسط.',
    },
    build: {
      word: 'بَيْت',
      letters: ['ب', 'ي', 'ت'],
      tiles: ['ت', 'ن', 'ب', 'ي', 'ث'],
      icon: 'house',
      slow: 'بَـ يْـ ت',
    },
  },
};
