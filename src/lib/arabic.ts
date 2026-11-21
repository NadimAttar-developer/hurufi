const DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Converts Western digits in a number or string to Arabic-Indic digits (١٢٣). */
export function toArabicDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => DIGITS[Number(d)]);
}

/**
 * Arabic counted noun with correct agreement.
 * forms: [one, two, few (3–10), many (11+)]
 * e.g. count(2, ['نجمة واحدة', 'نجمتان', 'نجوم', 'نجمة']) → "نجمتان"
 */
export function countWord(n: number, forms: [string, string, string, string]): string {
  const [one, two, few, many] = forms;
  if (n === 1) return one;
  if (n === 2) return two;
  const num = toArabicDigits(n);
  if (n >= 3 && n <= 10) return `${num} ${few}`;
  return `${num} ${many}`;
}

export const starsText = (n: number) => countWord(n, ['نجمة واحدة', 'نجمتان', 'نجوم', 'نجمة']);
export const daysText = (n: number) => countWord(n, ['يوم واحد', 'يومان', 'أيام', 'يومًا']);
export const minutesText = (n: number) => countWord(n, ['دقيقة واحدة', 'دقيقتان', 'دقائق', 'دقيقة']);
export const planetsText = (n: number) => countWord(n, ['كوكب واحد', 'كوكبان', 'كواكب', 'كوكبًا']);
