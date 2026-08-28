# 31&Rooted

A digital home for **31&Rooted** — a Christ-centred community for women founded by Tapiwanashe Grace Pereira — bringing its two arms, **31&Rooted Retreats** and **31 Sisters Daily**, into one site where visitors can read, reflect, and send a real enquiry.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/thirty-one-rooted run dev` — run the website (needs `PORT` and `BASE_PATH`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `ANTHROPIC_API_KEY` — enables the AI reflection companion; without it the site falls back to the scripted reflection
- Optional env: `API_PROXY_TARGET` — where the web dev server proxies `/api` (default `http://localhost:8080`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: React 19 + Vite 7 + Tailwind v4 + wouter, TanStack Query
- API: Express 5
- AI: Anthropic SDK (`claude-opus-5`) for the reflection companion
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod v4, shared between client and server via generated schemas
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- **Website** — `artifacts/thirty-one-rooted/`. Pages in `src/pages/`, shared chrome in `src/components/` (`site-header`, `site-footer`, `site-chrome`, `booking-modal`).
- **Theme** — `artifacts/thirty-one-rooted/src/index.css`. Palette and fonts are Tailwind v4 `@theme` tokens; the bespoke photo compositions are `@layer components` below them.
- **Imagery** — `attached_assets/`, imported through the `@assets` Vite alias.
- **API** — `artifacts/api-server/src/routes/`. One file per resource, registered in `routes/index.ts`.
- **API contract (source of truth)** — `lib/api-spec/openapi.yaml`. Everything in `lib/api-zod` and `lib/api-client-react` is generated from it; never hand-edit those.
- **DB schema (source of truth)** — `lib/db/src/schema/`, one file per table.
- **Design mockups** — `artifacts/mockup-sandbox/`, a preview server for saved design explorations. Not part of the live site.
- **Standing content/design decisions** — `.agents/memory/`.

## Architecture decisions

- **The OpenAPI spec drives both sides.** The server validates request bodies with the same generated Zod schemas the client is typed against, so a contract change cannot silently drift. Add an endpoint by editing `openapi.yaml`, running codegen, then writing the route.
- **Enquiries are recorded, never auto-confirmed.** Bookings land in `bookings` with status `new`; the founder follows up by hand. The UI deliberately says "we will reply", not "your place is confirmed".
- **No fabricated retreat dates.** The booking flow asks for a *preferred* date via a date input with a `min` of today, rather than offering a list of dates nobody has committed to. Availability is settled in the reply.
- **Newsletter sign-up is idempotent.** Emails are lowercased and the insert is `onConflictDoNothing`, so re-subscribing reports `alreadySubscribed` instead of erroring.
- **One shared chrome instance.** `SiteChromeProvider` owns the booking modal and the toast so the header, footer and any page all drive the same one.
- **The companion degrades, it does not break.** With no `ANTHROPIC_API_KEY` the endpoint returns 503 and the UI silently runs the scripted reflection instead. Never let a missing key surface an error to a visitor.
- **Reflection conversations are not persisted.** People say vulnerable things there; the endpoint is stateless and writes nothing. The conversation lives only in the browser tab.
- **The reflection endpoint is rate limited** (30 per 15 minutes per IP, in memory). It spends real money on behalf of anonymous visitors. If the site is ever scaled past one instance, move this to a shared store.
- **Display type is the serif.** `h1`/`h2` are Cormorant Garamond at weight 300 via a base rule; body and UI stay in DM Sans. Don't add `font-sans` to a heading.
- **Secondary text is solid ink, never alpha.** `text-ink-muted` and `text-ink-subtle` are tokens chosen to clear WCAG AA on cream and on every tinted panel. See `.agents/memory/accessibility-and-palette.md`.

## Product

- **Home** (`/`) — hero, the founder's story, the two arms of the ministry, three doorways (retreat, conversation, 31 Sisters Daily), the guided-reflection tool, and the meal-support programme.
- **Guided Reflection** — an AI companion (`POST /api/reflection`) that reflects with a visitor across four focuses (Cognitive Reframing, Breakthrough, Calling, or no set agenda). It can surface a scripture anchor, a paraphrased perspective from a named thinker, and one small practice. It is explicitly *not* clinical care or crisis support, and that disclaimer must stay. See `.agents/memory/reflection-companion.md`.
- **Booking** — a three-step flow for a retreat, a conversation, or meal packaging. Persists to `bookings`.
- **Contact** (`/contact`) — a form that persists to `contact_messages`, plus shortcuts into the booking flow.
- **Newsletter** — footer sign-up, persists to `newsletter_subscribers`.

## User preferences

- The site must be **clean, minimal, functional and appealing**. Extend the existing editorial theme rather than redesigning it.
- WhatsApp is **not** a priority as a contact channel — the contact page and booking flow are.
- Never invent a per-meal price for the meal programme, or a retreat price. See `.agents/memory/meal-program-positioning.md`.
- Photography direction is settled; see `.agents/memory/founder-portrait-treatment.md` and `line-art-direction.md`. No rotation, stickers, badges or busy collage.

## Gotchas

- `lib/db/src/index.ts` throws at import time without `DATABASE_URL`, so the API server will not boot without a database.
- `vite.config.ts` requires both `PORT` and `BASE_PATH` to be set, even for `build`.
- Generated files under `lib/api-zod/src/generated` and `lib/api-client-react/src/generated` are wiped and rewritten by codegen — edit `openapi.yaml` instead.
- Orval emits Zod **v4** syntax (`zod.email()`, `zod.int()`). The catalog is pinned to zod v4 for this reason; downgrading breaks codegen output.
- The companion's Anthropic call sends a synthetic first `user` message before the stored turns — the API requires the first message to be `user`, but the conversation opens with the guide speaking.
- On `md:grid-cols-12`, keep the column gap at `gap-x-8 lg:gap-x-16`. A larger gutter (11 of them) exceeds the container and silently collapses every track to `0px`, which pushed the page sideways at 768-1024px.
- The header switches to the drawer at `lg`, not `md` — five links plus the wordmark and button do not fit at 768px.
- `attached_assets/` carries ~54 MB of PDFs that nothing imports. They are the ministry's real workbooks and retreat guide — do not delete them casually, but do not add more large binaries to git.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
