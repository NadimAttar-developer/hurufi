# حروفي — Hurufi

An Arabic, right-to-left website that teaches children (ages 6–10) the Arabic letters as a trip between planets: every letter is a planet, every lesson has four activities, and every activity earns a star.

Built from the «حروفي — كوكب الضاد» design system and the screen designs on the «حروفي — الصفحة الرئيسية» design canvas.

## Run it

**Without a server:** run `npm run build`, then double-click `dist/index.html`. The build is one self-contained file (code, styles and images inlined), so it opens straight from the disk and can be copied anywhere. Fonts still load from Google Fonts, so they need an internet connection.

> The `index.html` in the project root is the *source* file. Opening it directly shows a short note instead of the site, because browsers will not run its TypeScript from the disk.

**While developing:**

```bash
npm install
npm run dev        # http://localhost:5173 — reloads as you edit
npm run build      # type-check + build dist/index.html
```

Needs Node 18 or newer. URLs use a hash, e.g. `index.html#/map`, so they work both from a server and from the file.

## Pages

| Route | What it is |
|---|---|
| `#/` | Homepage |
| `#/map` | The 28-planet letter map; tap a planet to see its card |
| `/planet/:slug/:activity` | A lesson activity: `listen`, `choose`, `trace`, `build` |
| `/parents` | Parents' dashboard (light "day" theme, example data) |

`/planet/ba` opens the first unfinished activity of the ب planet.

## How it is organised

```
src/
  styles/tokens.css      colours, fonts, spacing, radii from the design system
  styles/global.css      base styles, buttons, cards
  data/letters.ts        the 28 letters (slug, char, name, spoken name)
  data/lessons.ts        lesson content per letter — only ب is written so far
  data/parentsDemo.ts    example data for the parents' dashboard
  state/ProgressContext  the child's progress, stars and mute setting (saved in localStorage)
  lesson/                LessonShell + the four activities
  pages/                 Home, Map, Lesson, Parents, NotFound
  components/            Logo, Icon, Planet, StarPill, SiteHeader, SiteFooter
  lib/                   Arabic digits and counting, speech, media query hook
```

## Adding a letter's lesson

Add an entry to `LESSONS` in `src/data/lessons.ts`, keyed by the letter's slug from `letters.ts`. For tracing, draw the letter's path inside a 400×300 box in writing order and list 8–12 checkpoints along it. Planets without content show a "coming soon" screen.

## Things that are stand-ins for now

- **Sound** uses the browser's built-in voice (Web Speech API). Quality depends on the device, and some devices have no Arabic voice. Replace `src/lib/speech.ts` with recorded audio before launch.
- **Progress** lives in the browser's localStorage. There are no accounts or server yet.
- **Starting point**: a new visitor starts with ا already finished and ب as the current planet, so the full ب lesson can be played. Change `INITIAL` in `ProgressContext.tsx`.
- **Parents' dashboard** shows example children and numbers, labelled «بيانات مثال». Only the play-time and reminder settings are saved, and only in the browser.
- Footer links for privacy and contact have no pages yet.
