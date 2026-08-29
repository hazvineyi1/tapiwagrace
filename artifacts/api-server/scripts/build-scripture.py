#!/usr/bin/env python3
"""Regenerates src/lib/scripture.ts from the Berean Standard Bible.

Nothing in the generated file is written from memory. Every passage is looked
up in the BSB source text, so a verse can only be wrong if the source is.

    curl -o /tmp/bsb.usfx.xml \
      https://raw.githubusercontent.com/seven1m/open-bibles/master/eng-bsb.usfx.xml
    python3 artifacts/api-server/scripts/build-scripture.py /tmp/bsb.usfx.xml \
      > artifacts/api-server/src/lib/scripture.ts

The BSB is public domain. To add or drop a passage, edit PASSAGES below and
re-run. The themes are what the model matches against, so keep them concrete
and in the language a woman would use about her own situation.
"""
import html
import json
import re
import sys


def parse_bible(path):
    """Exact verse text from the USFX source. Each verse marker carries a bcv
    attribute, which is a cleaner key than tracking chapter state."""
    raw = open(path, encoding="utf-8").read()
    verses = {}
    parts = re.split(r'<v id="\d+" bcv="([A-Z0-9]+)\.(\d+)\.(\d+)"\s*/>', raw)
    for i in range(1, len(parts) - 3, 4):
        book, chap, verse, body = parts[i], parts[i + 1], parts[i + 2], parts[i + 3]
        body = re.split(r"<ve\s*/>", body)[0]
        body = re.sub(r"<f\b.*?</f>", "", body, flags=re.S)
        body = re.sub(r"<x\b.*?</x>", "", body, flags=re.S)
        body = re.sub(r"<[^>]+>", "", body)
        body = re.sub(r"\s+", " ", html.unescape(body)).strip()
        if body:
            verses[f"{book} {chap}:{verse}"] = body
    if len(verses) < 30000:
        raise SystemExit(f"only parsed {len(verses)} verses; check the source file")
    return verses


def balance_quotes(text):
    """A passage often begins or ends mid-quotation, leaving an orphan curly
    quote. Speech marks that do not pair carry no meaning here, so drop them
    all rather than ship a stray one. The words are never touched."""
    if text.count("“") != text.count("”"):
        text = text.replace("“", "").replace("”", "")
    return text.strip()


def lookup(bsb, book, chapter, verses):
    if "-" in verses:
        lo, hi = (int(x) for x in verses.split("-"))
        return " ".join(bsb[f"{book} {chapter}:{v}"] for v in range(lo, hi + 1))
    return bsb[f"{book} {chapter}:{verses}"]


def ts(value):
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'
BOOK_NAMES = {
  'GEN': 'Genesis', 'EXO': 'Exodus', 'DEU': 'Deuteronomy', 'JOS': 'Joshua',
  'PSA': 'Psalm', 'PRO': 'Proverbs', 'ECC': 'Ecclesiastes', 'ISA': 'Isaiah',
  'JER': 'Jeremiah', 'LAM': 'Lamentations', 'MIC': 'Micah', 'HAB': 'Habakkuk',
  'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John',
  'ROM': 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians',
  'GAL': 'Galatians', 'EPH': 'Ephesians', 'PHP': 'Philippians',
  'COL': 'Colossians', 'HEB': 'Hebrews', 'JAS': 'James',
  '1PE': '1 Peter', '1JN': '1 John', 'REV': 'Revelation',
}

