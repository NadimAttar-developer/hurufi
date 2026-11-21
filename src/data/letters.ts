export interface Letter {
  /** Latin id used in URLs, e.g. /planet/ba */
  slug: string;
  /** The isolated letter, e.g. ب */
  char: string;
  /** Name with the article, e.g. الباء */
  name: string;
  /** What the voice should say for the letter's name */
  spoken: string;
}

export const LETTERS: Letter[] = [
  { slug: 'alif', char: 'ا', name: 'الألف', spoken: 'أَلِف' },
  { slug: 'ba', char: 'ب', name: 'الباء', spoken: 'باء' },
  { slug: 'ta', char: 'ت', name: 'التاء', spoken: 'تاء' },
  { slug: 'tha', char: 'ث', name: 'الثاء', spoken: 'ثاء' },
  { slug: 'jim', char: 'ج', name: 'الجيم', spoken: 'جيم' },
  { slug: 'hha', char: 'ح', name: 'الحاء', spoken: 'حاء' },
  { slug: 'kha', char: 'خ', name: 'الخاء', spoken: 'خاء' },
  { slug: 'dal', char: 'د', name: 'الدال', spoken: 'دال' },
  { slug: 'dhal', char: 'ذ', name: 'الذال', spoken: 'ذال' },
  { slug: 'ra', char: 'ر', name: 'الراء', spoken: 'راء' },
  { slug: 'zay', char: 'ز', name: 'الزاي', spoken: 'زاي' },
  { slug: 'sin', char: 'س', name: 'السين', spoken: 'سين' },
  { slug: 'shin', char: 'ش', name: 'الشين', spoken: 'شين' },
  { slug: 'sad', char: 'ص', name: 'الصاد', spoken: 'صاد' },
  { slug: 'dad', char: 'ض', name: 'الضاد', spoken: 'ضاد' },
  { slug: 'tta', char: 'ط', name: 'الطاء', spoken: 'طاء' },
  { slug: 'zza', char: 'ظ', name: 'الظاء', spoken: 'ظاء' },
  { slug: 'ayn', char: 'ع', name: 'العين', spoken: 'عين' },
  { slug: 'ghayn', char: 'غ', name: 'الغين', spoken: 'غين' },
  { slug: 'fa', char: 'ف', name: 'الفاء', spoken: 'فاء' },
  { slug: 'qaf', char: 'ق', name: 'القاف', spoken: 'قاف' },
  { slug: 'kaf', char: 'ك', name: 'الكاف', spoken: 'كاف' },
  { slug: 'lam', char: 'ل', name: 'اللام', spoken: 'لام' },
  { slug: 'mim', char: 'م', name: 'الميم', spoken: 'ميم' },
  { slug: 'nun', char: 'ن', name: 'النون', spoken: 'نون' },
  { slug: 'ha', char: 'ه', name: 'الهاء', spoken: 'هاء' },
  { slug: 'waw', char: 'و', name: 'الواو', spoken: 'واو' },
  { slug: 'ya', char: 'ي', name: 'الياء', spoken: 'ياء' },
];

/** ض gives Arabic its nickname, "the language of ض". */
export const DAD_INDEX = 14;

export function letterIndex(slug: string): number {
  return LETTERS.findIndex((l) => l.slug === slug);
}
