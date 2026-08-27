import { useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Menu, Send, X } from 'lucide-react';
import './_group.css';

const artwork = '/__mockup/images/thirty-one-sisters-daily.jpeg';

const experiences = [
  ['The Retreat', 'A held, unhurried space for women to rest, listen, and let God tend to what has been carrying them.', 'Explore the next retreat'],
  ['The Conversations', 'Warm, honest sessions for the seasons that need a little more room: marriage, motherhood, identity, calling.', 'Book a conversation'],
  ['The Daily', 'Small practices and biblical truth for ordinary Tuesdays. A way to keep becoming in the middle of real life.', 'Visit 31 Sisters Daily'],
];

export function Current() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify(email.trim() ? 'You are on the list. A note for the becoming will find you soon.' : 'Add your email so we know where to send the next note.');
    if (email.trim()) setEmail('');
  };
  const book = () => setBookingOpen(true);

  return (
    <div className="thirty-one-current site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top"><img className="brand-mark" src={artwork} alt="31 Sisters Daily" /><span><span className="brand-wordmark">31 &amp; Rooted</span><span className="brand-sub">A place for women after God&apos;s heart</span></span></a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <a className="nav-link" href="#retreats">Retreats</a><a className="nav-link" href="#tools">Tools</a><a className="nav-link" href="#daily">The Daily</a>
          <button className="button-primary" onClick={book}>Book a space <ArrowUpRight size={14} /></button>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-content reveal"><span className="eyebrow">A digital home for becoming</span><h1 className="display">Come back to <em>yourself.</em><br />Come closer to Christ.</h1><p className="hero-copy">A place for the woman carrying a lot, asking honest questions, and learning to live from what is true. Practical tools. Biblical truth. Room to breathe.</p><div className="hero-actions"><a className="button-primary" href="#retreats">Find your retreat <ArrowRight size={15} /></a><a className="button-quiet" href="#tools">Begin a reflection</a></div><p className="hero-note">Where women retreat to be formed in Christ. Rooted. Becoming. Flourishing.</p></div>
          <div className="hero-art reveal"><div className="art-frame"><img src={artwork} alt="" /><div className="art-overlay" /><div className="art-caption"><strong>There is more<br />for you here.</strong><span>rest · truth · becoming</span></div></div><div className="seal">made for<br />the middle<br />of becoming</div></div>
        </section>
        <div className="marquee"><div className="marquee-track">{['Rooted in truth', '—', 'Made for real life', '—', 'Formed in Christ', '—', 'Rooted in truth', '—', 'Made for real life', '—', 'Formed in Christ', '—'].map((item, i) => <span key={i}>{item}</span>)}</div></div>
        <section className="section section-dark"><div className="story-grid"><div className="section-heading"><span className="eyebrow">You do not have to rush this</span><h2>Formation is not a finish line. It is a way of <em>walking.</em></h2><p>31&amp;Rooted was made for the in-between: after the prayer, before the answer; when the old way is no longer working and the new way is still taking shape.</p></div><div className="story-aside"><p>&ldquo;A place to seek God&apos;s heart. Let&apos;s walk through formation into Christlikeness together.&rdquo;</p><small>— the heart of 31 Sisters Daily</small></div></div></section>
        <section className="section" id="retreats"><div className="experience-layout"><div className="experience-intro"><span className="eyebrow">Choose your doorway</span><h2>Start where<br />you <em>are.</em></h2><p>Some seasons call for a room. Some call for a page. Some call for a conversation. There is no right order.</p><button className="button-quiet" onClick={book}>See retreat dates &amp; pricing <CalendarDays size={15} /></button></div><div className="experience-list">{experiences.map(([title, text, action], i) => <button className="experience-item" onClick={i === 0 ? book : () => notify(`${title} is opening soon. Stay close.`)} key={title}><span className="experience-number">0{i + 1}</span><span><h3>{title}</h3><p>{text}</p><span className="eyebrow action-label">{action}</span></span><ArrowRight className="experience-arrow" size={19} /></button>)}</div></div></section>
        <section id="tools" className="section tool-zone"><div className="section-heading"><span className="eyebrow">Practical tools for the becoming</span><h2>Not just inspiration.<br /><em>Something to do</em> with what you know.</h2><p>Use the framework. Write the sentence. Ask the better question. These resources are built to meet you on an ordinary day and help you practice a truer one.</p></div><Reflection /></section>
        <section className="section" id="daily"><div className="meal-layout"><div className="meal-mark">31<br /><span> sisters<br />daily</span></div><div className="meal-content"><span className="eyebrow">The Daily · a paid creative service</span><h2>A little nourishment for the <em>middle</em> of the day.</h2><p>Meal Packaging is how 31 Sisters Daily helps a message take its next shape. We turn teachings, retreat insights, conversations, and practical frameworks into clear, nourishing content packages that can meet people across social, print, email, or community spaces.</p><div className="meal-service-meta"><span>Bespoke service</span><strong>Quote on request</strong></div><div className="meal-reveal"><div className="meal-question"><span>What can a meal packaging project include?</span><button onClick={() => setMealOpen(!mealOpen)} aria-label="Toggle details"><ChevronDown size={20} /></button></div>{mealOpen && <p className="meal-answer">Together, we scope the message, audience, channels, and pace. A package might include a teaching distilled into a set of social posts, a retreat insight shaped into a printable prompt, conversation notes turned into an email sequence, or a framework prepared for a community gathering. Each enquiry is shaped around the work you already have and the people you want to serve.</p>}</div><div className="hero-actions"><button className="button-primary" onClick={book}>Enquire about meal packaging <ArrowUpRight size={15} /></button><a className="button-quiet" href="https://www.tiktok.com/@31sistersdaily">Follow 31 Sisters Daily <ArrowUpRight size={15} /></a></div></div></div></section>
        <section className="social-band"><div><span className="eyebrow">Keep walking with us</span><h2>For the days you need a word, a witness, or a place to begin again.</h2></div><div className="social-links"><a className="social-link" href="https://www.tiktok.com/@31sistersdaily">TikTok · Daily <ArrowUpRight size={14} /></a><a className="social-link" href="https://www.tiktok.com/@31androoted">TikTok · Rooted <ArrowUpRight size={14} /></a></div></section>
      </main>
      <footer className="footer"><div className="footer-main"><div><span className="eyebrow">The next faithful step</span><h2>Come as you are.<br /><em>Stay for the becoming.</em></h2></div><form className="footer-form" onSubmit={submit}><label>A note for the woman becoming<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></label><button aria-label="Join the list"><ArrowRight size={17} /></button></form></div><div className="footer-bottom"><span>31 &amp; Rooted · 31 Sisters Daily</span><span>Rooted. Becoming. Flourishing.</span><button onClick={book}>Book a retreat or conversation</button></div></footer>
      {bookingOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setBookingOpen(false)}><section className="booking-modal" role="dialog"><div className="modal-top"><div><span className="eyebrow">Make room for this</span><h2>Book a space</h2></div><button className="modal-close" onClick={() => setBookingOpen(false)}><X size={21} /></button></div><div className="booking-progress"><span className="active" /><span /><span /></div><div className="booking-form"><label>What are you making room for?<select defaultValue="Retreat"><option>Retreat · Pricing varies</option><option>Conversation · $95</option><option>Meal Packaging · bespoke quote</option></select></label><div className="booking-price-row"><span>Details shared after enquiry. Includes a confirmation and preparation guide.</span><strong>Pricing varies</strong></div><p className="booking-note">The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.</p></div><div className="booking-footer"><span /><button className="button-primary" onClick={() => notify('Your booking flow is ready to continue in the live app.')}>Continue <ArrowRight size={15} /></button></div></section></div>}
      {notice && <div className="toast-note" role="status">{notice}</div>}
    </div>
  );
}

function Reflection() {
  const [active, setActive] = useState<string | null>(null);
  return <div className="socratic-container">{!active ? <div className="socratic-choosers"><h3>Guided Reflection</h3><p>A quiet space to notice, name, and reframe what you are carrying. Please note this is a gentle companion for reflection, not clinical care or crisis support.</p><div className="socratic-grid">{['Cognitive Reframing', 'Breakthrough', 'Calling'].map(name => <button className="socratic-card" onClick={() => setActive(name)} key={name}><h4>{name}</h4><ArrowUpRight size={16} /></button>)}</div><div className="socratic-purchase-note"><p>Looking for the full printable workbooks? <a href="https://wa.me/">Purchase the complete process via WhatsApp</a>.</p></div></div> : <div className="socratic-chat"><div className="socratic-chat-header"><h4>{active}</h4><button className="button-icon" onClick={() => setActive(null)}>Start over</button></div><div className="socratic-messages"><div className="socratic-msg guide"><div className="msg-bubble">Let&apos;s begin. What thought or emotion feels most present for you right now?</div></div></div><div className="socratic-input-area"><input className="socratic-input" placeholder="Type your reflection here..." /><button aria-label="Send message"><Send size={16} /></button></div></div>}</div>;
}