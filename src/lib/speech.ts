/**
 * Speaks Arabic text with the browser's built-in voice (Web Speech API).
 * This is a stand-in until recorded audio files exist: quality depends on the
 * device, and some browsers have no Arabic voice at all.
 */
let arabicVoice: SpeechSynthesisVoice | null | undefined;

function findArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase().startsWith('ar')) ?? null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    arabicVoice = findArabicVoice();
  };
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, options: { rate?: number } = {}): void {
  if (!canSpeak()) return;
  if (arabicVoice === undefined) arabicVoice = findArabicVoice();
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = arabicVoice?.lang ?? 'ar-SA';
  if (arabicVoice) utterance.voice = arabicVoice;
  utterance.rate = options.rate ?? 0.85;
  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
