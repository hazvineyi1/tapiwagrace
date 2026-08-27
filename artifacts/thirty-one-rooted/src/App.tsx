import React, { type FormEvent, type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Menu, X, MoveRight } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import sistersDailyBanner from '@assets/sisters-daily-terracotta.webp';
import mealArt from '@assets/meal-line-art-tonal.png';
import founderPhotoSeated from '@assets/founder-portrait-seated.webp';
import founderPhotoConversational from '@assets/founder-portrait-conversational.webp';
import mealPhotoOne from '@assets/meal-packaging-food-01.webp';
import mealPhotoTwo from '@assets/meal-packaging-food-02.webp';
import retreatTea from '@assets/retreat-tea.webp';
import retreatPool from '@assets/retreat-pool.webp';
import retreatLounge from '@assets/retreat-lounge.webp';
import { SocraticCompanion } from '@/components/SocraticCompanion';

const queryClient = new QueryClient();

const experiences = [
  { title: 'The Retreat', text: 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.', action: 'Explore the next retreat' },
  { title: 'The Conversations', text: 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.', action: 'Book a conversation' },
  { title: '31 Sisters Daily', text: 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.', action: 'Visit 31 Sisters Daily' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('Retreat');
  const [toast, setToast] = useState('');
  const [mealOpen, setMealOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const openBooking = (service = 'Retreat') => {
    setBookingOpen(true);
    setBookingService(service);
  };
  const closeMenu = () => setMenuOpen(false);

  const scrollTo = (id: string) => {
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      notify('Add your email so we know where to send the next note.');
      return;
    }
    setEmail('');
    notify('You are on the list. A note for the becoming will find you soon.');
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col relative overflow-hidden font-sans">
      
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 h-24 px-6 md:px-12 flex items-center justify-between z-50 transition-all duration-300 ${scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-line' : 'bg-transparent'}`}>
        <a href="#top" className="flex items-center gap-4 group" data-testid="link-home" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); }}>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium text-rust">31 & Rooted</span>
        </a>
        
        <nav className={`fixed inset-0 bg-bg flex flex-col justify-center items-center gap-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:static md:bg-transparent md:flex-row md:justify-end md:gap-8 md:transform-none ${menuOpen ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`} aria-label="Main navigation">
          <button className="md:hidden absolute top-8 right-6 text-fg/50 hover:text-rust transition-colors" onClick={closeMenu} aria-label="Close menu"><X size={24} strokeWidth={1.5} /></button>
          
          <button className="text-[13px] md:text-[10px] tracking-[0.2em] uppercase text-fg hover:text-rust transition-colors" onClick={() => scrollTo('retreats')} data-testid="button-nav-retreats">Retreats</button>
          <button className="text-[13px] md:text-[10px] tracking-[0.2em] uppercase text-fg hover:text-rust transition-colors" onClick={() => scrollTo('about')} data-testid="button-nav-about">About</button>
          <button className="text-[13px] md:text-[10px] tracking-[0.2em] uppercase text-fg hover:text-rust transition-colors" onClick={() => scrollTo('tools')} data-testid="button-nav-tools">Tools</button>
          <button className="text-[13px] md:text-[10px] tracking-[0.2em] uppercase text-fg hover:text-rust transition-colors" onClick={() => scrollTo('daily')} data-testid="button-nav-daily">31 Sisters Daily</button>
          <button className="mt-8 md:mt-0 text-[11px] md:text-[10px] tracking-[0.2em] uppercase bg-moss text-bg px-8 md:px-6 py-4 md:py-3 hover:bg-fg transition-colors" onClick={() => openBooking()} data-testid="button-nav-book">Book a space</button>
        </nav>
        
        <button className="md:hidden text-fg" onClick={() => setMenuOpen(true)} aria-label="Open navigation" data-testid="button-menu">
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </header>

      <main id="top" className="flex-1">
        
        {/* Hero Section */}
        <section className="pt-48 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center relative">
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-8 block font-medium">A digital home for becoming</span>
            <h1 className="text-5xl md:text-[6.5rem] leading-[0.95] text-moss mb-10 tracking-tight">
              Come back to <em className="italic text-rust pr-2">yourself.</em><br className="hidden md:block" />Come closer to Christ.
            </h1>
            <p className="text-lg md:text-xl text-fg/70 max-w-2xl mx-auto font-light leading-relaxed mb-12">
              A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools, biblical truth, room to breathe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => scrollTo('retreats')} data-testid="button-hero-retreats">Find your retreat</button>
              <button className="text-[10px] tracking-[0.2em] uppercase border-b border-line pb-1 hover:border-rust hover:text-rust transition-colors" onClick={() => scrollTo('tools')} data-testid="button-hero-reflection">Begin a reflection</button>
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-center">
            <div className="md:col-span-5 relative order-2 md:order-1">
              <div className="founder-photo-composition">
                <figure className="founder-photo founder-photo-primary">
                  <img src={founderPhotoSeated} alt="Tapiwanashe Grace Pereira, founder of 31 and Rooted" loading="lazy" decoding="async" />
                  <figcaption>
                    <span>Tapiwanashe Grace Pereira</span>
                    <span>Founder, 31 and Rooted</span>
                  </figcaption>
                </figure>
                <figure className="founder-photo founder-photo-secondary">
                  <img src={founderPhotoConversational} alt="Tapiwanashe Grace Pereira smiling" loading="lazy" decoding="async" />
                </figure>
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">About 31 and Rooted</span>
              <h2 className="text-4xl md:text-[3.25rem] leading-[1.05] text-fg mb-8">
                A digital home for <em className="italic text-rust">becoming.</em>
              </h2>
              <div className="about-copy max-w-xl text-[16px] leading-relaxed text-fg/70">
                <p>
                  31 Sisters Daily is a community of women seeking the heart of God and walking together through formation into Christlikeness.
                </p>
                <p>
                  Founded by Tapiwanashe Grace, it is a place for women to lay down their burdens, encounter God, and learn to live freely in Yeshua.
                </p>
                <p>
                  Through teaching, fellowship, discipleship, and 31 &amp; Rooted Retreats, we create intentional spaces for women to step away from the noise, become still, and allow God to tend to the deeper places within us.
                </p>
                <p>
                  We believe we are not women who have arrived, but women who are continually being formed, becoming more rooted in Christ and flourishing from that place.
                </p>
              </div>
              <div className="mt-10">
                <p className="font-serif italic text-2xl md:text-3xl text-moss max-w-xl">Rooted. Becoming. Flourishing.</p>
                <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-fg/50">A ministry founded by Tapiwanashe Grace.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Section */}
        <section className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-center">
            <div className="md:col-span-5 relative order-2 md:order-1">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto story-line-art">
                <img src={mealArt} alt="" aria-hidden="true" className="w-full h-full object-contain brand-line-art" />
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">You do not have to rush this</span>
              <h2 className="text-4xl md:text-[3.25rem] leading-[1.05] text-fg mb-8">
                Formation is not a finish line.<br className="hidden xl:block" />It is a way of <em className="italic text-rust">walking.</em>
              </h2>
              <p className="text-[16px] leading-relaxed text-fg/70 mb-10 max-w-xl">
                31&Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.
              </p>
              <blockquote className="border-l border-rust pl-6 md:pl-8 py-2">
                <p className="font-serif italic text-2xl md:text-3xl text-moss mb-4">
                  &ldquo;A place to seek God&apos;s heart. Let&apos;s walk through formation into Christlikeness together.&rdquo;
                </p>
                <footer className="text-[9px] tracking-[0.2em] uppercase text-fg/50">- the heart of 31 Sisters Daily</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="retreats" className="py-24 md:py-32 px-6 md:px-12 bg-moss text-bg">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
            <div className="md:col-span-5 md:sticky md:top-36 h-fit">
              <span className="text-[10px] tracking-[0.2em] uppercase text-sand mb-6 block font-medium">Choose your doorway</span>
              <h2 className="text-5xl md:text-6xl leading-[1.05] mb-8 font-serif text-bg">Start where<br/>you <em className="italic text-sand">are.</em></h2>
              <p className="text-[16px] text-bg/70 mb-12 font-light leading-relaxed max-w-sm">
                Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.
              </p>
              <button className="text-[10px] tracking-[0.2em] uppercase border-b border-bg/30 pb-1 hover:border-sand hover:text-sand transition-colors text-bg" onClick={() => openBooking()} data-testid="button-experience-book">
                See retreat dates
              </button>
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
            
            <div className="md:col-span-7 flex flex-col">
              {experiences.map((experience, index) => (
                <button 
                  key={experience.title}
                  className="text-left group flex flex-col py-12 md:py-14 border-t border-bg/20 last:border-b transition-colors px-0 md:px-6 md:-mx-6 hover:bg-bg/5"
                  onClick={() => index === 0 ? openBooking() : notify(`${experience.title} is opening soon. Stay close.`)} 
                  data-testid={`button-experience-${index + 1}`}
                >
                  <span className="text-sand text-[10px] tracking-[0.2em] uppercase mb-4 block">0{index + 1}</span>
                  <h3 className="font-serif text-3xl md:text-4xl mb-4 text-bg group-hover:text-sand transition-colors">{experience.title}</h3>
                  <p className="text-bg/60 text-[16px] leading-relaxed mb-8 max-w-md">{experience.text}</p>
                  <span className="text-[9px] tracking-[0.2em] uppercase flex items-center gap-3 text-bg">
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
            <h2 className="text-4xl md:text-[3.25rem] leading-[1.05] text-fg mb-8">
              Not just inspiration.<br/><em className="italic text-rust">Something to do</em> with what you know.
            </h2>
            <p className="text-[16px] text-fg/70 leading-relaxed">
              Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.
            </p>
          </div>
          
          <SocraticCompanion openBooking={openBooking} />
        </section>

        {/* The Daily Section */}
        <section id="daily" className="py-24 md:py-32 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-center">
          <div className="md:col-span-5 order-2 md:order-1 flex justify-center">
            <div className="meal-photo-composition" aria-label="Meal Packaging photography">
              <figure className="meal-photo meal-photo-primary">
                <img src={mealPhotoOne} alt="A nourishing prepared meal served with vegetables and potatoes" loading="lazy" decoding="async" />
                <figcaption>Prepared with care</figcaption>
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
          
          <div className="md:col-span-7 order-1 md:order-2 daily-writing">
             <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">31 Sisters Daily · a paid meal support program</span>
            <h2 className="text-4xl md:text-[3.25rem] leading-[1.05] text-fg mb-8">
              A little nourishment for the <em className="italic text-rust">middle</em> of the day.
            </h2>
            <p className="text-[16px] text-fg/70 mb-12 leading-relaxed max-w-lg">
               Meal Packaging is a practical meal delivery program from 31 Sisters Daily, created for people who need a little help getting a nourishing meal to the table. Like Meals on Wheels, each package is prepared with care and offered as a paid service.
            </p>
            
            <div className="mb-12">
              <div className="flex justify-between items-center py-4 border-b border-line text-[10px] tracking-[0.2em] uppercase font-medium">
                 <span>Paid meal program</span>
                 <span className="text-rust">Cost per meal</span>
              </div>
              
              <button className="w-full flex justify-between items-center py-6 text-left hover:text-rust transition-colors group" onClick={() => setMealOpen((open) => !open)}>
                 <span className="font-serif text-2xl md:text-3xl pr-4">How does the meal program work?</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-fg/50 group-hover:text-rust transition-colors flex-shrink-0">{mealOpen ? 'Close' : 'Read'}</span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${mealOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="pb-8 text-[16px] text-fg/70 leading-relaxed max-w-xl">
                   We prepare nourishing meals, package them for safe delivery, and coordinate a delivery day that works for the recipient. The cost is based on the number of meals and delivery needs, so we confirm the per-meal price when you enquire. This is a paid program, not a free meal service.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8">
               <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Meal Packaging')} data-testid="button-meal-enquire">Enquire about the meal program</button>
              <a className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 text-fg/70 border-b border-line pb-1 hover:border-rust hover:text-rust transition-colors" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" data-testid="link-tiktok-daily">Follow 31 Sisters Daily <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-fg text-bg pt-24 pb-12 px-6 md:px-12 border-t border-line">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-20 border-b border-bg/10">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-sand mb-6 block font-medium">The next faithful step</span>
              <h2 className="text-4xl md:text-5xl leading-tight font-serif">Come as you are.<br/><em className="italic text-sand">Stay for the becoming.</em></h2>
            </div>
            
            <div className="flex flex-col justify-end">
              <form className="flex items-end gap-4 w-full" onSubmit={handleNewsletter}>
                <div className="flex-1">
                  <label htmlFor="email" className="block text-[9px] uppercase tracking-[0.2em] text-bg/50 mb-4">A note for the woman becoming</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                    placeholder="your@email.com" 
                    className="w-full bg-transparent border-0 border-b border-bg/20 py-3 text-base text-bg focus:outline-none focus:border-sand transition-colors placeholder:text-bg/30 rounded-none"
                    data-testid="input-newsletter-email" 
                  />
                </div>
                <button type="submit" className="w-12 h-12 flex items-center justify-center bg-bg text-fg hover:bg-sand transition-colors" aria-label="Join the 31 and Rooted list" data-testid="button-newsletter-submit">
                  <MoveRight size={16} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-[9px] tracking-[0.2em] uppercase text-bg/50">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <span>31 & Rooted · 31 Sisters Daily</span>
              <span>Rooted. Becoming. Flourishing.</span>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <a href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" className="hover:text-sand transition-colors">TikTok Daily</a>
              <a href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer" className="hover:text-sand transition-colors">TikTok Rooted</a>
              <button onClick={() => openBooking()} className="hover:text-sand transition-colors text-left" data-testid="button-footer-book">Book a space</button>
            </div>
          </div>
        </div>
      </footer>

      {bookingOpen && <BookingModal initialKind={bookingService} onClose={() => setBookingOpen(false)} onNotify={notify} />}
      {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function BookingModal({ initialKind, onClose, onNotify }: { initialKind: string; onClose: () => void; onNotify: (message: string) => void }) {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState(initialKind);
  const [date, setDate] = useState('Saturday, 14 March 2026');
  const [time, setTime] = useState('10:30 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [complete, setComplete] = useState(false);

  const proceed = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (!name.trim() || !email.trim()) {
      onNotify('Add your name and email so we can hold your place.');
      return;
    }
    setComplete(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-fg/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="bg-bg text-fg w-full max-w-xl p-8 md:p-14 relative max-h-[90vh] overflow-y-auto shadow-2xl modal-animate" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="dialog-booking">
        <button className="absolute top-6 right-6 p-2 text-fg/40 hover:text-rust transition-colors" onClick={onClose} aria-label="Close booking" data-testid="button-booking-close"><X size={20} strokeWidth={1.5} /></button>
        
        <div className="mb-10">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust block mb-4 font-medium">Make room for this</span>
          <h2 id="booking-title" className="font-serif text-3xl md:text-4xl text-fg">
            {complete ? (kind === 'Meal Packaging' ? 'Your meal enquiry is on its way.' : 'Your place is held.') : (kind === 'Meal Packaging' ? 'Enquire about the meal program' : 'Book a space')}
          </h2>
        </div>
        
        {!complete ? (
          <>
            <div className="flex gap-2 mb-10" aria-label={`Booking step ${step} of 3`}>
              {[1, 2, 3].map((number) => (
                <span key={number} className={`h-[1px] flex-1 ${number <= step ? 'bg-moss h-[2px]' : 'bg-line'}`} />
              ))}
            </div>
            
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-fg/60 block mb-4">What are you making room for?</span>
                  <select value={kind} onChange={(event) => setKind(event.target.value)} className="w-full bg-transparent border-0 border-b border-line py-4 text-xl font-serif text-fg focus:ring-0 focus:border-moss transition-colors" data-testid="select-booking-kind">
                    <option value="Retreat">Retreat · Pricing varies</option>
                    <option value="Conversation">Conversation · $95</option>
                    <option value="Meal Packaging">Meal Packaging · paid program</option>
                  </select>
                </label>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8 border-y border-line">
                  <span className="text-[14px] text-fg/70 max-w-[280px] leading-relaxed">
                    {kind === 'Meal Packaging' ? 'Nourishing meals prepared and coordinated for delivery. Cost depends on meal count and delivery needs.' : kind === 'Retreat' ? 'Details shared after enquiry. Includes a confirmation and preparation guide.' : 'Includes a confirmation, preparation guide, and a space held with care.'}
                  </span>
                  <strong className="font-serif text-3xl font-normal text-moss">
                    {kind === 'Retreat' ? 'Pricing varies' : kind === 'Conversation' ? '$95' : 'Cost per meal'}
                  </strong>
                </div>
                
                <p className="text-[14px] text-fg/50 leading-relaxed font-light">
                  {kind === 'Meal Packaging' ? 'Tell us how many meals are needed, who they are for, and where delivery may be needed. We will follow up with availability and the paid per-meal cost.' : 'The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.'}
                </p>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-fg/60 block mb-4">{kind === 'Meal Packaging' ? 'Preferred delivery date' : 'Choose a date'}</span>
                  <select value={date} onChange={(event) => setDate(event.target.value)} className="w-full bg-transparent border-0 border-b border-line py-4 text-xl font-serif text-fg focus:ring-0 focus:border-moss transition-colors" data-testid="select-booking-date">
                    <option>Saturday, 14 March 2026</option>
                    <option>Saturday, 11 April 2026</option>
                    <option>Saturday, 09 May 2026</option>
                  </select>
                </label>
                
                <div className="block mt-8">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-fg/60 block mb-4">{kind === 'Meal Packaging' ? 'Preferred delivery window' : 'Choose a time'}</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'].map((slot) => (
                      <button 
                        key={slot}
                        className={`py-3 px-2 border text-[13px] transition-colors ${time === slot ? 'border-moss bg-moss text-bg' : 'border-line text-fg hover:border-moss/50'}`}
                        onClick={() => setTime(slot)}
                        data-testid={`button-time-${slot.replace(/[: ]/g, '-').toLowerCase()}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-fg/60 block mb-4">Your name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Doe" className="w-full bg-transparent border-0 border-b border-line py-3 text-lg font-serif text-fg focus:ring-0 focus:border-moss transition-colors placeholder:text-fg/30 placeholder:font-sans placeholder:text-[15px]" data-testid="input-booking-name" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-fg/60 block mb-4">Email address</span>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@example.com" className="w-full bg-transparent border-0 border-b border-line py-3 text-lg font-serif text-fg focus:ring-0 focus:border-moss transition-colors placeholder:text-fg/30 placeholder:font-sans placeholder:text-[15px]" data-testid="input-booking-email" />
                  </label>
                </div>
                
                <div className="bg-[#EAE6DE]/50 p-6 text-[14px] text-fg/80 leading-relaxed border border-line">
                  <strong className="text-moss uppercase text-[10px] tracking-[0.2em] block mb-3 font-medium">{kind}</strong>
                  {date} · {time}<br/><br/>
                  {kind === 'Meal Packaging' ? 'We will use this as a starting point for your meal program enquiry. We will confirm availability, delivery details, and the per-meal cost before anything is scheduled.' : 'We\'ll send a warm confirmation and the details you need next.'}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-line">
              {step > 1 ? (
                <button className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 text-fg/50 hover:text-rust transition-colors" onClick={() => setStep((current) => current - 1)} data-testid="button-booking-back">
                  <ChevronLeft size={14} strokeWidth={1.5} /> Back
                </button>
              ) : <span />}
              <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={proceed} data-testid="button-booking-next">
                {step === 3 ? (kind === 'Meal Packaging' ? 'Send enquiry' : 'Hold my place') : 'Continue'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-moss text-bg mx-auto flex items-center justify-center mb-8">
              <Check size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-3xl mb-6 text-fg">
              {kind === 'Meal Packaging' ? 'We will be in touch about your meals.' : `${name.split(' ')[0] || 'Your'} next step is held.`}
            </h3>
            <p className="text-[15px] text-fg/70 leading-relaxed max-w-sm mx-auto mb-10">
              {kind === 'Meal Packaging' ? `Look for a reply at ${email}. We will follow up with availability, delivery details, and the paid per-meal cost.` : `Look for a confirmation at ${email}. Until then, let the question stay with you: what are you making room for?`}
            </p>
            <button className="text-[10px] tracking-[0.2em] uppercase border-b border-line pb-1 hover:border-moss hover:text-moss transition-colors text-fg/70" onClick={onClose} data-testid="button-booking-done">Return home</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
