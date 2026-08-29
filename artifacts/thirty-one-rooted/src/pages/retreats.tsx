import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Minus, Play } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link } from 'wouter';

import { FilmCard } from '@/components/film-card';
import { useSiteChrome } from '@/components/site-chrome';
import { activeSocials } from '@/lib/contact';
import {
  BANK_TRANSFER,
  DEPOSIT_PAYMENT_LINK,
  FINANCIAL_PROTECTION,
  protectionStatement,
} from '@/lib/payments';
import {
  ACTIVITIES,
  ALT_TEXT,
  FEATURED_TIKTOK,
  DAY_RHYTHM,
  DEPOSIT_GBP,
  FAQ,
  FILMS,
  INCLUDED,
  NOT_INCLUDED,
  NEXT_RETREAT,
  PAST_RETREATS,
  RETREATS,
} from '@/lib/retreats';

import retreatPool from '@assets/retreat-pool.webp';
import retreatTea from '@assets/retreat-tea.webp';
import retreatLounge from '@assets/retreat-lounge.webp';

const gbp = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

const EYEBROW = 'text-[10px] tracking-[0.2em] uppercase text-rust font-medium';

/**
 * Whatever is in attached_assets/retreat-gallery/ shows up here. Dropping a
 * file into that folder is the whole workflow — no import to add.
 */
