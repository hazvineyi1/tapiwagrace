# Retreat gallery

Drop retreat photographs into this folder and they appear in the "Moments"
section of the retreat page automatically — no code change needed.

- Formats: `.webp` (preferred), `.jpg`, `.jpeg`, `.png`
- They are shown in filename order, so prefix them: `01-arrival.webp`,
  `02-the-table.webp`, and so on.
- Give each one a description for screen readers by adding a line to
  `ALT_TEXT` in `artifacts/thirty-one-rooted/src/lib/retreats.ts`, keyed by
  filename. Without one the photo still shows, described generically.
- Before adding a photograph in which people are recognisable, make sure
  everyone in it has agreed to it appearing on a public website.

## Faces

If a photograph shows recognisable guests and you would rather their faces
were softened, say so when you add it and it can be blurred — detection and a
feathered blur are straightforward on stills. Doing the same across video is
unreliable at phone-camera resolution, so clips are published as shot.
