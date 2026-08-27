import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronLeft, Menu, MoveRight, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import sistersLogo from '@assets/WhatsApp_Image_2026-08-27_at_12.12.09_PM_1787849508863.jpeg';
import reframingWorkbook from '@assets/Cognitive_Reframing._A_short_workbook_1787849743134.pdf';
import breakthroughWorkbook from '@assets/Breakthrough-_Workbook_1787849743135.pdf';
import callingGuide from '@assets/Calling_1787849743135.pdf';

const queryClient = new QueryClient();

const experiences = [
  { title: 'The Retreat', text: 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.', action: 'Explore the next retreat' },
  { title: 'The Conversations', text: 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.', action: 'Book a conversation' },
  { title: 'The Daily', text: 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.', action: 'Visit 31 Sisters Daily' },
];

const tools = [
  { tag: 'short workbook', title: 'Cognitive reframing', text: 'Notice the thought. Name the story. Practice a truer way to see what is in front of you.', action: 'Open the workbook' },
  { tag: 'guided framework', title: 'Breakthrough', text: 'A gentle map for moving from stuck patterns toward honest, faithful action.', action: 'Start the framework' },
  { tag: 'reflection', title: 'Calling', text: 'A quiet place to ask what is yours to carry in this season — and what is not.', action: 'Reflect on calling' },
  { tag: 'teaching', title: 'Notice', text: 'Pay attention to the pattern before you rush to fix it.', action: 'Listen in' },
  { tag: 'practice', title: 'Name', text: 'Language can turn a fog into something you can meet with courage.', action: 'Try the practice' },
  { tag: 'next step', title: 'Reframe', text: 'Make room for truth, tenderness, and the next faithful yes.', action: 'Find a next step' },
];

const reflectionQuestions = [
  { prompt: 'What feels most present in you today?', options: ['A decision', 'A disappointment', 'A relationship', 'A quiet longing'] },
  { prompt: 'If that feeling could speak without fixing itself, what might it say?', options: ['I need rest', 'I feel unseen', 'I am afraid', 'I want to begin'] },
  { prompt: 'What would a faithful next step look like — small enough to take today?', options: ['Tell the truth', 'Ask for help', 'Make space', 'Release control'] },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('Retreat');
  const [toast, setToast] = useState('');
  const [reflectionStep, setReflectionStep] = useState(0);
  const [reflectionChoice, setReflectionChoice] = useState('');
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

  const chooseReflection = (choice: string) => {
    setReflectionChoice(choice);
    notify('Held here. Your reflection is yours to return to.');
  };

  const nextReflection = () => {
    if (!reflectionChoice) {
      notify('Choose the word that feels closest. There is no perfect answer.');
      return;
    }
    if (reflectionStep < reflectionQuestions.length - 1) {
      setReflectionStep((step) => step + 1);
      setReflectionChoice('');
    } else {
      notify('You have named a faithful next step. Carry it gently.');
    }
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
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" data-testid="link-home">
          <img className="brand-mark" src={sistersLogo} alt="31 Sisters Daily" data-testid="img-brand-logo" />
          <span>
            <span className="brand-wordmark">31 & Rooted</span>
            <span className="brand-sub">A place for women after God&apos;s heart</span>
          </span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <button className="nav-link" onClick={() => scrollTo('retreats')} data-testid="button-nav-retreats">Retreats</button>
          <button className="nav-link" onClick={() => scrollTo('tools')} data-testid="button-nav-tools">Tools</button>
          <button className="nav-link" onClick={() => scrollTo('reflection')} data-testid="button-nav-reflection">Reflection</button>
          <button className="nav-link" onClick={() => scrollTo('daily')} data-testid="button-nav-daily">The Daily</button>
          <button className="button-primary" onClick={() => openBooking()} data-testid="button-nav-book">Book a space <ArrowUpRight size={14} /></button>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content reveal">
            <span className="eyebrow">A digital home for becoming</span>
            <h1 className="display">Come back to <em>yourself.</em><br />Come closer to Christ.</h1>
            <p className="hero-copy">A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools. Biblical truth. Room to breathe.</p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => scrollTo('retreats')} data-testid="button-hero-retreats">Find your retreat <ArrowRight size={15} /></button>
              <button className="button-quiet" onClick={() => scrollTo('reflection')} data-testid="button-hero-reflection">Begin a reflection</button>
            </div>
            <p className="hero-note">Where women retreat to be formed in Christ. Rooted. Becoming. Flourishing.</p>
          </div>
          <div className="hero-art reveal">
            <div className="art-frame">
              <img src={sistersLogo} alt="" aria-hidden="true" />
              <div className="art-overlay" />
              <div className="art-caption">
                <strong>There is more<br />for you here.</strong>
                <span>rest · truth · becoming</span>
              </div>
            </div>
            <div className="seal">made for<br />the middle<br />of becoming</div>
          </div>
        </section>

        <div className="marquee" aria-label="31 and Rooted values">
          <div className="marquee-track">
            <span>Rooted in truth</span><span>—</span><span>Made for real life</span><span>—</span><span>Formed in Christ</span><span>—</span><span>Rooted in truth</span><span>—</span><span>Made for real life</span><span>—</span><span>Formed in Christ</span><span>—</span>
          </div>
        </div>

        <section className="section section-dark">
          <div className="story-grid">
            <div className="section-heading">
              <span className="eyebrow">You do not have to rush this</span>
              <h2>Formation is not a finish line. It is a way of <em>walking.</em></h2>
              <p>31&Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.</p>
            </div>
            <div className="story-aside">
              <p>&ldquo;A place to seek God&apos;s heart. Let&apos;s walk through formation into Christlikeness together.&rdquo;</p>
              <small>— the heart of 31 Sisters Daily</small>
            </div>
          </div>
        </section>

        <section className="section" id="retreats">
          <div className="experience-layout">
            <div className="experience-intro">
              <span className="eyebrow">Choose your doorway</span>
              <h2>Start where<br />you <em>are.</em></h2>
              <p>Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.</p>
              <button className="button-quiet" onClick={() => openBooking()} data-testid="button-experience-book">See retreat dates & pricing <CalendarDays size={15} /></button>
            </div>
            <div className="experience-list">
              {experiences.map((experience, index) => (
                <button className="experience-item" key={experience.title} onClick={() => index === 0 ? openBooking() : notify(`${experience.title} is opening soon. Stay close.`)} data-testid={`button-experience-${index + 1}`}>
                  <span className="experience-number">0{index + 1}</span>
                  <span>
                    <h3>{experience.title}</h3>
                    <p>{experience.text}</p>
                    <span className="eyebrow" style={{ marginTop: 22 }}>{experience.action}</span>
                  </span>
                  <ArrowRight className="experience-arrow" size={19} />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section tool-zone" id="tools">
          <div className="section-heading">
            <span className="eyebrow">Practical tools for the becoming</span>
            <h2>Not just inspiration.<br /><em>Something to do</em> with what you know.</h2>
            <p>Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.</p>
          </div>
          <div className="tool-grid">
            {tools.map((tool, index) => (
              <article className="tool-card" key={tool.title} data-testid={`card-tool-${index + 1}`}>
                <span className="tool-tag">{tool.tag}</span>
                <div>
                  <h3>{tool.title}</h3>
                  <p>{tool.text}</p>
                </div>
                <button onClick={() => {
                  if (index === 0) window.open(reframingWorkbook, '_blank', 'noopener,noreferrer');
                  else if (index === 1) window.open(breakthroughWorkbook, '_blank', 'noopener,noreferrer');
                  else if (index === 2) window.open(callingGuide, '_blank', 'noopener,noreferrer');
                  else notify(`${tool.title} is being prepared with care.`);
                }} data-testid={`button-tool-${index + 1}`}>{tool.action} <MoveRight size={15} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-dark" id="reflection">
          <div className="reflect-layout">
            <div className="reflect-card" data-testid="card-guided-reflection">
              <span className="reflect-step">Guided reflection · 0{reflectionStep + 1} / 03</span>
              <h3 className="reflect-question">{reflectionQuestions[reflectionStep].prompt}</h3>
              <div className="reflect-options">
                {reflectionQuestions[reflectionStep].options.map((option) => (
                  <button className={`reflect-option ${reflectionChoice === option ? 'active' : ''}`} key={option} onClick={() => chooseReflection(option)} data-testid={`button-reflection-${option.toLowerCase().replaceAll(' ', '-')}`}>
                    {option}
                  </button>
                ))}
              </div>
              <div className="reflect-footer">
                <div className="dots" aria-label={`Reflection step ${reflectionStep + 1} of 3`}>
                  {reflectionQuestions.map((question, index) => <span className={`dot ${index === reflectionStep ? 'active' : ''}`} key={question.prompt} />)}
                </div>
                <button className="button-primary" onClick={nextReflection} data-testid="button-reflection-next">
                  {reflectionStep === reflectionQuestions.length - 1 ? 'Finish gently' : 'Keep going'} <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <div className="reflect-aside">
              <span className="eyebrow">A gentle Socratic guide</span>
              <h3>What if the question is part of the way?</h3>
              <p>This is not a quiz, diagnosis, or performance. Just a few considered questions to help you notice, name, reframe, and take one next faithful step.</p>
              <button className="button-quiet" style={{ color: 'var(--cream)', borderColor: 'rgba(243,231,220,.35)', marginTop: 20 }} onClick={() => { setReflectionStep(0); setReflectionChoice(''); notify('A fresh reflection is waiting.'); }} data-testid="button-reflection-reset">Begin again</button>
            </div>
          </div>
        </section>

        <section className="section" id="daily">
          <div className="meal-layout">
            <div className="meal-mark">31<br /><span style={{ fontSize: 17 }}>sisters<br />daily</span></div>
            <div className="meal-content">
              <span className="eyebrow">The Daily · a paid creative service</span>
              <h2>A little nourishment for the <em>middle</em> of the day.</h2>
              <p>Meal Packaging is how 31 Sisters Daily helps a message take its next shape. We turn teachings, retreat insights, conversations, and practical frameworks into clear, nourishing content packages that can meet people across social, print, email, or community spaces.</p>
              <div className="meal-service-meta" data-testid="text-meal-packaging-value">
                <span>Bespoke service</span>
                <strong>Quote on request</strong>
              </div>
              <div className="meal-reveal">
                <div className="meal-question">
                  <span>What can a meal packaging project include?</span>
                  <button onClick={() => setMealOpen((open) => !open)} aria-label="Toggle meal packaging details" data-testid="button-meal-details">{mealOpen ? <ChevronDown size={20} /> : <ArrowDownIcon />}</button>
                </div>
                {mealOpen && <p className="meal-answer">Together, we scope the message, audience, channels, and pace. A package might include a teaching distilled into a set of social posts, a retreat insight shaped into a printable prompt, conversation notes turned into an email sequence, or a framework prepared for a community gathering. Each enquiry is shaped around the work you already have and the people you want to serve.</p>}
              </div>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => openBooking('Meal Packaging')} data-testid="button-meal-enquire">Enquire about meal packaging <ArrowUpRight size={15} /></button>
                <a className="button-quiet" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" data-testid="link-tiktok-daily">Follow 31 Sisters Daily <ArrowUpRight size={15} /></a>
                <a className="button-quiet" href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer" data-testid="link-tiktok-rooted">Follow the retreat story</a>
              </div>
            </div>
          </div>
        </section>

        <section className="social-band">
          <div>
            <span className="eyebrow">Keep walking with us</span>
            <h2>For the days you need a word, a witness, or a place to begin again.</h2>
          </div>
          <div className="social-links">
            <a className="social-link" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer" data-testid="link-social-daily">TikTok · Daily <ArrowUpRight size={14} /></a>
            <a className="social-link" href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer" data-testid="link-social-rooted">TikTok · Rooted <ArrowUpRight size={14} /></a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div>
            <span className="eyebrow" style={{ color: 'var(--sand)' }}>The next faithful step</span>
            <h2>Come as you are.<br /><em>Stay for the becoming.</em></h2>
          </div>
          <form className="footer-form" onSubmit={handleNewsletter}>
            <label htmlFor="email">A note for the woman becoming
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" data-testid="input-newsletter-email" />
            </label>
            <button type="submit" aria-label="Join the 31 and Rooted list" data-testid="button-newsletter-submit"><ArrowRight size={17} /></button>
          </form>
        </div>
        <div className="footer-bottom">
          <span>31 & Rooted · 31 Sisters Daily</span>
          <span>Rooted. Becoming. Flourishing.</span>
          <button onClick={() => openBooking()} style={{ color: 'var(--sand)', background: 'transparent', border: 0, padding: 0, font: 'inherit' }} data-testid="button-footer-book">Book a retreat or conversation</button>
        </div>
      </footer>

      {bookingOpen && <BookingModal initialKind={bookingService} onClose={() => setBookingOpen(false)} onNotify={notify} />}
      {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function ArrowDownIcon() {
  return <ChevronDown size={20} />;
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
        <div className="modal-top">
          <div>
            <span className="eyebrow">Make room for this</span>
            <h2 id="booking-title">{complete ? (kind === 'Meal Packaging' ? 'Your enquiry is on its way.' : 'Your place is held.') : (kind === 'Meal Packaging' ? 'Enquire about the service' : 'Book a space')}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close booking" data-testid="button-booking-close"><X size={21} /></button>
        </div>
        {!complete ? (
          <>
            <div className="booking-progress" aria-label={`Booking step ${step} of 3`}>
              {[1, 2, 3].map((number) => <span className={number <= step ? 'active' : ''} key={number} />)}
            </div>
            {step === 1 && <div className="booking-form">
              <label>What are you making room for?
                <select value={kind} onChange={(event) => setKind(event.target.value)} data-testid="select-booking-kind">
                  <option value="Retreat">Retreat · $295</option>
                  <option value="Conversation">Conversation · $95</option>
                  <option value="Meal Packaging">Meal Packaging · bespoke quote</option>
                </select>
              </label>
              <div className="booking-price-row">
                <span>{kind === 'Meal Packaging' ? 'A considered scope shaped around your message, audience, channels, and pace.' : 'Includes a confirmation, preparation guide, and a space held with care.'}</span>
                <strong>{kind === 'Retreat' ? '$295' : kind === 'Conversation' ? '$95' : 'Bespoke quote'}</strong>
              </div>
              <p className="booking-note">{kind === 'Meal Packaging' ? 'Share a little about what you are carrying and what you hope to make clearer. We will reply with thoughtful next steps and a quote shaped to the project.' : 'The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.'}</p>
            </div>}
            {step === 2 && <div className="booking-form">
              <label>Choose a date
                <select value={date} onChange={(event) => setDate(event.target.value)} data-testid="select-booking-date">
                  <option>Saturday, 14 March 2026</option>
                  <option>Saturday, 11 April 2026</option>
                  <option>Saturday, 09 May 2026</option>
                </select>
              </label>
              <label style={{ marginTop: 24 }}>Choose a time
                <div className="booking-times">
                  {['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'].map((slot) => <button className={`booking-time ${time === slot ? 'active' : ''}`} key={slot} onClick={() => setTime(slot)} data-testid={`button-time-${slot.replace(/[: ]/g, '-').toLowerCase()}`}>{slot}</button>)}
                </div>
              </label>
            </div>}
            {step === 3 && <div className="booking-form">
              <div className="booking-grid">
                <label>Your name
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" data-testid="input-booking-name" />
                </label>
                <label>Email address
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" data-testid="input-booking-email" />
                </label>
              </div>
              <p className="booking-note"><strong>{kind}</strong> · {date} · {time}<br />{kind === 'Meal Packaging' ? 'We will use this as a starting point for your service enquiry.' : 'We&apos;ll send a warm confirmation and the details you need next.'}</p>
            </div>}
            <div className="booking-footer">
              {step > 1 ? <button className="button-quiet" onClick={() => setStep((current) => current - 1)} data-testid="button-booking-back"><ChevronLeft size={15} /> Back</button> : <span />}
              <button className="button-primary" onClick={proceed} data-testid="button-booking-next">{step === 3 ? (kind === 'Meal Packaging' ? 'Send enquiry' : 'Hold my place') : 'Continue'} <ArrowRight size={15} /></button>
            </div>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon"><Check size={26} /></div>
            <h3>{kind === 'Meal Packaging' ? 'We will be in touch.' : `${name.split(' ')[0] || 'Your'} next step is held.`}</h3>
            <p className="booking-note" style={{ margin: '18px auto 26px', maxWidth: 360 }}>{kind === 'Meal Packaging' ? `Look for a reply at ${email}. We will follow up with the next thoughtful question for your project.` : `Look for a confirmation at ${email}. Until then, let the question stay with you: what are you making room for?`}</p>
            <button className="button-primary" onClick={onClose} data-testid="button-booking-done">Return home <ArrowRight size={15} /></button>
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