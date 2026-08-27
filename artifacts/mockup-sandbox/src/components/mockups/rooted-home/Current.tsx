import { type FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Menu, MoveRight, RotateCcw, Send, X } from 'lucide-react';
import './_group.css';

const artwork = '/__mockup/images/rooted-sisters-daily.jpeg';

const experiences = [
  { title: 'The Retreat', text: 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.', action: 'Explore the next retreat' },
  { title: 'The Conversations', text: 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.', action: 'Book a conversation' },
  { title: 'The Daily', text: 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.', action: 'Visit 31 Sisters Daily' },
];

const frameworks = {
  reframing: { title: 'Cognitive Reframing', steps: ["Let's begin. What thought or emotion feels most present for you right now?", 'If you look closely, what is the root or fear beneath that thought?', 'How might you reframe this toward a truer story? Is there an anchor verse or prayer that could ground you here?', 'Thank you for noticing that. Take this reframe with you today, and return whenever you need to quiet the noise.'] },
  breakthrough: { title: 'Breakthrough', steps: ["Let's begin. What pattern or feeling feels stuck or heavy right now?", 'What lie might be keeping that pattern in place?', 'What truth can replace that lie? How can you take this thought captive today?', 'What is one small, faithful action you can choose to walk in that truth?', 'Thank you for naming that. A breakthrough is often just a series of small, faithful steps. Hold onto your truth today.'] },
  calling: { title: 'Calling', steps: ["Let's begin. In this season, what feels like it is truly yours to carry?", 'And what feels like it is time to release or lay down?', 'What is one simple practice that could help you walk steadily in this calling?', 'Thank you for sharing. Remember that calling is about faithfulness where you are planted. Go in peace today.'] },
};
type FrameworkId = keyof typeof frameworks;
type Message = { id: number; role: 'guide' | 'user'; text: string };

function Reflection({ openBooking }: { openBooking: (service: string) => void }) {
  const [activeId, setActiveId] = useState<FrameworkId | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const active = activeId ? frameworks[activeId] : null;
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);
  const begin = (id: FrameworkId) => {
    setActiveId(id); setStep(0); setInput('');
    setMessages([{ id: Date.now(), role: 'guide', text: frameworks[id].steps[0] }]);
  };
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || !active) return;
    const answer = input.trim();
    const next = step + 1;
    setMessages((old) => [...old, { id: Date.now(), role: 'user', text: answer }]);
    setInput('');
    if (next < active.steps.length) window.setTimeout(() => {
      setMessages((old) => [...old, { id: Date.now() + 1, role: 'guide', text: active.steps[next] }]);
      setStep(next);
    }, 600);
  };
  if (!active) return <div className="socratic-container">
    <div className="socratic-intro"><h3>Guided Reflection</h3><p>A quiet space to notice, name, and reframe what you are carrying. Please note this is a gentle companion for reflection, not clinical care or crisis support.</p></div>
    <div className="socratic-grid">{(Object.keys(frameworks) as FrameworkId[]).map((id) => <button key={id} className="socratic-card" onClick={() => begin(id)}><h4>{frameworks[id].title}</h4><ArrowUpRight size={16} /></button>)}</div>
    <p className="socratic-purchase">Looking for the full printable workbooks? <a href="https://wa.me/?text=I'd%20love%20to%20purchase%20the%20full%20guided%20workbooks." target="_blank" rel="noreferrer">Purchase the complete process via WhatsApp</a>.</p>
  </div>;
  const finished = step >= active.steps.length - 1;
  return <div className="socratic-container socratic-chat">
    <div className="socratic-chat-header"><h4>{active.title}</h4><button onClick={() => { setActiveId(null); setMessages([]); }}><RotateCcw size={14} /> Start over</button></div>
    <div className="socratic-messages">{messages.map((message) => <div className={`socratic-msg ${message.role}`} key={message.id}><div>{message.text}</div></div>)}<div ref={end} /></div>
    {!finished ? <form className="socratic-input-area" onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your reflection here..." /><button disabled={!input.trim()} aria-label="Send message"><Send size={16} /></button></form>
      : <div className="socratic-finished"><button className="btn-primary" onClick={() => openBooking('Conversation')}>Book a deeper conversation</button></div>}
  </div>;
}