# theme keys -> what a woman might actually be bringing
PASSAGES = [
  ('PHP', 4, '6-7',   ['anxiety', 'fear', 'overwhelm']),
  ('ISA', 41, '10',   ['anxiety', 'fear', 'transition']),
  ('1PE', 5, '7',     ['anxiety', 'burden']),
  ('PSA', 94, '19',   ['anxiety', 'overwhelm']),
  ('MAT', 6, '34',    ['anxiety', 'uncertainty']),

  ('MAT', 11, '28-30',['exhaustion', 'burden', 'rest', 'people-pleasing']),
  ('PSA', 55, '22',   ['burden', 'exhaustion']),
  ('ISA', 40, '31',   ['exhaustion', 'waiting', 'discouragement']),
  ('GAL', 6, '9',     ['discouragement', 'caring-for-others', 'perseverance']),

  ('PSA', 34, '18',   ['grief', 'loneliness', 'despair']),
  ('PSA', 147, '3',   ['grief', 'hurt']),
  ('MAT', 5, '4',     ['grief']),
  ('2CO', 1, '3-4',   ['grief', 'comfort']),

  ('ROM', 8, '1',     ['shame', 'guilt', 'failure']),
  ('PSA', 103, '12',  ['shame', 'guilt', 'forgiveness']),
  ('1JN', 1, '9',     ['guilt', 'forgiveness']),
  ('ISA', 43, '25',   ['shame', 'guilt']),

  ('PSA', 139, '13-14',['identity', 'worth', 'comparison']),
  ('EPH', 2, '10',    ['identity', 'calling', 'worth']),
  ('ISA', 43, '1-2',  ['identity', 'fear']),
  ('1PE', 2, '9',     ['identity', 'worth']),

  ('PSA', 27, '14',   ['waiting', 'uncertainty']),
  ('LAM', 3, '25-26', ['waiting', 'hope']),
  ('HAB', 2, '3',     ['waiting', 'calling']),

  ('PRO', 3, '5-6',   ['decisions', 'calling', 'uncertainty']),
  ('JER', 29, '11',   ['calling', 'uncertainty', 'hope']),
  ('PSA', 32, '8',    ['decisions', 'calling', 'transition']),
  ('MIC', 6, '8',     ['calling', 'purpose']),
  ('JAS', 1, '5',     ['decisions', 'wisdom']),
  ('PRO', 16, '9',    ['decisions', 'calling']),

  ('PSA', 139, '7-10',['loneliness', 'distance-from-God']),
  ('DEU', 31, '6',    ['loneliness', 'fear', 'transition']),
  ('GEN', 16, '13',   ['loneliness', 'feeling-unseen']),
  ('HEB', 13, '5',    ['loneliness', 'provision']),

  ('EPH', 4, '26-27', ['anger', 'resentment']),
  ('JAS', 1, '19-20', ['anger', 'relationships']),
  ('EPH', 4, '31-32', ['anger', 'resentment', 'forgiveness']),

  ('GAL', 6, '4-5',   ['comparison', 'boundaries', 'people-pleasing']),
  ('PRO', 14, '30',   ['comparison', 'envy']),

  ('MAT', 6, '31-33', ['provision', 'anxiety']),
  ('PHP', 4, '19',    ['provision']),
  ('PSA', 23, '1-3',  ['provision', 'rest', 'exhaustion']),

  ('COL', 3, '13',    ['forgiveness', 'relationships']),
  ('ROM', 12, '18',   ['relationships', 'conflict']),
  ('PRO', 15, '1',    ['relationships', 'conflict', 'anger']),
  ('1CO', 13, '4-5',  ['relationships', 'love']),

  ('ISA', 40, '11',   ['caring-for-others', 'motherhood', 'comfort']),
  ('1PE', 4, '10',    ['caring-for-others', 'calling']),

  ('2CO', 12, '9',    ['illness', 'weakness', 'failure']),
  ('PSA', 73, '26',   ['illness', 'exhaustion', 'weakness']),
  ('ROM', 8, '18',    ['illness', 'suffering', 'hope']),

  ('JOS', 1, '9',     ['fear', 'transition', 'discouragement']),
  ('2CO', 4, '16-18', ['discouragement', 'suffering', 'perseverance']),
  ('ROM', 5, '3-5',   ['perseverance', 'suffering', 'hope']),

  ('PSA', 46, '10',   ['rest', 'stillness', 'overwhelm']),
  ('EXO', 33, '14',   ['rest', 'transition']),
  ('MRK', 6, '31',    ['rest', 'exhaustion', 'boundaries']),

  ('LAM', 3, '22-23', ['hope', 'renewal', 'despair']),
  ('ROM', 15, '13',   ['hope', 'renewal']),
  ('ISA', 43, '18-19',['renewal', 'transition', 'hope']),
  ('2CO', 5, '17',    ['renewal', 'identity']),
  ('ECC', 3, '1',     ['transition', 'seasons']),

  ('GAL', 1, '10',    ['people-pleasing', 'boundaries']),
  ('PRO', 29, '25',   ['people-pleasing', 'fear']),
  ('PSA', 127, '1-2', ['boundaries', 'exhaustion', 'striving']),

  ('PSA', 42, '11',   ['despair', 'distance-from-God', 'hope']),
  ('MRK', 9, '24',    ['doubt', 'distance-from-God']),
  ('JAS', 4, '8',     ['distance-from-God']),
  ('PSA', 13, '1-2',  ['despair', 'distance-from-God', 'waiting']),
]


