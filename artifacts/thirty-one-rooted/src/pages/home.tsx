import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { ReflectionCompanion } from '@/components/reflection-companion';
import { useSiteChrome } from '@/components/site-chrome';
import { Link, useLocation } from 'wouter';

import { consumePendingSection, scrollToSection } from '@/lib/site-nav';

import sistersDailyBanner from '@assets/sisters-daily-terracotta.webp';
import mealArt from '@assets/meal-line-art-tonal.webp';
import founderPhotoSeated from '@assets/founder-portrait-seated.webp';
import founderPhotoConversational from '@assets/founder-portrait-conversational.webp';
import founderPhotoSmiling from '@assets/founder-portrait-smiling.webp';
import mealPhotoOne from '@assets/meal-packaging-food-01.webp';
import mealPhotoTwo from '@assets/meal-packaging-food-02.webp';
import retreatTea from '@assets/retreat-tea.webp';
import retreatPool from '@assets/retreat-pool.webp';
import retreatLounge from '@assets/retreat-lounge.webp';

/** Each doorway either opens the booking flow or moves to its own section. */
const experiences = [
  {
    title: 'The Retreat',
    text: 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.',
    action: 'Explore the next retreat',
    href: '/retreats' as const,
  },
  {
    title: 'The Conversations',
    text: 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.',
    action: 'Book a conversation',
    booking: 'Conversation' as const,
  },
  {
    title: '31 Sisters Daily',
    text: 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.',
    action: 'Visit 31 Sisters Daily',
    section: 'daily' as const,
  },
];

