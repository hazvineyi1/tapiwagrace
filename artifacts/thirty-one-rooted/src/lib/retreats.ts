/**
 * Everything the retreat page says about the retreats.
 *
 * Prices are per person in GBP and are the single place to change them.
 * Nothing here is fetched — it is content, and it should read like content.
 */

export interface RetreatPlace {
  place: string;
  year: string;
}

/**
 * Where retreats have been hosted so far — history, not a promise. The
 * destination is chosen per retreat, so the page must not imply that every
 * future one is in the same country.
 */
export const PAST_RETREATS: RetreatPlace[] = [{ place: 'Morocco', year: '2024' }];

/** The next destination, once it is public. Null until then. */
export const NEXT_RETREAT: RetreatPlace | null = { place: 'Tirana', year: '2027' };

/** Short vertical clips, served from `public/films/`. */
export interface Film {
  /** Filenames only; the base URL is applied at render time. */
  file: string;
  webm: string;
  poster: string;
  caption: string;
}

export const FILMS: Film[] = [
  { file: 'retreat-01.mp4', webm: 'retreat-01.webm', poster: 'retreat-01.jpg', caption: 'Breakfast, and the morning’s reading' },
  { file: 'retreat-02.mp4', webm: 'retreat-02.webm', poster: 'retreat-02.jpg', caption: 'The lounge, mid-afternoon' },
  { file: 'retreat-03.mp4', webm: 'retreat-03.webm', poster: 'retreat-03.jpg', caption: 'Supper at the long table' },
];

export const DEPOSIT_GBP = 250;

/** A film worth leading with. Set to null to hide the featured card. */
export const FEATURED_TIKTOK: { url: string; caption: string } | null = {
  url: 'https://vm.tiktok.com/ZN8Nw2tYs/',
  caption: 'A few days from the last retreat',
};

/**
 * Descriptions for the gallery, keyed by filename in
 * `attached_assets/retreat-gallery/`. Anything without an entry still shows,
 * described generically.
 */
export const ALT_TEXT: Record<string, string> = {};

export interface Retreat {
  id: string;
  name: string;
  nights: string;
  group: string;
  /** Per person, sharing a twin room. */
  fromGbp: number;
  /** Per person with a room to yourself. Null where it does not apply. */
  singleGbp: number | null;
  summary: string;
  forWhom: string;
  highlights: string[];
}

export const RETREATS: Retreat[] = [
  {
    id: 'weekend',
    name: 'The Weekend Retreat',
    nights: '3 nights',
    group: '10–12 women',
    fromGbp: 895,
    singleGbp: 1095,
    summary:
      'Long enough to actually arrive. Three days of teaching, stillness and honest conversation, with whole afternoons left deliberately empty.',
    forWhom: 'For the woman who cannot take a week away, but knows she cannot keep going as she is.',
    highlights: [
      'Two teaching sessions and two guided reflections',
      'A sisterhood circle each evening',
      'All meals, prepared on site',
      'Airport transfers both ways',
    ],
  },
  {
    id: 'week',
    name: 'The Week of Becoming',
    nights: '6 nights',
    group: '8–10 women',
    fromGbp: 1650,
    singleGbp: 1950,
    summary:
      'The fuller work. A smaller group, more space between sessions, and time for something to genuinely shift rather than just soften.',
    forWhom: 'For a season of real transition — a decision, a loss, a calling you have been circling for a while.',
    highlights: [
      'The full formation series across the week',
      'A one-to-one conversation with Tapiwanashe Grace',
      'A day away from the house — market, garden and hammam',
      'All meals, transfers, and the printed workbooks',
    ],
  },
  {
    id: 'private',
    name: 'The Private Retreat',
    nights: 'Dates by arrangement',
    group: 'Your own group of 6–12',
    fromGbp: 795,
    singleGbp: null,
    summary:
      'The whole house, for your church group, your leadership team, or the women you already walk with. Shaped around what your group actually needs.',
    forWhom: 'For a group that would rather go deep together than join strangers.',
    highlights: [
      'Exclusive use of the house and garden',
      'A programme built with you beforehand',
      'All meals and transfers',
      'From £795 per person, depending on group size and length',
    ],
  },
];