HEADER = '''/**
 * Verified scripture for the reflection companion.
 *
 * The model chooses a passage by REFERENCE ONLY. The text below is what the
 * site renders, so a misremembered verse is not possible: the worst the model
 * can do is pick a passage that fits poorly, never one that says something
 * scripture does not say.
 *
 * Berean Standard Bible, public domain. Generated by
 * scripts/build-scripture.py; do not edit by hand.
 *
 * Two passages carry an em dash inside the quotation (Isaiah 43:1-2 and
 * Psalm 127:1-2). That is the translation's own punctuation and is left alone;
 * we do not edit scripture to match a house style.
 */

export interface ScripturePassage {
  /** As a reader would cite it, e.g. "Philippians 4:6-7". */
  reference: string;
  /** Berean Standard Bible, verbatim. */
  text: string;
  /** What this passage speaks to, used by the model to choose. */
  themes: string[];
}

export const SCRIPTURE_LIBRARY: ScripturePassage[] = ['''

FOOTER = '''];

const BY_REFERENCE = new Map(SCRIPTURE_LIBRARY.map((p) => [p.reference, p]));

/**
 * Resolves what the model chose to verified text. Returns null for anything
 * not in the library, which is how an invented reference gets dropped rather
 * than published.
 */
export function findPassage(reference: string | null | undefined): ScripturePassage | null {
  if (!reference) return null;
  return BY_REFERENCE.get(reference.trim()) ?? null;
}

/** The catalogue the model chooses from, rendered into the system prompt. */
export function scriptureCatalogue(): string {
  return SCRIPTURE_LIBRARY.map(
    (p) => `${p.reference} [${p.themes.join(", ")}] ${p.text}`,
  ).join("\\n");
}
'''


def main():
    if len(sys.argv) < 2:
        raise SystemExit("usage: build-scripture.py <path to eng-bsb.usfx.xml>")
    bsb = parse_bible(sys.argv[1])

    lines = [HEADER]
    for book, chapter, verses, themes in PASSAGES:
        try:
            text = balance_quotes(lookup(bsb, book, chapter, verses))
        except KeyError as missing:
            raise SystemExit(f"{book} {chapter}:{verses} not found in the source ({missing})")
        lines.append("  {")
        lines.append(f"    reference: {ts(f'{BOOK_NAMES[book]} {chapter}:{verses}')},")
        lines.append(f"    text: {ts(text)},")
        lines.append("    themes: [" + ", ".join(ts(t) for t in themes) + "],")
        lines.append("  },")
    lines.append(FOOTER)

    print("\n".join(lines))
    print(f"{len(PASSAGES)} passages", file=sys.stderr)


if __name__ == "__main__":
    main()
