import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, RotateCcw, Send } from 'lucide-react';
import { Link } from 'wouter';
import { createReflection, type ReflectionReply, type ReflectionTurn } from '@workspace/api-client-react';

import { CONTACT } from '@/lib/contact';

type FrameworkId = 'reframing' | 'breakthrough' | 'calling' | 'open';

const FRAMEWORKS: {
  id: FrameworkId;
  title: string;
  blurb: string;
  /** Used only when the companion is unavailable and we fall back offline. */
  script: string[];
}[] = [
  {
    id: 'reframing',
    title: 'Cognitive Reframing',
    blurb: 'Look again at a thought that has been weighing on you.',
    script: [
      'What thought or emotion feels most present for you right now?',
      'If you look closely, what is the root or fear beneath that thought?',
      'How might you reframe this toward a truer story? Is there an anchor verse or prayer that could ground you here?',
      'Thank you for noticing that. Take this reframe with you today, and return whenever you need to quiet the noise.',
    ],
  },
  {
    id: 'breakthrough',
    title: 'Breakthrough',
    blurb: 'Sit with a pattern that has felt stuck for a while.',
    script: [
      'What pattern or feeling feels stuck or heavy right now?',
      'What lie might be keeping that pattern in place?',
      'What truth can replace that lie? How can you take this thought captive today?',
      'What is one small, faithful action you can choose to walk in that truth?',
      'Thank you for naming that. A breakthrough is often just a series of small, faithful steps.',
    ],
  },
  {
    id: 'calling',
    title: 'Calling',
    blurb: 'Sort what is yours to carry from what you can lay down.',
    script: [
      'In this season, what feels like it is truly yours to carry?',
      'And what feels like it is time to release or lay down?',
      'What is one simple practice that could help you walk steadily in this calling?',
      'Thank you for sharing. Calling is about faithfulness where you are planted. Go in peace today.',
    ],
  },
  {
    id: 'open',
    title: 'Whatever is here',
    blurb: 'No set agenda. Begin wherever you actually are.',
    script: [
      'What is here for you today?',
      'What does that bring up when you sit with it?',
      'What would it look like to be gentle with yourself in this?',
      'Thank you for bringing it into words. Let it rest there for today.',
    ],
  },
];

interface GuideMessage extends ReflectionReply {
  id: string;
  role: 'guide';
}

interface SeekerMessage {
  id: string;
  role: 'seeker';
  reply: string;
}

type Message = GuideMessage | SeekerMessage;

let nextId = 0;
const makeId = () => `m${(nextId += 1)}`;

