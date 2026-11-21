import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACTIVITIES, type Activity } from '../data/lessons';
import { LETTERS } from '../data/letters';

interface PlanetProgress {
  activities: Activity[];
  mistakes: number;
}

interface ProgressState {
  /** Index in LETTERS of the planet the child is on now */
  current: number;
  stars: number;
  planets: Record<string, PlanetProgress>;
  muted: boolean;
}

interface ProgressApi extends ProgressState {
  completeActivity: (slug: string, activity: Activity) => void;
  addMistake: (slug: string) => void;
  toggleMute: () => void;
  resetProgress: () => void;
  planetStars: (slug: string) => number;
  isActivityDone: (slug: string, activity: Activity) => boolean;
}

const STORAGE_KEY = 'hurufi-progress-v1';

/** Demo start: ا is finished, so the child begins on the ب planet, which has a full lesson. */
const INITIAL: ProgressState = {
  current: 1,
  stars: 4,
  planets: { alif: { activities: [...ACTIVITIES], mistakes: 0 } },
  muted: false,
};

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...INITIAL, ...parsed };
  } catch {
    return INITIAL;
  }
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage can be blocked; progress then lasts for this visit only */
    }
  }, [state]);

  const completeActivity = useCallback((slug: string, activity: Activity) => {
    setState((s) => {
      const planet = s.planets[slug] ?? { activities: [], mistakes: 0 };
      if (planet.activities.includes(activity)) return s;
      const activities = [...planet.activities, activity];
      const planets = { ...s.planets, [slug]: { ...planet, activities } };
      const index = LETTERS.findIndex((l) => l.slug === slug);
      const finished = ACTIVITIES.every((a) => activities.includes(a));
      const current = finished && index === s.current ? Math.min(s.current + 1, LETTERS.length - 1) : s.current;
      return { ...s, planets, current, stars: s.stars + 1 };
    });
  }, []);

  const addMistake = useCallback((slug: string) => {
    setState((s) => {
      const planet = s.planets[slug] ?? { activities: [], mistakes: 0 };
      return { ...s, planets: { ...s.planets, [slug]: { ...planet, mistakes: planet.mistakes + 1 } } };
    });
  }, []);

  const toggleMute = useCallback(() => setState((s) => ({ ...s, muted: !s.muted })), []);
  const resetProgress = useCallback(() => setState((s) => ({ ...INITIAL, muted: s.muted })), []);

  const api = useMemo<ProgressApi>(
    () => ({
      ...state,
      completeActivity,
      addMistake,
      toggleMute,
      resetProgress,
      planetStars: (slug) => {
        const p = state.planets[slug];
        if (!p) return 0;
        return Math.max(1, 3 - Math.floor(p.mistakes / 2));
      },
      isActivityDone: (slug, activity) => !!state.planets[slug]?.activities.includes(activity),
    }),
    [state, completeActivity, addMistake, toggleMute, resetProgress],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