function BookingModal({ initialKind, onClose, notify }: { initialKind: string; onClose: () => void; notify: (message: string) => void }) {
  const [step, setStep] = useState(1); const [kind, setKind] = useState(initialKind);
  const [date, setDate] = useState('Saturday, 14 March 2026'); const [time, setTime] = useState('10:30 AM');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [complete, setComplete] = useState(false);
  const proceed = () => {
    if (step < 3) { setStep((value) => value + 1); return; }
    if (!name.trim() || !email.trim()) { notify('Add your name and email so we can hold your place.'); return; }
    setComplete(true);
  };
  const serviceText = kind === 'Meal Packaging' ? 'A considered scope shaped around your message, audience, channels, and pace.' : kind === 'Retreat' ? 'Details shared after enquiry. Includes a confirmation and preparation guide.' : 'Includes a confirmation, preparation guide, and a space held with care.';
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
    <div className="modal-heading"><span className="eyebrow rust">Make room for this</span><h2 id="booking-title">{complete ? (kind === 'Meal Packaging' ? 'Your enquiry is on its way.' : 'Your place is held.') : kind === 'Meal Packaging' ? 'Enquire about the service' : 'Book a space'}</h2><button className="modal-close" onClick={onClose} aria-label="Close booking"><X size={24} strokeWidth={1} /></button></div>
    {!complete ? <><div className="booking-progress">{[1, 2, 3].map((number) => <span className={number <= step ? 'active' : ''} key={number} />)}</div>
      {step === 1 && <div className="booking-form"><label>What are you making room for?<select value={kind} onChange={(event) => setKind(event.target.value)}><option value="Retreat">Retreat · Pricing varies</option><option value="Conversation">Conversation · $95</option><option value="Meal Packaging">Meal Packaging · bespoke quote</option></select></label><div className="booking-summary"><span>{serviceText}</span><strong>{kind === 'Retreat' ? 'Pricing varies' : kind === 'Conversation' ? '$95' : 'Bespoke quote'}</strong></div><p>{kind === 'Meal Packaging' ? 'Share a little about what you are carrying and what you hope to make clearer. We will reply with thoughtful next steps and a quote shaped to the project.' : 'The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.'}</p></div>}
      {step === 2 && <div className="booking-form"><label>Choose a date<select value={date} onChange={(event) => setDate(event.target.value)}><option>Saturday, 14 March 2026</option><option>Saturday, 11 April 2026</option><option>Saturday, 09 May 2026</option></select></label><label>Choose a time<div className="booking-times">{['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'].map((slot) => <button className={time === slot ? 'active' : ''} key={slot} onClick={() => setTime(slot)}>{slot}</button>)}</div></label></div>}
      {step === 3 && <div className="booking-form"><div className="booking-fields"><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label></div><div className="booking-confirm"><strong>{kind}</strong>{date} · {time}<br /><br />{kind === 'Meal Packaging' ? 'We will use this as a starting point for your service enquiry.' : "We'll send a warm confirmation and the details you need next."}</div></div>}
      <div className="booking-actions">{step > 1 ? <button className="back" onClick={() => setStep((value) => value - 1)}><ChevronLeft size={14} /> Back</button> : <span />}<button className="btn-primary" onClick={proceed}>{step === 3 ? kind === 'Meal Packaging' ? 'Send enquiry' : 'Hold my place' : 'Continue'}</button></div></>
      : <div className="booking-complete"><div><Check size={28} /></div><h3>{kind === 'Meal Packaging' ? 'We will be in touch.' : `${name.split(' ')[0] || 'Your'} next step is held.`}</h3><p>{kind === 'Meal Packaging' ? `Look for a reply at ${email}. We will follow up with the next thoughtful question for your project.` : `Look for a confirmation at ${email}. Until then, let the question stay with you: what are you making room for?`}</p><button className="btn-quiet" onClick={onClose}>Return home</button></div>}
  </section></div>;
}

