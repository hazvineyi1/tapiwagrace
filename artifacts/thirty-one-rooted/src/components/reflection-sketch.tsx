import { useEffect, useRef, useState } from 'react';

/**
 * A seedling with its roots showing, drawn once and left almost invisible.
 *
 * It is decoration and nothing else: aria-hidden, no pointer events, and far
 * enough below the text that it can never sit behind a word. The strokes draw
 * themselves in when the panel first comes into view, which is the whole of the
 * fun, and hold still afterwards. Anyone who has asked for less motion simply
 * gets the finished drawing.
 */
export function ReflectionSketch() {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || drawn) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [drawn]);

  return (
    <svg
      ref={ref}
      className={`reflection-sketch${drawn ? ' is-drawn' : ''}`}
      viewBox="0 0 200 420"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
  {/* stem, an easy S rather than a ruled line */}
  <path d="M101 26 C 95 72, 107 118, 101 164 C 98 186, 101 200, 100 214" />
  {/* leaves: asymmetric, tapering to a point, each with a midrib */}
  <path d="M101 62 C 116 40, 143 34, 158 40 C 146 62, 121 74, 101 62 Z" />
  <path d="M101 62 C 118 54, 140 45, 158 40" strokeOpacity="0.55" />
  <path d="M100 100 C 84 80, 58 76, 44 84 C 57 105, 82 114, 100 100 Z" />
  <path d="M100 100 C 84 93, 61 87, 44 84" strokeOpacity="0.55" />
  <path d="M102 138 C 118 118, 142 113, 156 120 C 143 141, 119 149, 102 138 Z" />
  <path d="M102 138 C 119 131, 140 124, 156 120" strokeOpacity="0.55" />
  <path d="M100 176 C 86 160, 66 156, 54 162 C 65 180, 86 187, 100 176 Z" />
  <path d="M100 176 C 86 170, 68 165, 54 162" strokeOpacity="0.55" />
  {/* soil */}
  <path d="M40 218 C 72 212, 130 212, 162 218" className="soil" strokeOpacity="0.8" />
  {/* taproot and laterals, thinning as they go */}
  <path d="M100 214 C 103 244, 99 272, 95 302 C 92 330, 90 356, 86 386" />
  <path d="M101 238 C 86 254, 72 272, 64 296 C 58 318, 55 336, 53 356" />
  <path d="M100 256 C 116 272, 130 292, 137 316 C 143 336, 145 350, 147 366" />
  <path d="M97 292 C 88 308, 83 324, 81 346" strokeOpacity="0.7" />
  <path d="M103 302 C 112 318, 117 334, 119 352" strokeOpacity="0.7" />
  <path d="M92 324 C 83 338, 77 350, 73 364" strokeOpacity="0.55" />
  <path d="M88 352 C 83 366, 80 378, 78 392" strokeOpacity="0.55" />
  <path d="M135 324 C 143 338, 147 352, 149 368" strokeOpacity="0.55" />
  <path d="M66 288 C 58 298, 52 308, 48 320" strokeOpacity="0.45" />
  <path d="M129 300 C 137 310, 142 320, 145 330" strokeOpacity="0.45" />
    </svg>
  );
}
