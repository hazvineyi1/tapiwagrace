# 31&Rooted

A digital home for **31&Rooted** — a Christ-centred community for women founded by Tapiwanashe Grace Pereira — bringing its two arms, **31&Rooted Retreats** and **31 Sisters Daily**, into one site where visitors can read, reflect, and send a real enquiry.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/thirty-one-rooted run dev` — run the website (dev server; proxies `/api` to the API)
- `pnpm run build:deploy` — build exactly what ships: the site, then the API bundle
- `pnpm run start` — run the production server: one process serving the built site and the API
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run generate` — write a migration after a schema change
- `pnpm --filter @workspace/db run migrate` — apply migrations (this is what production runs)
- `pnpm --filter @workspace/db run push` — reshape the DB to match the schema. **Local development only**: it can drop columns and tables
- Required env: `DATABASE_URL` — Postgres connection string
- Optional env: `ANTHROPIC_API_KEY` — enables the AI reflection companion; without it the site falls back to the scripted reflection
- Recommended env: `RATE_LIMIT_SALT` — salts the hashed IPs used for rate limiting; `ALLOWED_ORIGINS` — comma-separated CORS allowlist, defaults to the live domain
- Optional env for enquiry emails: `SMTP_HOST`, `SMTP_PORT` (default 587), `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `ENQUIRY_TO`, `ENQUIRY_FROM`. Unset, enquiries are still stored — they are just not emailed.
- Build-time env: `SITE_ORIGIN` — defaults to `https://www.tapiwanashegrace.com` (the live domain, registered with GoDaddy). Drives the canonical, `og:url`, `og:image` and `sitemap.xml`. Override for a staging build; set it to an empty string for relative tags and no sitemap.
- Optional env: `API_PROXY_TARGET` — where the web dev server proxies `/api` (default `http://localhost:8080`)

## Stack

- pnpm workspaces, Node.js 22+, TypeScript 5.9
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
- **Every enquiry emails the founder.** Bookings, contact messages and new newsletter sign-ups fire `notifyEnquiry`, with `Reply-To` set to the enquirer. It is fire-and-forget and never rejects — the database row is the record of truth, the email is a convenience. A repeat newsletter sign-up sends nothing.
- **Retreat content is data, not markup.** `src/lib/retreats.ts` holds the retreats, prices, day rhythm, activities and FAQ. Change a price there and it changes everywhere, formatted as sterling by `Intl.NumberFormat`.
- **The retreat gallery is a drop-in folder.** Anything in `attached_assets/retreat-gallery/` is picked up by `import.meta.glob` and rendered in filename order — no import to add. Alt text is keyed by filename in `ALT_TEXT`.
- **TikTok is linked, never embedded.** An embed would load third-party tracking scripts and contradict the "no cookies, no tracking" claim in the privacy notice.
- **Past and next destinations are separate.** `PAST_RETREATS` is history (Morocco, 2024); `NEXT_RETREAT` is the forthcoming one (Tirana, 2027). The page must never imply every retreat is in the same country.
- **Films are self-hosted and load only on demand.** `public/films/` holds an MP4 and a WebM per clip plus a poster. `FilmCard` shows the poster and mounts the `<video>` only when pressed, so nothing downloads until a visitor asks. MP4 first, WebM for builds without an H.264 decoder. Self-hosted for the same reason TikTok is not embedded: no third-party requests.
- **Payment details are config, and start empty.** `src/lib/payments.ts` holds `DEPOSIT_PAYMENT_LINK`, `BANK_TRANSFER` and `FINANCIAL_PROTECTION`, all null until real values exist. Until then the page says a secure link is sent on confirmation, no button is rendered, and no protection is claimed. Never put a placeholder URL — or an unearned promise — on a page that asks for money.
- **`FINANCIAL_PROTECTION` is a factual claim, not decoration.** Setting it makes the site tell people their money is held in trust, and adds the section the Package Travel Regulations require to the booking terms. Set it only once a trust provider has confirmed the membership, and paste the provider's own mandated wording into `statement` — the default is plain English, not their required text.
- **The deposit link is provider-neutral.** It is named `DEPOSIT_PAYMENT_LINK`, not after Stripe, because it may be issued by a trust-based travel provider instead.
- **The payment sequence has to match the terms.** Enquiry first, then we confirm, then the deposit. Do not offer payment before confirmation — the booking terms say an enquiry is not a booking.
- **Social links live in one place.** `src/lib/contact.ts` holds `SOCIALS`; entries with a `null` url are skipped rather than rendered dead. Add a URL there and it appears in the footer and on the contact page at once.
- **Reflection conversations are not persisted.** People say vulnerable things there; the endpoint is stateless and writes nothing. The conversation lives only in the browser tab.
- **Every public endpoint is rate limited, in the database.** The site runs on autoscale, so an in-process counter would be per-instance and lost on each scale-to-zero. Buckets key on a salted SHA-256 of the caller's IP — the address itself is never stored, and rows are pruned after 24 hours. Forms allow 10 per hour, the reflection companion 30 per 15 minutes.
- **One process serves both the site and the API.** `mountSite` in `artifacts/api-server/src/lib/static-site.ts` serves `artifacts/thirty-one-rooted/dist/public` after the `/api` routes. Same origin means no CORS in production, one deployment, one certificate, and response headers we control. An unknown `/api/*` path is always a JSON 404; anything else falls back to `index.html` for client-side routing.
- **Security headers are set in code, in one place.** The site's Content-Security-Policy lives in `static-site.ts`, not in a `<meta>` tag, because `frame-ancestors` and `Strict-Transport-Security` are ignored in meta. The `/api` responses get their own, much tighter set. Don't add a second policy to the document head — two policies intersect, and they will drift.
- **`app.set("trust proxy", 1)` is load-bearing.** Without it every request carries the platform router's IP and the rate limiter throttles all visitors as one. `1` trusts only the last hop so `X-Forwarded-For` cannot be spoofed past it.
- **The forms carry a honeypot.** A filled `website` field means automation; the route answers as though it succeeded and stores nothing, because a 400 just tells the author to try again.
- **Migrations, not push.** The API runs `migrate` at startup, before it listens, inside a Postgres advisory lock so concurrent instances cannot race. A failed migration means the process exits and the health check fails, so a broken deploy never goes live. `scripts/post-merge.sh` runs the same thing locally after a merge. Never wire `push` into automation — it reshapes the database to match the schema and can drop data.
- **Photographs render true.** No `filter:` on a photograph — no saturate, contrast or sepia washes — and captions sit below images rather than on a dark scrim over them. If a caption must go over a photograph, measure it against the lightest pixel behind it.
- **Display type is the serif.** `h1`/`h2` are Cormorant Garamond at weight 300 via a base rule; body and UI stay in DM Sans. Don't add `font-sans` to a heading.
- **Secondary text is solid ink, never alpha.** `text-ink-muted` and `text-ink-subtle` are tokens chosen to clear WCAG AA on cream and on every tinted panel. See `.agents/memory/accessibility-and-palette.md`.