export function Current() {
  const [menuOpen, setMenuOpen] = useState(false); const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState('Retreat'); const [toast, setToast] = useState(''); const [mealOpen, setMealOpen] = useState(false); const [email, setEmail] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const openBooking = (service = 'Retreat') => { setBookingService(service); setBookingOpen(true); };
  const scrollTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const newsletter = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!email.trim()) { notify('Add your email so we know where to send the next note.'); return; } setEmail(''); notify('You are on the list. A note for the becoming will find you soon.'); };
  return <div className="rooted-home">
    <header className="rooted-nav"><a href="#top" className="brand"><img src={artwork} alt="31 Sisters Daily" /><span>31 &amp; Rooted</span></a><nav className={menuOpen ? 'open' : ''}><button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={28} /></button><button onClick={() => scrollTo('retreats')}>Retreats</button><button onClick={() => scrollTo('tools')}>Tools</button><button onClick={() => scrollTo('daily')}>The Daily</button><button className="nav-book" onClick={() => openBooking()}>Book a space</button></nav><button className="menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={28} /></button></header>
    <main id="top">
      <section className="hero"><div className="hero-art"><img src={artwork} alt="" /></div><div className="hero-content"><span className="eyebrow gold">A digital home for becoming</span><h1>Come back to <em>yourself.</em><br />Come closer to Christ.</h1><p>A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools. Biblical truth. Room to breathe.</p><div className="hero-actions"><button className="btn-primary inverse" onClick={() => scrollTo('retreats')}>Find your retreat <ArrowRight size={15} /></button><button className="btn-quiet inverse" onClick={() => scrollTo('tools')}>Begin a reflection</button></div><div className="hero-notes"><span>Rooted in truth</span><b>✦</b><span>Made for real life</span><b>✦</b><span>Formed in Christ</span></div></div></section>
      <section className="story section"><div className="story-image"><img src={artwork} alt="Tactile texture" /></div><div><span className="eyebrow rust">You do not have to rush this</span><h2>Formation is not a finish line. It is a way of <em>walking.</em></h2><p>31&amp;Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.</p><blockquote>“A place to seek God's heart. Let's walk through formation into Christlikeness together.”<footer>- the heart of 31 Sisters Daily</footer></blockquote></div></section>
      <section className="experiences section" id="retreats"><div className="experience-intro"><span className="eyebrow gold">Choose your doorway</span><h2>Start where<br />you <em>are.</em></h2><p>Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.</p><button className="btn-quiet inverse" onClick={() => openBooking()}>See retreat dates</button></div><div className="experience-list">{experiences.map((experience, index) => <button key={experience.title} className="experience-item" onClick={() => index === 0 ? openBooking() : notify(`${experience.title} is opening soon. Stay close.`)}><span>0{index + 1}</span><div><h3>{experience.title}</h3><p>{experience.text}</p><small>{experience.action} <ArrowRight size={14} /></small></div></button>)}</div></section>
      <section className="tools section" id="tools"><div className="tools-heading"><span className="eyebrow rust">Practical tools for the becoming</span><h2>Not just inspiration.<br /><em>Something to do</em> with what you know.</h2><p>Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.</p></div><Reflection openBooking={openBooking} /></section>
      <section className="daily section" id="daily"><div className="daily-mark"><b>31</b><i> sisters<br />daily</i></div><div><span className="eyebrow rust">The Daily · a paid creative service</span><h2>A little nourishment for the <em>middle</em> of the day.</h2><p>Meal Packaging is how 31 Sisters Daily helps a message take its next shape. We turn teachings, retreat insights, conversations, and practical frameworks into clear, nourishing content packages that can meet people across social, print, email, or community spaces.</p><div className="service-meta"><span>Bespoke service</span><b>Quote on request</b></div><div className="meal-question"><button onClick={() => setMealOpen((value) => !value)}><span>What can a meal packaging project include?</span><b>{mealOpen ? 'Close' : 'Read'}</b></button>{mealOpen && <p>Together, we scope the message, audience, channels, and pace. A package might include a teaching distilled into a set of social posts, a retreat insight shaped into a printable prompt, conversation notes turned into an email sequence, or a framework prepared for a community gathering. Each enquiry is shaped around the work you already have and the people you want to serve.</p>}</div><div className="daily-actions"><button className="btn-primary" onClick={() => openBooking('Meal Packaging')}>Enquire about meal packaging</button><a className="btn-quiet" href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer">Follow 31 Sisters <ArrowUpRight size={15} /></a></div></div></section>
    </main>
    <footer><div className="footer-top"><div><span className="eyebrow gold">The next faithful step</span><h2>Come as you are.<br /><em>Stay for the becoming.</em></h2></div><form onSubmit={newsletter}><label htmlFor="rooted-email">A note for the woman becoming</label><div><input id="rooted-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" /><button aria-label="Join the 31 and Rooted list"><MoveRight size={20} strokeWidth={1} /></button></div></form></div><div className="footer-bottom"><span>31 &amp; Rooted · 31 Sisters Daily</span><span>Rooted. Becoming. Flourishing.</span><div><a href="https://www.tiktok.com/@31sistersdaily" target="_blank" rel="noreferrer">TikTok Daily</a><a href="https://www.tiktok.com/@31androoted" target="_blank" rel="noreferrer">TikTok Rooted</a><button onClick={() => openBooking()}>Book a space</button></div></div></footer>
    {bookingOpen && <BookingModal initialKind={bookingService} onClose={() => setBookingOpen(false)} notify={notify} />}{toast && <div className="toast-note" role="status">{toast}</div>}
  </div>;
}