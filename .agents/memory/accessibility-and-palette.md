---
name: Accessibility and palette rules
description: The contrast, type and layout rules the 31&Rooted site is held to.
---

The site targets WCAG 2.2 AA. The palette itself — cream `#F7F5F0`, ink `#1C1A18`, moss `#1A2F20`, rust `#924026`, sand `#CDBEAB` — all passes; what failed was washing text out with opacity.

**Why:** Secondary text was set with alpha (`text-fg/40` through `/60`), which measured between 2.5:1 and 4.4:1 on cream — below the 4.5:1 minimum.

**How to apply:**
- Never use an opacity modifier on dark text over the cream background. Use `text-ink-muted` (`#57514A`, 7.19:1) for secondary copy and `text-ink-subtle` (`#6B645B`, 5.36:1) for micro-labels. Build hierarchy with size, weight and letter-spacing, not with washed-out colour.
- Text set over photography needs a scrim strong enough to pass against the *lightest* pixel behind it, not the average. Measure it rather than eyeballing.
- Keep 10px as the floor for the uppercase micro-labels.
- Every interactive control keeps a visible focus indicator. The global `:focus-visible` rule is a double ring — a dark outline plus a cream halo — so one half always shows, on cream and on the dark sections alike.
- Non-inline controls need a 24x24px hit area; add padding rather than shrinking type.
- On a 12-column grid the column gap must be small enough that the tracks are non-zero. A 96px gutter across 12 columns consumed the whole container and silently zeroed every track.
