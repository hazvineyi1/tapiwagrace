import { useEffect, useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { useSendContactMessage } from '@workspace/api-client-react';

import { useSiteChrome } from '@/components/site-chrome';
import { HoneypotField } from '@/components/honeypot-field';
import { SocialLinks } from '@/components/social-links';
import { CONTACT } from '@/lib/contact';
import { errorMessage } from '@/lib/site-nav';

const DOORWAYS = [
  { label: 'A retreat', description: 'Ask about upcoming dates and what a retreat holds.', booking: 'Retreat' },
  { label: 'A conversation', description: 'A focused one-to-one for the season you are in.', booking: 'Conversation' },
  { label: 'Meal support', description: 'Prepared meals packaged and delivered as a paid programme.', booking: 'Meal Packaging' },
];

const fieldLabel = 'text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4';
const fieldInput = 'w-full bg-transparent border-0 border-b border-line py-3 text-lg font-serif text-fg focus:outline-none focus:border-moss transition-colors placeholder:text-ink-subtle placeholder:font-sans placeholder:text-[15px]';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [sent, setSent] = useState(false);

  const { notify, openBooking } = useSiteChrome();
  const sendMessage = useSendContactMessage();

  useEffect(() => {
    document.title = 'Contact | 31&Rooted';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify('Add your name, email and a message so we can reply.');
      return;
    }

    sendMessage.mutate(
      {
        data: {
          name,
          email,
          ...(subject.trim() ? { subject } : {}),
          message,
          ...(website ? { website } : {}),
        },
      },
      {
        onSuccess: () => setSent(true),
        onError: (error) =>
          notify(errorMessage(error, 'That did not send. Please check your details and try again.')),
      },
    );
  };

  const startAgain = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setWebsite('');
    setSent(false);
  };

  return (
    <main className="flex-1 pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">

        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">Contact</span>
          <h1 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
            Say what you need.<br /><em className="italic text-rust">We will meet you there.</em>
          </h1>
          <p className="text-[16px] text-ink-muted leading-relaxed">
            Whether it is a retreat, a conversation, meal support, or a question you have not quite worded yet — write to us here and we will reply by email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-8 lg:gap-x-16">

          <aside className="min-w-0 md:col-span-5 order-2 md:order-1">
            <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle mb-8 block font-medium">Or start with a specific request</span>
            <div className="border-t border-line">
              {DOORWAYS.map((doorway) => (
                <button
                  key={doorway.label}
                  onClick={() => openBooking(doorway.booking)}
                  className="w-full text-left group py-7 border-b border-line hover:text-rust transition-colors"
                  data-testid={`button-contact-${doorway.booking.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="font-serif text-2xl text-fg group-hover:text-rust transition-colors block mb-2">{doorway.label}</span>
                  <span className="text-[14px] text-ink-muted leading-relaxed block pr-8">{doorway.description}</span>
                </button>
              ))}
            </div>

            <div className="mt-12">
              <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle mb-6 block font-medium">Reach us directly</span>
              <div className="flex flex-col gap-5">
                <a href={`mailto:${CONTACT.email}`} className="inline-block py-1 font-serif text-xl text-fg hover:text-rust transition-colors w-fit" data-testid="link-contact-email">
                  {CONTACT.email}
                </a>
                <a href={CONTACT.phoneHref} className="inline-block py-1 font-serif text-xl text-fg hover:text-rust transition-colors w-fit" data-testid="link-contact-phone">
                  {CONTACT.phone}
                </a>
              </div>
            </div>

            <div className="mt-12">
              <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle mb-6 block font-medium">Find us elsewhere</span>
              <SocialLinks variant="list" />
            </div>
          </aside>

          <div className="min-w-0 md:col-span-7 order-1 md:order-2">
            {sent ? (
              <div className="border border-line p-8 md:p-14 animate-in fade-in zoom-in-95 duration-500" data-testid="status-contact-sent">
                <div className="w-16 h-16 rounded-full bg-moss text-bg flex items-center justify-center mb-8">
                  <Check size={24} strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-3xl text-fg mb-6">Thank you. Your message is with us.</h2>
                <p className="text-[15px] text-ink-muted leading-relaxed max-w-md mb-10">
                  We will reply at {email.trim()}. Messages are read and answered by hand, so give us a little time.
                </p>
                <button onClick={startAgain} className="text-[10px] tracking-[0.2em] uppercase border-b border-line pb-1 hover:border-moss hover:text-moss transition-colors text-ink-muted" data-testid="button-contact-again">
                  Send another message
                </button>
              </div>
            ) : (
              <form className="border border-line p-8 md:p-14 space-y-10" onSubmit={handleSubmit} data-testid="form-contact">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <label className="block">
                    <span className={fieldLabel}>Your name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Doe" className={fieldInput} data-testid="input-contact-name" />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>Email address</span>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@example.com" className={fieldInput} data-testid="input-contact-email" />
                  </label>
                </div>

                <label className="block">
                  <span className={fieldLabel}>Subject <span className="normal-case tracking-normal text-ink-subtle">(optional)</span></span>
                  <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="About the next retreat" className={fieldInput} data-testid="input-contact-subject" />
                </label>

                <label className="block">
                  <span className={fieldLabel}>Your message</span>
                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} placeholder="Tell us what you are carrying, or what you would like to know." className="w-full bg-transparent border-0 border-b border-line py-3 text-[16px] leading-relaxed text-fg focus:outline-none focus:border-moss transition-colors placeholder:text-ink-subtle resize-none" data-testid="input-contact-message" />
                </label>

                <HoneypotField value={website} onChange={setWebsite} />

                <div className="pt-2">
                  <button type="submit" disabled={sendMessage.isPending} className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors disabled:opacity-40" data-testid="button-contact-submit">
                    {sendMessage.isPending ? 'Sending…' : 'Send message'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
