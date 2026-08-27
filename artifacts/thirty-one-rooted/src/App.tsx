import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Menu, X, MoveRight } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import sistersLogo from '@assets/WhatsApp_Image_2026-08-27_at_12.12.09_PM_1787849508863.jpeg';
import { SocraticCompanion } from '@/components/SocraticCompanion';

const queryClient = new QueryClient();

const experiences = [
  { title: 'The Retreat', text: 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.', action: 'Explore the next retreat' },
  { title: 'The Conversations', text: 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.', action: 'Book a conversation' },
  { title: 'The Daily', text: 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.', action: 'Visit 31 Sisters Daily' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('Retreat');
  const [toast, setToast] = useState('');
  const [mealOpen, setMealOpen] = useState(false);
  const [email, setEmail] = useState('');

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
    <div className="min-h-screen bg-[var(--ivory)] text-[var(--espresso)] font-body flex flex-col relative overflow-hidden">
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 h-24 px-6 md:px-12 flex items-center justify-between z-50 mix-blend-difference text-[#F3F1EC]">
        <a href="#top" className="flex items-center gap-4 group" data-testid="link-home">
          <div className="w-10 h-10 overflow-hidden rounded-full border border-[#F3F1EC]/30">
            <img src={sistersLogo} alt="31 Sisters Daily" className="w-full h-full object-cover filter sepia-[0.3]" data-testid="img-brand-logo" />
          </div>
          <span className="flex flex-col">
            <span className="font-sans text-xs tracking-[0.2em] uppercase font-medium">31 & Rooted</span>
          </span>
        </a>
        
        <nav className={`fixed inset-0 bg-[var(--espresso)] text-[var(--ivory)] flex flex-col justify-center items-center gap-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:static md:bg-transparent md:flex-row md:justify-end md:transform-none ${menuOpen ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`} aria-label="Main navigation">
          <button className="text-sm tracking-[0.15em] uppercase hover:text-[var(--gold)] transition-colors md:hidden absolute top-8 right-6" onClick={closeMenu} aria-label="Close menu"><X size={28} /></button>
          
          <button className="text-sm tracking-[0.15em] uppercase hover:text-[var(--gold)] transition-colors md:text-xs" onClick={() => scrollTo('retreats')} data-testid="button-nav-retreats">Retreats</button>
          <button className="text-sm tracking-[0.15em] uppercase hover:text-[var(--gold)] transition-colors md:text-xs" onClick={() => scrollTo('tools')} data-testid="button-nav-tools">Tools</button>
          <button className="text-sm tracking-[0.15em] uppercase hover:text-[var(--gold)] transition-colors md:text-xs" onClick={() => scrollTo('daily')} data-testid="button-nav-daily">The Daily</button>
          <button className="mt-8 md:mt-0 text-xs tracking-[0.15em] uppercase border border-current px-6 py-3 hover:bg-[var(--ivory)] hover:text-[var(--espresso)] transition-colors" onClick={() => openBooking()} data-testid="button-nav-book">Book a space</button>
        </nav>
        
        <button className="md:hidden text-[#F3F1EC]" onClick={() => setMenuOpen(true)} aria-label="Open navigation" data-testid="button-menu">
          <Menu size={28} />
        </button>
      </header>

      <main id="top" className="flex-1">
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-24 px-6 md:px-12 bg-[var(--espresso)] text-[var(--ivory)] overflow-hidden">
          {/* Subtle tactile accent in the background */}
          <div className="absolute top-0 right-0 w-3/4 md:w-1/2 h-full opacity-20 pointer-events-none">
            <img src={sistersLogo} alt="" className="w-full h-full object-cover mix-blend-overlay filter sepia-[0.5] contrast-150" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--espresso)]" />
          </div>

          <div className="relative z-10 max-w-4xl reveal">
            <span className="eyebrow text-[var(--gold)] mb-8">A digital home for becoming</span>
            <h1 className="display-title mt-4 mb-8">Come back to <em>yourself.</em><br />Come closer to Christ.</h1>
            <p className="text-lg md:text-xl text-[var(--sand)] max-w-2xl font-light leading-relaxed mb-12">
              A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools. Biblical truth. Room to breathe.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="btn-primary inverse" onClick={() => scrollTo('retreats')} data-testid="button-hero-retreats">Find your retreat <ArrowRight size={15} /></button>
              <button className="btn-quiet inverse" onClick={() => scrollTo('tools')} data-testid="button-hero-reflection">Begin a reflection</button>
            </div>
            
            <div className="mt-16 md:mt-24 pt-8 border-t border-[var(--line-light)] flex gap-4 md:gap-12 items-center text-sm text-[var(--sand)] font-light tracking-wide uppercase">
              <span>Rooted in truth</span>
              <span className="hidden md:inline text-[var(--gold)]">✦</span>
              <span>Made for real life</span>
              <span className="hidden md:inline text-[var(--gold)]">✦</span>
              <span>Formed in Christ</span>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section bg-[var(--ivory)] px-6 md:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-center">
            <div className="md:col-span-5 relative">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-t-full border-b border-[var(--line-dark)]">
                <img src={sistersLogo} alt="Tactile texture" className="w-full h-full object-cover filter sepia-[0.2]" />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="eyebrow text-[var(--rust)]">You do not have to rush this</span>
              <h2 className="section-title mt-6 mb-8 text-[var(--espresso)]">Formation is not a finish line. It is a way of <em className="text-[var(--rust)]">walking.</em></h2>
              <p className="text-[17px] leading-relaxed text-[var(--espresso)]/70 max-w-xl mb-8">
                31&Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.
              </p>
              <blockquote className="border-l border-[var(--rust)] pl-6 py-2">
                <p className="font-display italic text-2xl text-[var(--moss)] mb-4">
                  &ldquo;A place to seek God&apos;s heart. Let&apos;s walk through formation into Christlikeness together.&rdquo;
                </p>
                <footer className="text-[10px] tracking-[0.15em] uppercase text-[var(--espresso)]/60">— the heart of 31 Sisters Daily</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="section bg-[var(--moss)] text-[var(--ivory)] px-6 md:px-12" id="retreats">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative">
            
            <div className="md:col-span-5 md:sticky md:top-32 h-fit">
              <span className="eyebrow text-[var(--gold)]">Choose your doorway</span>
              <h2 className="section-title mt-6 mb-8">Start where<br />you <em className="text-[var(--gold)]">are.</em></h2>
              <p className="text-lg text-[var(--ivory)]/70 max-w-md mb-12 font-light">
                Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.
              </p>
              <button className="btn-quiet inverse" onClick={() => openBooking()} data-testid="button-experience-book">
                See retreat dates
              </button>
            </div>
            
            <div className="md:col-span-7 border-t border-[var(--line-light)]">
              {experiences.map((experience, index) => (
                <button 
                  key={experience.title} 
                  className="w-full text-left group flex items-start gap-6 md:gap-12 py-10 border-b border-[var(--line-light)] transition-all duration-500 hover:pl-6 hover:bg-[var(--ivory)]/5"
                  onClick={() => index === 0 ? openBooking() : notify(`${experience.title} is opening soon. Stay close.`)} 
                  data-testid={`button-experience-${index + 1}`}
                >
                  <span className="text-[var(--gold)] font-sans text-xs tracking-widest mt-2">0{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-3xl md:text-4xl mb-4 group-hover:text-[var(--gold)] transition-colors">{experience.title}</h3>
                    <p className="text-[var(--ivory)]/60 leading-relaxed mb-6 max-w-lg">{experience.text}</p>
                    <span className="text-[10px] tracking-widest uppercase text-[var(--ivory)]/80 flex items-center gap-2">
                      {experience.action} <ArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="section bg-[var(--cream)] px-6 md:px-12 border-b border-[var(--line-dark)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="eyebrow text-[var(--rust)]">Practical tools for the becoming</span>
              <h2 className="section-title mt-6 mb-8 text-[var(--espresso)]">Not just inspiration.<br /><em className="text-[var(--rust)]">Something to do</em> with what you know.</h2>
              <p className="text-lg text-[var(--espresso)]/70">
                Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.
              </p>
            </div>
            
            <SocraticCompanion openBooking={openBooking} />
          </div>
        </section>

        {/* The Daily Section */}
        <section className="section bg-[var(--ivory)] px-6 md:px-12" id="daily">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-center">
            <div className="md:col-span-5 order-2 md:order-1 relative">
              <div className="w-full max-w-sm mx-auto aspect-square rounded-full border border-[var(--gold)] flex flex-col items-center justify-center text-center rotate-[-4deg] p-12">
                <span className="font-display text-5xl text-[var(--gold)] mb-2">31</span>
                <span className="font-display italic text-2xl text-[var(--espresso)] leading-tight">sisters<br />daily</span>
              </div>
            </div>
            
            <div className="md:col-span-7 order-1 md:order-2">
              <span className="eyebrow text-[var(--rust)]">The Daily · a paid creative service</span>
              <h2 className="section-title mt-6 mb-8 text-[var(--espresso)]">A little nourishment for the <em className="text-[var(--rust)]">middle</em> of the day.</h2>
              <p className="text-lg text-[var(--espresso)]/70 mb-10 leading-relaxed max-w-xl">
                Meal Packaging is how 31 Sisters Daily helps a message take its next shape. We turn teachings, retreat insights, conversations, and practical frameworks into clear, nourishing content packages that can meet people across social, print, email, or community spaces.
              </p>
              
              <div className="flex flex-col gap-6 mb-12">
                <div className="flex justify-between items-center py-4 border-b border-[var(--line-dark)] text-sm tracking-wide text-[var(--espresso)] uppercase font-medium">
                  <span>Bespoke service</span>
                  <span className="text-[var(--rust)]">Quote on request</span>
                </div>
                
                <div>
                  <button className="flex w-full justify-between items-center text-left py-4 font-display text-2xl text-[var(--espresso)] hover:text-[var(--rust)] transition-colors" onClick={() => setMealOpen((open) => !open)}>
                    <span>What can a meal packaging project include?</span>
                    <span className="text-[var(--rust)] text-sm font-sans uppercase tracking-widest">{mealOpen ? 'Close' : 'Read'}</span>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mealOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="pt-4 pb-8 text-[var(--espresso)]/70 leading-relaxed max-w-xl">
                      Together, we scope the message, audience, channels, and pace. A package might include a teaching distilled into a set of social posts, a retreat insight shaped into a printable prompt, conversation notes turned into an email sequence, or a framework prepared for a community gathering. Each enquiry is shaped around the work you already have and the people you want to serve.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary" onClick={() => openBooking('Meal Packaging')} data-testid="button-meal-enquire">Enquire about meal packaging</button>
                <a className="btn-quiet" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" data-testid="link-tiktok-daily">Follow 31 Sisters <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[var(--espresso)] text-[var(--ivory)] pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
        {/* Abstract shape in footer */}
        <div className="absolute bottom-0 right-0 w-[40vw] aspect-square rounded-tl-full bg-[var(--rust)]/10 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-20 border-b border-[var(--line-light)]">
            <div>
              <span className="eyebrow text-[var(--gold)]">The next faithful step</span>
              <h2 className="section-title mt-6">Come as you are.<br /><em className="text-[var(--gold)]">Stay for the becoming.</em></h2>
            </div>
            
            <div className="flex flex-col justify-end">
              <form className="flex items-end gap-4 w-full" onSubmit={handleNewsletter}>
                <div className="flex-1">
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[var(--sand)] mb-4">A note for the woman becoming</label>
                  <input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                    placeholder="your@email.com" 
                    className="w-full bg-transparent border-0 border-b border-[var(--line-light)] py-3 text-lg font-light text-white focus:outline-none focus:border-[var(--gold)] transition-colors placeholder-[var(--sand)]/50"
                    data-testid="input-newsletter-email" 
                  />
                </div>
                <button type="submit" className="w-12 h-12 flex items-center justify-center bg-[var(--ivory)] text-[var(--espresso)] hover:bg-[var(--gold)] hover:text-white transition-colors" aria-label="Join the 31 and Rooted list" data-testid="button-newsletter-submit">
                  <MoveRight size={20} strokeWidth={1} />
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[10px] tracking-widest uppercase text-[var(--sand)]/70">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <span>31 & Rooted · 31 Sisters Daily</span>
              <span>Rooted. Becoming. Flourishing.</span>
            </div>
            
            <div className="flex gap-6">
              <a href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" className="hover:text-[var(--gold)] transition-colors">TikTok Daily</a>
              <a href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer" className="hover:text-[var(--gold)] transition-colors">TikTok Rooted</a>
              <button onClick={() => openBooking()} className="hover:text-[var(--gold)] transition-colors text-left" data-testid="button-footer-book">Book a space</button>
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
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="dialog-booking">
        <div className="relative mb-12">
          <span className="eyebrow text-[var(--rust)]">Make room for this</span>
          <h2 id="booking-title" className="font-display text-4xl mt-4 text-[var(--espresso)]">
            {complete ? (kind === 'Meal Packaging' ? 'Your enquiry is on its way.' : 'Your place is held.') : (kind === 'Meal Packaging' ? 'Enquire about the service' : 'Book a space')}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close booking" data-testid="button-booking-close"><X size={24} strokeWidth={1} /></button>
        </div>
        
        {!complete ? (
          <>
            <div className="booking-progress" aria-label={`Booking step ${step} of 3`}>
              {[1, 2, 3].map((number) => <span className={number <= step ? 'active' : ''} key={number} />)}
            </div>
            
            {step === 1 && <div className="booking-form">
              <label>What are you making room for?
                <select value={kind} onChange={(event) => setKind(event.target.value)} data-testid="select-booking-kind">
                  <option value="Retreat">Retreat · Pricing varies</option>
                  <option value="Conversation">Conversation · $95</option>
                  <option value="Meal Packaging">Meal Packaging · bespoke quote</option>
                </select>
              </label>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 my-10 py-6 border-y border-[var(--line-dark)]">
                <span className="text-sm text-[var(--espresso)]/70 max-w-[280px] leading-relaxed">
                  {kind === 'Meal Packaging' ? 'A considered scope shaped around your message, audience, channels, and pace.' : kind === 'Retreat' ? 'Details shared after enquiry. Includes a confirmation and preparation guide.' : 'Includes a confirmation, preparation guide, and a space held with care.'}
                </span>
                <strong className="font-display text-4xl font-normal text-[var(--rust)]">
                  {kind === 'Retreat' ? 'Pricing varies' : kind === 'Conversation' ? '$95' : 'Bespoke quote'}
                </strong>
              </div>
              
              <p className="text-sm text-[var(--espresso)]/60 leading-relaxed font-light">
                {kind === 'Meal Packaging' ? 'Share a little about what you are carrying and what you hope to make clearer. We will reply with thoughtful next steps and a quote shaped to the project.' : 'The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.'}
              </p>
            </div>}
            
            {step === 2 && <div className="booking-form">
              <label>Choose a date
                <select value={date} onChange={(event) => setDate(event.target.value)} data-testid="select-booking-date">
                  <option>Saturday, 14 March 2026</option>
                  <option>Saturday, 11 April 2026</option>
                  <option>Saturday, 09 May 2026</option>
                </select>
              </label>
              <label className="mt-10">Choose a time
                <div className="booking-times mt-4">
                  {['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'].map((slot) => (
                    <button 
                      className={`booking-time ${time === slot ? 'active' : ''}`} 
                      key={slot} 
                      onClick={() => setTime(slot)} 
                      data-testid={`button-time-${slot.replace(/[: ]/g, '-').toLowerCase()}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </label>
            </div>}
            
            {step === 3 && <div className="booking-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <label>Your name
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" data-testid="input-booking-name" />
                </label>
                <label>Email address
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" data-testid="input-booking-email" />
                </label>
              </div>
              
              <div className="bg-[var(--cream)] p-6 text-sm text-[var(--espresso)]/70 leading-relaxed">
                <strong className="text-[var(--espresso)] uppercase text-xs tracking-widest block mb-2">{kind}</strong>
                {date} · {time}<br /><br />
                {kind === 'Meal Packaging' ? 'We will use this as a starting point for your service enquiry.' : 'We\'ll send a warm confirmation and the details you need next.'}
              </div>
            </div>}
            
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--line-dark)]">
              {step > 1 ? (
                <button className="text-xs uppercase tracking-widest flex items-center gap-2 hover:text-[var(--rust)] transition-colors" onClick={() => setStep((current) => current - 1)} data-testid="button-booking-back">
                  <ChevronLeft size={14} /> Back
                </button>
              ) : <span />}
              <button className="btn-primary" onClick={proceed} data-testid="button-booking-next">
                {step === 3 ? (kind === 'Meal Packaging' ? 'Send enquiry' : 'Hold my place') : 'Continue'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--moss)] text-[var(--ivory)] mx-auto flex items-center justify-center mb-8">
              <Check size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-3xl mb-6 text-[var(--espresso)]">
              {kind === 'Meal Packaging' ? 'We will be in touch.' : `${name.split(' ')[0] || 'Your'} next step is held.`}
            </h3>
            <p className="text-[var(--espresso)]/70 leading-relaxed max-w-sm mx-auto mb-10">
              {kind === 'Meal Packaging' ? `Look for a reply at ${email}. We will follow up with the next thoughtful question for your project.` : `Look for a confirmation at ${email}. Until then, let the question stay with you: what are you making room for?`}
            </p>
            <button className="btn-quiet w-full" onClick={onClose} data-testid="button-booking-done">Return home</button>
          </div>
        )}
      </section>
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