## Deployment

Railway, from this repo. `railway.json` holds the whole configuration:

- Build: `pnpm run build:deploy`
- Start: `pnpm run start`
- Health check: `/api/healthz`

Add Railway's PostgreSQL plugin and `DATABASE_URL` is injected for you; nothing else is required to boot. Everything in **Run & Operate** above that is optional stays optional — the site comes up without an Anthropic key or SMTP, it just falls back to the scripted reflection and stops emailing enquiries.

The domain is registered with GoDaddy. Add it to the Railway service, then create the DNS records Railway shows you, and 301 the apex to `www`.

A healthy boot logs three lines, in this order: `Serving the built site`, `Database schema is up to date`, `Server listening`. If the first is missing the web build did not run; if the second is missing the database is unreachable and the process will have exited.


## Product

- **Retreats** (`/retreats`) — the setting, a day's rhythm, activities, three retreats with GBP pricing, what is and is not included, TikTok, a photo gallery and an FAQ. All the words and prices live in `src/lib/retreats.ts`.
- **Home** (`/`) — hero, the founder's story, the two arms of the ministry, three doorways (retreat, conversation, 31 Sisters Daily), the guided-reflection tool, and the meal-support programme.
- **Guided Reflection** — an AI companion (`POST /api/reflection`) that reflects with a visitor across four focuses (Cognitive Reframing, Breakthrough, Calling, or no set agenda). It can surface a scripture anchor, a paraphrased perspective from a named thinker, and one small practice. It is explicitly *not* clinical care or crisis support, and that disclaimer must stay. See `.agents/memory/reflection-companion.md`.
- **Booking** — a three-step flow for a retreat, a conversation, or meal packaging. Persists to `bookings`.
- **Contact** (`/contact`) — a form that persists to `contact_messages`, plus shortcuts into the booking flow, the real email and phone, and the social links.
- **Privacy** (`/privacy`) — the UK GDPR notice. It describes what the code actually does; if the data flows change, change this page too.
- **Newsletter** — footer sign-up, persists to `newsletter_subscribers`.

## User preferences

- The site must be **clean, minimal, functional and appealing**. Extend the existing editorial theme rather than redesigning it.
- WhatsApp is **not** a priority as a contact channel — the contact page and booking flow are.
- Never invent a per-meal price for the meal programme, or a retreat price. See `.agents/memory/meal-program-positioning.md`.
- Photography direction is settled; see `.agents/memory/founder-portrait-treatment.md` and `line-art-direction.md`. No rotation, stickers, badges or busy collage.

## Gotchas

- `lib/db/src/index.ts` throws at import time without `DATABASE_URL`, so the API server will not boot without a database.
- The API serves the built site, so `pnpm run start` needs the web build to exist. `build:deploy` does both in the right order; the server logs a warning and runs API-only if the build is missing.
- Generated files under `lib/api-zod/src/generated` and `lib/api-client-react/src/generated` are wiped and rewritten by codegen — edit `openapi.yaml` instead.
- Orval emits Zod **v4** syntax (`zod.email()`, `zod.int()`). The catalog is pinned to zod v4 for this reason; downgrading breaks codegen output.
- The companion's Anthropic call sends a synthetic first `user` message before the stored turns — the API requires the first message to be `user`, but the conversation opens with the guide speaking.
- On `md:grid-cols-12`, keep the column gap at `gap-x-8 lg:gap-x-16`. A larger gutter (11 of them) exceeds the container and silently collapses every track to `0px`, which pushed the page sideways at 768-1024px.
- The header switches to the drawer at `lg`, not `md` — five links plus the wordmark and button do not fit at 768px.
- `robots.txt` and `sitemap.xml` are emitted by the `site-meta` Vite plugin, not kept in `public/`. Don't add static copies back or they will conflict.
- British English throughout: "programme", "practise" as the verb, sterling. The reflection companion's system prompt says so too.
- `attached_assets/` carries ~54 MB of PDFs that nothing imports. They are the ministry's real workbooks and retreat guide — do not delete them casually, but do not add more large binaries to git.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