const GALLERY = Object.entries(
  import.meta.glob('../../../../attached_assets/retreat-gallery/*.{webp,jpg,jpeg,png}', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>,
)
  .map(([path, src]) => {
    const file = path.split('/').pop() ?? '';
    return { file, src, alt: ALT_TEXT[file] ?? 'A moment from a 31 & Rooted retreat' };
  })
  .sort((a, b) => a.file.localeCompare(b.file));

/** The card leans on a real photograph rather than a TikTok thumbnail, which
 *  would leak the visitor's IP to a third party. */
const featuredPoster = GALLERY[0]?.src ?? retreatTea;

export default function Retreats() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { openBooking } = useSiteChrome();
  const tiktoks = activeSocials().filter((s) => s.platform === 'tiktok');

  useEffect(() => {
    document.title = 'Retreats | 31&Rooted';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">

      {/* Hero */}
      <section className="pt-40 md:pt-48 pb-16 md:pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16 items-end">
          <div className="min-w-0 md:col-span-7">
            <span className={`${EYEBROW} mb-6 block`}>31 &amp; Rooted Retreats</span>
            <h1 className="text-[2.9rem] md:text-[4.2rem] leading-[1.04] text-moss mb-8">
              Come away for a few days.<br /><em className="italic text-rust">Go home different.</em>
            </h1>
            <p className="text-[17px] md:text-[18px] text-ink-muted leading-relaxed max-w-xl mb-10">
              A walled house, a garden, a pool, and a long table under the reeds. Small groups of women, unhurried days,
              and enough space for God to tend to what you have been carrying alone.
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Retreat')} data-testid="button-retreat-hero-book">
                Register your interest
              </button>
              <a href="#retreat-options" className="py-2 text-[10px] tracking-[0.2em] uppercase border-b border-line hover:border-rust hover:text-rust transition-colors">
                See the retreats &amp; prices
              </a>
            </div>
          </div>
          <div className="min-w-0 md:col-span-5">
            <figure className="retreat-hero-figure">
              <img src={retreatPool} width={1500} height={2000} alt="The retreat house and pool in the morning sun" loading="eager" decoding="async" />
            </figure>
          </div>
        </div>
      </section>

      {/* The setting */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-line">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16 items-center">
          <div className="min-w-0 md:col-span-5">
            <span className={`${EYEBROW} mb-6 block`}>The setting</span>
            <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg mb-6">
              Somewhere quiet enough to <em className="italic text-rust">hear yourself.</em>
            </h2>
            <p className="text-[16px] text-ink-muted leading-relaxed mb-5">
              We take over a whole house: thick earth walls, shaded terraces, a pool, and a garden that keeps the noise
              of everything else out. Meals happen at one long mosaic table under a reed canopy, and the mint tea does
              not stop.
            </p>
            {PAST_RETREATS.length > 0 && (
              <p className="text-[16px] text-ink-muted leading-relaxed mb-5">
                The photographs and films on this page are from our last retreat, in{' '}
                <strong className="font-normal text-fg">
                  {PAST_RETREATS.map((r) => `${r.place}, ${r.year}`).join(' and ')}
                </strong>.
              </p>
            )}
            <p className="text-[16px] text-ink-muted leading-relaxed">
              {NEXT_RETREAT
                ? `The next is ${NEXT_RETREAT.place}, ${NEXT_RETREAT.year}. You will have the address and full travel notes as soon as you book.`
                : 'We choose the house for each retreat, so the destination is confirmed along with the dates, together with travel notes and the flights to look for.'}
            </p>
          </div>
          <div className="min-w-0 md:col-span-7">
            <div className="retreat-gallery">
              <figure className="retreat-gallery-wide">
                <img src={retreatTea} width={1500} height={2000} alt="The long mosaic table set for tea under a reed canopy" loading="lazy" decoding="async" />
              </figure>
              <figure>
                <img src={retreatLounge} width={1500} height={2000} alt="The indoor sitting room, laid out with towels and rose petals" loading="lazy" decoding="async" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* A day */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-moss text-bg">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14 md:mb-20">
            <span className="text-[10px] tracking-[0.2em] uppercase text-sand font-medium mb-6 block">A day, roughly</span>
            <h2 className="text-[2.4rem] md:text-[3.2rem] leading-[1.08] text-bg mb-6">
              Structured enough to hold you.<br /><em className="italic text-sand">Loose enough to breathe.</em>
            </h2>
            <p className="text-[16px] text-bg/70 leading-relaxed">
              This is the shape of a day, not a timetable to keep up with. Every session is an invitation, and the
              afternoons are deliberately, gloriously empty.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bg/15">
            {DAY_RHYTHM.map((slot) => (
              <li key={slot.title} className="bg-moss p-7 md:p-9 last:md:col-span-2">
                <span className="text-[9px] tracking-[0.2em] uppercase text-sand block mb-3">{slot.time}</span>
                <h3 className="font-serif text-[1.5rem] leading-tight text-bg mb-3">{slot.title}</h3>
                <p className="text-[15px] leading-relaxed text-bg/70">{slot.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className={`${EYEBROW} mb-6 block`}>What we actually do</span>
            <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg">
              Some of it is work. <em className="italic text-rust">Some of it is rest.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
            {ACTIVITIES.map((activity) => (
              <div key={activity.title} className="border-t border-line pt-5">
                <h3 className="font-serif text-[1.35rem] leading-tight text-fg mb-2">
                  {activity.title}
                  {activity.optional && (
                    <span className="ml-3 align-middle text-[9px] tracking-[0.2em] uppercase text-ink-subtle">Optional</span>
                  )}
                </h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">{activity.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The retreats + pricing */}
      <section id="retreat-options" className="py-20 md:py-28 px-6 md:px-12 border-t border-line scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className={`${EYEBROW} mb-6 block`}>The retreats</span>
            <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg mb-6">
              Three ways to come.
            </h2>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              Prices are per person and include everything except flights. A {gbp(DEPOSIT_GBP)} deposit secures your
              place, and the balance is due eight weeks before you travel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-line">
            {RETREATS.map((retreat) => (
              <article key={retreat.id} className="bg-bg p-8 md:p-10 flex flex-col" data-testid={`card-retreat-${retreat.id}`}>
                <div className="flex-1">
                  <h3 className="font-serif text-[1.75rem] leading-tight text-fg mb-3">{retreat.name}</h3>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle mb-6">
                    {retreat.nights} · {retreat.group}
                  </p>
                  <p className="text-[15px] leading-relaxed text-ink-muted mb-6">{retreat.summary}</p>
                  <p className="text-[15px] leading-relaxed text-fg mb-7 italic font-serif text-[1.05rem]">{retreat.forWhom}</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {retreat.highlights.map((line) => (
                      <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
                        <Check size={15} strokeWidth={1.5} className="text-moss shrink-0 mt-1" aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-6 border-t border-line">
                  <p className="font-serif text-[2.1rem] leading-none text-moss">{gbp(retreat.fromGbp)}</p>
                  <p className="text-[13px] text-ink-subtle mt-2 mb-6">
                    per person sharing
                    {retreat.singleGbp !== null && <> · {gbp(retreat.singleGbp)} single occupancy</>}
                  </p>
                  <button
                    className="w-full bg-moss text-bg px-6 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors"
                    onClick={() => openBooking('Retreat')}
                    data-testid={`button-retreat-${retreat.id}`}
                  >
                    Enquire about this retreat
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Included / not included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mt-16 md:mt-20">
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-moss font-medium mb-6">What is included</h3>
              <ul className="flex flex-col gap-4">
                {INCLUDED.map((line) => (
                  <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted border-b border-line pb-4">
                    <Check size={15} strokeWidth={1.5} className="text-moss shrink-0 mt-1" aria-hidden="true" />{line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-rust font-medium mb-6">What is not</h3>
              <ul className="flex flex-col gap-4">
                {NOT_INCLUDED.map((line) => (
                  <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted border-b border-line pb-4">
                    <Minus size={15} strokeWidth={1.5} className="text-rust shrink-0 mt-1" aria-hidden="true" />{line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to pay */}
      <section id="how-to-pay" className="py-20 md:py-28 px-6 md:px-12 border-t border-line scroll-mt-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16">

          <div className="min-w-0 md:col-span-5">
            <span className={`${EYEBROW} mb-6 block`}>How to pay</span>
            <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg mb-6">
              Nothing is taken until we have <em className="italic text-rust">confirmed a place.</em>
            </h2>
            <p className="text-[16px] text-ink-muted leading-relaxed mb-6 max-w-lg">
              Enquiring costs nothing and commits you to nothing. We reply first with dates, the total, and whether
              there is room. Only then is there anything to pay.
            </p>
            <p className="text-[15px] text-ink-subtle leading-relaxed max-w-lg">
              Card payments are handled by our payment provider on their own secure page. We never see or store your
              card details. The full position on deposits, balances and cancellation is in our{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-rust transition-colors">booking terms</Link>.
            </p>
          </div>

          <div className="min-w-0 md:col-span-7">
            <ol className="border-t border-line">
              <li className="py-7 border-b border-line">
                <span className="text-[9px] tracking-[0.2em] uppercase text-ink-subtle block mb-2">Step one</span>
                <h3 className="font-serif text-[1.4rem] text-fg mb-2">You enquire</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">Nothing is charged, and no card details are asked for.</p>
              </li>
              <li className="py-7 border-b border-line">
                <span className="text-[9px] tracking-[0.2em] uppercase text-ink-subtle block mb-2">Step two</span>
                <h3 className="font-serif text-[1.4rem] text-fg mb-2">We write back</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">With the dates, the total, and confirmation that there is a place for you.</p>
              </li>
              <li className="py-7 border-b border-line">
                <span className="text-[9px] tracking-[0.2em] uppercase text-ink-subtle block mb-2">Step three</span>
                <h3 className="font-serif text-[1.4rem] text-fg mb-2">{gbp(DEPOSIT_GBP)} secures it</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted mb-5">
                  Once your place is confirmed, the deposit holds it. It is non-refundable, because the house is held
                  from that moment.
                </p>
                {DEPOSIT_PAYMENT_LINK ? (
                  <a
                    href={DEPOSIT_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-moss text-bg px-7 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors"
                    data-testid="link-pay-deposit"
                  >
                    Pay the {gbp(DEPOSIT_GBP)} deposit <ArrowUpRight size={14} strokeWidth={1.5} />
                  </a>
                ) : (
                  <p className="text-[15px] leading-relaxed text-ink-subtle" data-testid="deposit-link-pending">
                    We send you a secure payment link once your place is confirmed.
                  </p>
                )}
              </li>
              <li className="py-7 border-b border-line">
                <span className="text-[9px] tracking-[0.2em] uppercase text-ink-subtle block mb-2">Step four</span>
                <h3 className="font-serif text-[1.4rem] text-fg mb-2">The balance, eight weeks before</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">
                  Bank transfer is welcome and keeps more of what you pay in the retreat rather than in card fees. If
                  paying in instalments would make this possible for you, ask. We would rather find a way.
                </p>
              </li>
            </ol>

            {FINANCIAL_PROTECTION && (
              <div className="mt-10 p-7 border border-moss/25 bg-moss/[0.04]" data-testid="financial-protection">
                <span className="text-[9px] tracking-[0.2em] uppercase text-moss block mb-3">Your money is protected</span>
                <p className="text-[15px] leading-relaxed text-ink-muted mb-4">{protectionStatement()}</p>
                <p className="text-[13px] leading-relaxed text-ink-subtle">
                  {FINANCIAL_PROTECTION.provider} · membership {FINANCIAL_PROTECTION.membershipNumber}
                  {FINANCIAL_PROTECTION.verifyUrl && (
                    <>
                      {' · '}
                      <a href={FINANCIAL_PROTECTION.verifyUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-rust transition-colors">
                        verify this
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}

            {BANK_TRANSFER && (
              <div className="mt-10 p-7 bg-[#EFEBE2]" data-testid="bank-transfer-details">
                <span className="text-[9px] tracking-[0.2em] uppercase text-moss block mb-4">Bank transfer</span>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
                  <div><dt className="text-ink-subtle text-[13px]">Account name</dt><dd className="text-fg">{BANK_TRANSFER.accountName}</dd></div>
                  <div><dt className="text-ink-subtle text-[13px]">Sort code</dt><dd className="text-fg">{BANK_TRANSFER.sortCode}</dd></div>
                  <div><dt className="text-ink-subtle text-[13px]">Account number</dt><dd className="text-fg">{BANK_TRANSFER.accountNumber}</dd></div>
                  <div><dt className="text-ink-subtle text-[13px]">Reference</dt><dd className="text-fg">{BANK_TRANSFER.reference}</dd></div>
                </dl>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Follow along */}
      {tiktoks.length > 0 && (
        <section className="py-20 md:py-28 px-6 md:px-12 border-t border-line">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16 items-center">

            <div className="min-w-0 md:col-span-6">
              <span className={`${EYEBROW} mb-6 block`}>Between retreats</span>
              <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg mb-6">
                Follow the days as they <em className="italic text-rust">happen.</em>
              </h2>
              <p className="text-[16px] text-ink-muted leading-relaxed max-w-lg mb-10">
                The mornings, the table, the teaching and the going-home faces all end up on TikTok. It is the closest
                thing to being there before you are.
              </p>

              <div className="flex flex-col gap-4 max-w-md">
                {tiktoks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-6 border border-line p-6 hover:border-moss hover:bg-[#F1EDE4] transition-colors group"
                    data-testid={`link-retreat-${social.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  >
                    <span className="flex items-center gap-4">
                      <SiTiktok aria-hidden="true" size={18} className="text-fg" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-fg">{social.label}</span>
                    </span>
                    <ArrowUpRight size={16} strokeWidth={1.5} className="text-ink-subtle group-hover:text-moss transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="min-w-0 md:col-span-6 flex md:justify-end">
              {FEATURED_TIKTOK && (
                <a
                  href={FEATURED_TIKTOK.url}
                  target="_blank"
                  rel="noreferrer"
                  className="tiktok-card group"
                  data-testid="link-featured-tiktok"
                >
                  <img src={featuredPoster} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                  <span className="tiktok-card-scrim" aria-hidden="true" />
                  <span className="tiktok-card-play" aria-hidden="true"><Play size={20} strokeWidth={1.5} /></span>
                  <span className="tiktok-card-body">
                    <span className="tiktok-card-kicker">
                      <SiTiktok aria-hidden="true" size={13} /> Watch on TikTok
                    </span>
                    <span className="tiktok-card-caption">{FEATURED_TIKTOK.caption}</span>
                  </span>
                </a>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Moments */}
      {(FILMS.length > 0 || GALLERY.length > 0) && (
        <section className="py-20 md:py-28 px-6 md:px-12 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12">
              <span className={`${EYEBROW} mb-6 block`}>Moments</span>
              <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg">
                From the retreats we have <em className="italic text-rust">already had.</em>
              </h2>
              {PAST_RETREATS.length > 0 && (
                <p className="mt-5 text-[10px] tracking-[0.2em] uppercase text-ink-subtle">
                  {PAST_RETREATS.map((r) => `${r.place} · ${r.year}`).join('  /  ')}
                </p>
              )}
            </div>

            {FILMS.length > 0 && (
              <div className="film-strip mb-14" data-testid="retreat-films">
                {FILMS.map((film) => (
                  <FilmCard key={film.file} film={film} />
                ))}
              </div>
            )}

            {GALLERY.length > 0 && (
              <div className="retreat-moments" data-testid="retreat-gallery">
                {GALLERY.map((photo) => (
                  <figure key={photo.file}>
                    <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-line">
        <div className="max-w-3xl mx-auto">
          <span className={`${EYEBROW} mb-6 block`}>Before you ask</span>
          <h2 className="text-[2.2rem] md:text-[2.9rem] leading-[1.1] text-fg mb-12">
            The questions women actually ask.
          </h2>
          <div className="border-t border-line">
            {FAQ.map((item) => {
              const open = openFaq === item.q;
              return (
                <div key={item.q} className="border-b border-line">
                  <h3>
                    <button
                      className="w-full flex justify-between items-start gap-6 py-6 text-left hover:text-rust transition-colors"
                      onClick={() => setOpenFaq(open ? null : item.q)}
                      aria-expanded={open}
                      data-testid={`faq-${item.q.slice(0, 14).toLowerCase().replace(/[^a-z]+/g, '-')}`}
                    >
                      <span className="font-serif text-[1.3rem] md:text-[1.5rem] leading-snug">{item.q}</span>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-ink-subtle shrink-0 mt-2">{open ? 'Close' : 'Read'}</span>
                    </button>
                  </h3>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="pb-7 text-[16px] leading-relaxed text-ink-muted max-w-2xl">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-line text-center">
        <div className="max-w-2xl mx-auto">
          {NEXT_RETREAT && (
            <span className={`${EYEBROW} mb-6 block`}>
              Next · {NEXT_RETREAT.place} {NEXT_RETREAT.year}
            </span>
          )}
          <h2 className="text-[2.2rem] md:text-[3rem] leading-[1.1] text-fg mb-6">
            Dates are shared with the list <em className="italic text-rust">first.</em>
          </h2>
          <p className="text-[16px] text-ink-muted leading-relaxed mb-10">
            Places are few and they tend to go to the women who already told us they were coming. Register your interest
            and we will write to you with the next dates before they go anywhere else.
          </p>
          <button className="bg-moss text-bg px-10 py-5 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Retreat')} data-testid="button-retreat-closing-book">
            Register your interest
          </button>
        </div>
      </section>

    </main>
  );
}