export default function Home() {
  const [mealOpen, setMealOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [aboutVisible, setAboutVisible] = useState(false);
  const { openBooking } = useSiteChrome();

  // A section link clicked from another page lands here; scroll once mounted.
  useEffect(() => {
    const pending = consumePendingSection();
    if (pending) {
      requestAnimationFrame(() => scrollToSection(pending));
    }
  }, []);

  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (!aboutSection || !('IntersectionObserver' in window)) {
      setAboutVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setAboutVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.22 });

    observer.observe(aboutSection);
    return () => observer.disconnect();
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center relative">
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-8 block font-medium">A digital home for becoming</span>
          <h1 className="text-[3.4rem] md:text-[6rem] leading-[1.02] text-moss mb-10 tracking-[-0.015em]">
            Come back to <em className="italic text-rust pr-2">yourself.</em><br className="hidden md:block" />Come closer to Christ.
          </h1>
          <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto font-light leading-relaxed mb-12">
            A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools, biblical truth, room to breathe.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => scrollToSection('retreats')} data-testid="button-hero-retreats">Find your retreat</button>
            <button className="py-2 text-[10px] tracking-[0.2em] uppercase border-b border-line hover:border-rust hover:text-rust transition-colors" onClick={() => scrollToSection('tools')} data-testid="button-hero-reflection">Begin a reflection</button>
          </div>
        </div>
      </section>

      {/* Big Artwork */}
      <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto">
        <div className="artwork-collage w-full">
          <img src={sistersDailyBanner} alt="31 Sisters Daily" className="sisters-daily-banner" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-line">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-8 lg:gap-x-16 items-center">
          <div className="min-w-0 md:col-span-5 relative order-2 md:order-1">
            <div className={`founder-photo-composition ${aboutVisible ? 'is-visible' : ''}`}>
              <figure className="founder-photo founder-photo-primary">
                <img src={founderPhotoSeated} alt="Tapiwanashe Grace Pereira, founder of 31 and Rooted" loading="lazy" decoding="async" />
              </figure>
              <div className="founder-photo-support-row">
                <figure className="founder-photo founder-photo-secondary">
                  <img src={founderPhotoConversational} alt="Tapiwanashe Grace Pereira smiling" loading="lazy" decoding="async" />
                </figure>
                <figure className="founder-photo founder-photo-tertiary">
                  <img src={founderPhotoSmiling} alt="Tapiwanashe Grace in a white top" loading="lazy" decoding="async" />
                </figure>
              </div>
            </div>
            <div className="founder-photo-caption">
              <span>Tapiwanashe Grace Pereira</span>
              <span>Founder, 31 &amp; Rooted</span>
            </div>
          </div>
          <div className="min-w-0 md:col-span-7 order-1 md:order-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">About 31 and Rooted</span>
            <h2 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
              A digital home for <em className="italic text-rust">becoming.</em>
            </h2>
            <div className="about-copy max-w-xl text-[16px] leading-relaxed text-ink-muted">
              <p>
                31 &amp; Rooted is a community of women seeking the heart of God and walking together through formation into Christlikeness.
              </p>
              <p>
                Founded by Tapiwanashe Grace, it is a place for women to lay down their burdens, encounter God, and learn to live freely in Yeshua.
              </p>
              <p>
                It holds two invitations: <strong className="font-normal text-fg">31 &amp; Rooted Retreats</strong>, where women step away from the noise, become still, and allow God to tend to the deeper places within us; and <strong className="font-normal text-fg">31 Sisters Daily</strong>, which carries teaching, fellowship, discipleship and practical meal support into ordinary weeks.
              </p>
              <p>
                We believe we are not women who have arrived, but women who are continually being formed, becoming more rooted in Christ and flourishing from that place.
              </p>
            </div>
            <div className="mt-10">
              <p className="font-serif italic text-2xl md:text-3xl text-moss max-w-xl">Rooted. Becoming. Flourishing.</p>
              <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-ink-subtle">A ministry founded by Tapiwanashe Grace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formation Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-8 lg:gap-x-16 items-center">
          <div className="min-w-0 md:col-span-5 relative order-2 md:order-1">
            <div className="aspect-[3/4] w-full max-w-sm mx-auto story-line-art">
              <img src={mealArt} alt="" aria-hidden="true" className="w-full h-full object-contain brand-line-art" />
            </div>
          </div>
          <div className="min-w-0 md:col-span-7 order-1 md:order-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">You do not have to rush this</span>
            <h2 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
              Formation is not a finish line.<br className="hidden xl:block" />It is a way of <em className="italic text-rust">walking.</em>
            </h2>
            <p className="text-[16px] leading-relaxed text-ink-muted mb-10 max-w-xl">
              31&amp;Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.
            </p>
            <blockquote className="border-l border-rust pl-6 md:pl-8 py-2">
              <p className="font-serif italic text-2xl md:text-3xl text-moss mb-4">
                &ldquo;A place to seek God&apos;s heart. Let&apos;s walk through formation into Christlikeness together.&rdquo;
              </p>
              <footer className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle">- the heart of 31 &amp; Rooted</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="retreats" className="py-24 md:py-32 px-6 md:px-12 bg-moss text-bg">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-8 lg:gap-x-16">
          <div className="min-w-0 md:col-span-5 md:sticky md:top-36 h-fit">
            <span className="text-[10px] tracking-[0.2em] uppercase text-sand mb-6 block font-medium">Choose your doorway</span>
            <h2 className="text-[3rem] md:text-[3.9rem] leading-[1.08] mb-8 text-bg">Start where<br/>you <em className="italic text-sand">are.</em></h2>
            <p className="text-[16px] text-bg/70 mb-12 leading-relaxed max-w-sm">
              Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.
            </p>
            <Link href="/retreats" className="inline-block py-2 text-[10px] tracking-[0.2em] uppercase border-b border-bg/30 hover:border-sand hover:text-sand transition-colors text-bg" data-testid="link-experience-retreats">
              See the retreats
            </Link>
            <div className="retreat-photo-grid" aria-label="Retreat setting photography">
              <figure className="retreat-photo retreat-photo-pool">
                <img src={retreatPool} alt="The retreat house beside the pool" loading="lazy" decoding="async" />
              </figure>
              <figure className="retreat-photo retreat-photo-tea">
                <img src={retreatTea} alt="An outdoor table set for tea at the retreat" loading="lazy" decoding="async" />
              </figure>
              <figure className="retreat-photo retreat-photo-lounge">
                <img src={retreatLounge} alt="A welcoming sitting area at the retreat" loading="lazy" decoding="async" />
              </figure>
            </div>
          </div>

          <div className="min-w-0 md:col-span-7 flex flex-col">
            {experiences.map((experience, index) => (
              <button
                key={experience.title}
                className="text-left group flex flex-col py-12 md:py-14 border-t border-bg/20 last:border-b transition-colors px-0 md:px-6 md:-mx-6 hover:bg-bg/5"
                onClick={() => {
                  if (experience.href) setLocation(experience.href);
                  else if (experience.booking) openBooking(experience.booking);
                  else if (experience.section) scrollToSection(experience.section);
                }}
                data-testid={`button-experience-${index + 1}`}
              >
                <span className="text-sand text-[10px] tracking-[0.2em] uppercase mb-4 block">0{index + 1}</span>
                <h3 className="font-serif text-3xl md:text-4xl mb-4 text-bg group-hover:text-sand transition-colors">{experience.title}</h3>
                <p className="text-bg/60 text-[16px] leading-relaxed mb-8 max-w-md">{experience.text}</p>
                <span className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 text-bg">
                  {experience.action} <ArrowRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto border-b border-line">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">Practical tools for the becoming</span>
          <h2 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
            Not just inspiration.<br/><em className="italic text-rust">Something to do</em> with what you know.
          </h2>
          <p className="text-[16px] text-ink-muted leading-relaxed">
            Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practise a truer one.
          </p>
        </div>

        <ReflectionCompanion openBooking={openBooking} />
      </section>

      {/* The Daily Section */}
      <section id="daily" className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-8 lg:gap-x-16 items-center">
        <div className="min-w-0 md:col-span-5 order-2 md:order-1 flex justify-center">
          <div className="meal-photo-composition" aria-label="Meal Packaging photography">
            <figure className="meal-photo meal-photo-primary">
              <img src={mealPhotoOne} alt="A nourishing prepared meal served with vegetables and potatoes" loading="lazy" decoding="async" />
            </figure>
            <figure className="meal-photo meal-photo-secondary">
              <img src={mealPhotoTwo} alt="A nourishing fish meal served at a shared table" loading="lazy" decoding="async" />
            </figure>
            <div className="meal-photo-mark" aria-hidden="true">
              <span>31</span>
              <i>Sisters Daily</i>
            </div>
          </div>
        </div>

        <div className="min-w-0 md:col-span-7 order-1 md:order-2 daily-writing">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">31 Sisters Daily · a paid meal support programme</span>
          <h2 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
            A little nourishment for the <em className="italic text-rust">middle</em> of the day.
          </h2>
          <p className="text-[16px] text-ink-muted mb-12 leading-relaxed max-w-lg">
            Meal Packaging is a practical meal delivery programme from 31 Sisters Daily, created for people who need a little help getting a nourishing meal to the table. Like Meals on Wheels, each package is prepared with care and offered as a paid service.
          </p>

          <div className="mb-12">
            <div className="flex justify-between items-center py-4 border-b border-line text-[10px] tracking-[0.2em] uppercase font-medium">
              <span>Paid meal programme</span>
              <span className="text-rust">Cost per meal</span>
            </div>

            <button className="w-full flex justify-between items-center py-6 text-left hover:text-rust transition-colors group" onClick={() => setMealOpen((open) => !open)} aria-expanded={mealOpen} data-testid="button-meal-explain">
              <span className="font-serif text-2xl md:text-3xl pr-4">How does the meal programme work?</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle group-hover:text-rust transition-colors flex-shrink-0">{mealOpen ? 'Close' : 'Read'}</span>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mealOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="pb-8 text-[16px] text-ink-muted leading-relaxed max-w-xl">
                We prepare nourishing meals, package them for safe delivery, and coordinate a delivery day that works for the recipient. The cost is based on the number of meals and delivery needs, so we confirm the per-meal price when you enquire. This is a paid programme, not a free meal service.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Meal Packaging')} data-testid="button-meal-enquire">Enquire about the meal programmeme</button>
            <a className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 text-ink-muted border-b border-line pb-1 hover:border-rust hover:text-rust transition-colors" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" data-testid="link-tiktok-daily">Follow 31 Sisters Daily <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

    </main>
  );
}
