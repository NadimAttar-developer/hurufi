import type { Letter } from '../data/letters';
import type { LessonContent } from '../data/lessons';

export interface ActivityProps {
  letter: Letter;
  lesson: LessonContent;
}