export const DAY_RHYTHM: { time: string; title: string; body: string }[] = [
  { time: 'Early', title: 'Stillness in the garden', body: 'Before the heat, before the talking. Come if you want to; sleep if you need to.' },
  { time: 'Morning', title: 'Breakfast at the long table', body: 'Mint tea, warm bread, and no one asking you to be impressive.' },
  { time: 'Late morning', title: 'Teaching and guided reflection', body: 'One idea, held properly, then time and a page to work it through.' },
  { time: 'Midday', title: 'Lunch, then the long afternoon', body: 'Nothing is scheduled. Swim, sleep, walk, write, or sit and do nothing on purpose.' },
  { time: 'Late afternoon', title: 'Sisterhood circle', body: 'Small groups. Honest talk. What you say here stays here.' },
  { time: 'Evening', title: 'Dinner under the reeds', body: 'The long table again, lamps lit, usually laughing by the second course.' },
  { time: 'Night', title: 'Worship, prayer, or an early night', body: 'Nothing is compulsory. Some nights we sing; some nights we go to bed at nine.' },
];

export const ACTIVITIES: { title: string; body: string; optional?: boolean }[] = [
  { title: 'Teaching sessions', body: 'Formation into Christlikeness, taught plainly and without hurry.' },
  { title: 'Guided reflection', body: 'The Cognitive Reframing, Breakthrough and Calling frameworks, worked through on paper.' },
  { title: 'Sisterhood circles', body: 'Small, held conversation. The part most women say they did not know they needed.' },
  { title: 'Solitude hours', body: 'Protected time alone. No phone, no programme, no one needing anything from you.' },
  { title: 'The long table', body: 'Every meal eaten together, cooked on site, unhurried.' },
  { title: 'Water and rest', body: 'The pool, the shade, and full permission to nap.' },
  { title: 'Journalling and writing', body: 'Prompts for the women who think best with a pen in their hand.' },
  { title: 'Market and garden walk', body: 'One morning out, to see where you actually are.', optional: true },
  { title: 'Hammam and massage', body: 'Traditional steam and treatment, arranged for those who want it.', optional: true },
  { title: 'Closing communion', body: 'The last evening, together, before we send you home.' },
];

export const INCLUDED = [
  'All accommodation for the nights listed',
  'Every meal, snack and endless mint tea',
  'All teaching, reflection sessions and circles',
  'Printed workbooks to take home',
  'Airport transfers on arrival and departure',
];

export const NOT_INCLUDED = [
  'Flights — you book your own, and we advise on the best arrival window',
  'Travel insurance, which we ask every guest to hold',
  'Optional treatments such as hammam and massage',
  'Anything you buy for yourself while you are there',
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Are flights included?',
    a: 'No. You book your own flights, which usually works out cheaper and lets you choose your route. Once you have booked a place we tell you the arrival window to aim for, and we collect you from the airport.',
  },
  {
    q: 'Can I come on my own?',
    a: 'Most women do. You will not be the only one arriving alone, and the first evening is built around making that easy.',
  },
  {
    q: 'Can I have a room to myself?',
    a: 'Yes. Prices are shown per person sharing a twin, with a single-occupancy price alongside. Single rooms are limited, so ask early.',
  },
  {
    q: 'What if I have dietary needs?',
    a: 'Tell us when you book. Everything is cooked on site, so allergies, intolerances and preferences are straightforward to work around.',
  },
  {
    q: 'How fit or able do I need to be?',
    a: 'Not especially. The house is walkable and nothing is compulsory. If stairs, heat or mobility are a concern, tell us and we will be honest about whether it will suit you.',
  },
  {
    q: 'Do I have to be a Christian?',
    a: 'The retreat is openly Christ-centred, and that shapes the teaching and the prayer. You are welcome if you are willing to be in that space, wherever you are with faith yourself.',
  },
  {
    q: 'What should I bring?',
    a: 'Light clothes, something warmer for the evenings, modest swimwear, a journal you like writing in, and any medication you need. We send a full list once you have booked.',
  },
  {
    q: 'How does payment work?',
    a: `A £${DEPOSIT_GBP} deposit secures your place, with the balance due eight weeks before departure. If instalments would make it possible, ask — we would rather find a way than lose you.`,
  },
  {
    q: 'What about visas and entry requirements?',
    a: 'These depend on your passport and on the destination. We confirm exactly what applies to you before you book anything non-refundable.',
  },
];