export function ReflectionCompanion({ openBooking }: { openBooking: (service: string) => void }) {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  /** Set when the API says the companion is unavailable; we then run the script. */
  const [offline, setOffline] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pending]);

  const toTurns = (list: Message[]): ReflectionTurn[] =>
    list.map((message) => ({ role: message.role, text: message.reply }));

  const advance = async (current: Message[], chosen: (typeof FRAMEWORKS)[number], useScript: boolean) => {
    if (useScript) {
      const step = current.filter((m) => m.role === 'guide').length;
      const text = chosen.script[Math.min(step, chosen.script.length - 1)];
      setMessages([...current, { id: makeId(), role: 'guide', reply: text, closing: step >= chosen.script.length - 1, care: false }]);
      setScriptStep(step);
      return;
    }

    setPending(true);
    setError('');
    try {
      const reply = await createReflection({ framework: chosen.id, turns: toTurns(current) });
      setMessages([...current, { ...reply, id: makeId(), role: 'guide' }]);
    } catch (cause) {
      const status = (cause as { status?: number }).status;
      if (status === 503) {
        // No companion configured — fall back to the offline reflection.
        setOffline(true);
        const text = chosen.script[0];
        setMessages([...current, { id: makeId(), role: 'guide', reply: text, closing: false, care: false }]);
        setScriptStep(0);
      } else if (status === 429) {
        setError('That is a lot of reflecting in one sitting. Rest a moment and come back.');
      } else {
        setError('The companion could not respond just now. Try again in a moment.');
      }
    } finally {
      setPending(false);
    }
  };

  const begin = (chosen: (typeof FRAMEWORKS)[number]) => {
    setFramework(chosen);
    setMessages([]);
    setInput('');
    setError('');
    setScriptStep(0);
    void advance([], chosen, offline);
  };

  const reset = () => {
    setFramework(null);
    setMessages([]);
    setInput('');
    setError('');
    setScriptStep(0);
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || !framework || pending) return;
    const next: Message[] = [...messages, { id: makeId(), role: 'seeker', reply: input.trim() }];
    setMessages(next);
    setInput('');
    void advance(next, framework, offline);
  };

  const lastGuide = [...messages].reverse().find((m): m is GuideMessage => m.role === 'guide');
  const finished = Boolean(lastGuide?.closing) || (offline && framework ? scriptStep >= framework.script.length - 1 : false);
  const needsCare = Boolean(lastGuide?.care);

  if (!framework) {
    return (
      <div className="reflection-panel">
        <div className="max-w-2xl">
          <h3 className="font-serif text-3xl md:text-4xl mb-5 text-fg">Guided Reflection</h3>
          <p className="text-[16px] text-ink-muted leading-relaxed">
            A quiet space to notice, name, and hold what you are carrying — grounded in scripture, and open to what is
            simply true about being human. It is a companion for reflection, not clinical care or crisis support.
          </p>
          <p className="mt-4 text-[14px] text-ink-subtle leading-relaxed">
            Your reflection is not saved. It stays in this tab and is gone when you close it. What you write is sent to
            our AI provider only to generate the reply &mdash;{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-rust transition-colors">more in our privacy notice</Link>.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line mt-12">
          {FRAMEWORKS.map((option) => (
            <button
              key={option.id}
              onClick={() => begin(option)}
              className="text-left bg-bg p-8 md:p-10 hover:bg-[#F1EDE4] transition-colors group flex flex-col gap-3 min-h-[11rem] justify-between"
              data-testid={`btn-framework-${option.id}`}
            >
              <div>
                <h4 className="font-serif text-[1.6rem] leading-tight text-fg group-hover:text-moss transition-colors mb-2">{option.title}</h4>
                <p className="text-[14px] text-ink-muted leading-relaxed max-w-[22rem]">{option.blurb}</p>
              </div>
              <span className="self-end text-line group-hover:text-moss transition-colors"><ArrowUpRight size={18} strokeWidth={1.5} /></span>
            </button>
          ))}
        </div>
        <p className="mt-10 pt-8 border-t border-line text-[10px] tracking-[0.2em] uppercase text-ink-subtle">
          Looking for the full printable workbooks?{' '}
          <Link href="/contact" className="text-rust hover:text-fg transition-colors border-b border-rust pb-0.5" data-testid="link-workbooks-contact">Ask us about them</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="reflection-panel flex flex-col">
      <div className="flex justify-between items-baseline pb-6 mb-8 border-b border-line">
        <h3 className="font-serif text-2xl md:text-3xl text-fg">{framework.title}</h3>
        <button onClick={reset} className="py-2 text-[10px] tracking-[0.2em] uppercase text-ink-subtle hover:text-rust flex items-center gap-2 transition-colors" data-testid="btn-reset-chat">
          <RotateCcw size={13} strokeWidth={1.5} /> Start over
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pr-1 md:pr-4 mb-8 min-h-[18rem] max-h-[30rem]" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((message) =>
          message.role === 'seeker' ? (
            <div key={message.id} className="flex justify-end">
              <p className="max-w-[85%] bg-fg text-bg px-6 py-4 text-[15px] leading-relaxed">{message.reply}</p>
            </div>
          ) : (
            <div key={message.id} className="flex flex-col gap-5 max-w-[92%]">
              <p className="text-[17px] md:text-[18px] leading-[1.7] text-fg">{message.reply}</p>

              {message.scripture && (
                <figure className="scripture-anchor" data-testid="reflection-scripture">
                  <blockquote className="font-serif italic text-[1.35rem] md:text-[1.5rem] leading-[1.45] text-moss">{message.scripture.text}</blockquote>
                  <figcaption className="mt-3 text-[10px] tracking-[0.2em] uppercase text-rust">{message.scripture.reference}</figcaption>
                </figure>
              )}

              {message.voice && (
                <div className="voice-note" data-testid="reflection-voice">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle block mb-2">In the spirit of {message.voice.thinker}</span>
                  <p className="text-[15px] leading-relaxed text-ink-muted">{message.voice.insight}</p>
                </div>
              )}

              {message.invitation && (
                <div className="invitation-note" data-testid="reflection-invitation">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-moss block mb-2">A small practice</span>
                  <p className="text-[15px] leading-relaxed text-ink-muted">{message.invitation}</p>
                </div>
              )}
            </div>
          ),
        )}

        {pending && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle" data-testid="reflection-pending">Listening…</p>
        )}
        <div ref={endRef} />
      </div>

      {needsCare && (
        <div className="care-note mb-8" role="note" data-testid="reflection-care">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust block mb-3">Please reach someone real</span>
          <p className="text-[15px] leading-relaxed text-ink-muted mb-4">
            What you are carrying deserves more than a page can give. Please talk to someone you trust, your doctor, or your
            local emergency services. If it would help to hear from us directly, we are here.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            <a href={`mailto:${CONTACT.email}`} className="text-rust hover:text-fg transition-colors border-b border-rust/40 pb-0.5">{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="text-rust hover:text-fg transition-colors border-b border-rust/40 pb-0.5">{CONTACT.phone}</a>
          </div>
        </div>
      )}

      {error && <p className="mb-6 text-[14px] text-rust" data-testid="reflection-error">{error}</p>}

      {!finished ? (
        <form className="flex gap-4 pt-6 border-t border-line" onSubmit={send}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Take your time…"
            disabled={pending}
            className="flex-1 bg-transparent border-0 border-b border-line py-3 text-[16px] focus:outline-none focus:border-moss transition-colors placeholder:text-ink-subtle disabled:opacity-50"
            data-testid="input-chat"
          />
          <button type="submit" disabled={!input.trim() || pending} className="w-12 h-12 flex items-center justify-center bg-fg text-bg hover:bg-moss disabled:opacity-30 transition-colors" aria-label="Send reflection" data-testid="btn-send-chat">
            <Send size={16} strokeWidth={1.5} />
          </button>
        </form>
      ) : (
        <div className="pt-8 border-t border-line flex flex-wrap items-center gap-8">
          <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Conversation')} data-testid="btn-book-from-chat">
            Book a deeper conversation
          </button>
          <button onClick={reset} className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle hover:text-rust transition-colors border-b border-line pb-1">
            Begin another reflection
          </button>
        </div>
      )}
    </div>
  );
}
