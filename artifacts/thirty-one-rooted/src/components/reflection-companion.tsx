import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { Link } from 'wouter';
import { createReflection, type ReflectionReply, type ReflectionTurn } from '@workspace/api-client-react';

import { ReflectionSketch } from '@/components/reflection-sketch';
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

/** Beyond this the box stops growing and scrolls itself. Roughly twelve lines. */
const COMPOSER_MAX_HEIGHT = 320;

export function ReflectionCompanion({ openBooking }: { openBooking: (service: string) => void }) {
  const [framework, setFramework] = useState<(typeof FRAMEWORKS)[number] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  /** Set when the API says the companion is unavailable; we then run the script. */
  const [offline, setOffline] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);

  const composerRef = useRef<HTMLTextAreaElement>(null);
  const latestPromptRef = useRef<HTMLDivElement>(null);
  /** Only steer the page after a reply arrives, never on an ordinary re-render. */
  const shouldSettle = useRef(false);

  const guideCount = messages.filter((message) => message.role === 'guide').length;

  // A new prompt has landed: bring it into view and put the cursor where the
  // answer goes. preventScroll because focus() would fight scrollIntoView.
  useEffect(() => {
    if (!shouldSettle.current) return;
    shouldSettle.current = false;
    latestPromptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    composerRef.current?.focus({ preventScroll: true });
  }, [guideCount]);

  const growComposer = useCallback(() => {
    const el = composerRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`;
  }, []);

  useEffect(growComposer, [input, growComposer]);

  const toTurns = (list: Message[]): ReflectionTurn[] =>
    list.map((message) => ({ role: message.role, text: message.reply }));

  const advance = async (current: Message[], chosen: (typeof FRAMEWORKS)[number], useScript: boolean) => {
    if (useScript) {
      const step = current.filter((m) => m.role === 'guide').length;
      const text = chosen.script[Math.min(step, chosen.script.length - 1)];
      shouldSettle.current = true;
      setMessages([...current, { id: makeId(), role: 'guide', reply: text, closing: step >= chosen.script.length - 1, care: false }]);
      setScriptStep(step);
      return;
    }

    setPending(true);
    setError('');
    try {
      const reply = await createReflection({ framework: chosen.id, turns: toTurns(current) });
      shouldSettle.current = true;
      setMessages([...current, { ...reply, id: makeId(), role: 'guide' }]);
    } catch (cause) {
      const status = (cause as { status?: number }).status;
      if (status === 503) {
        // No companion configured — fall back to the offline reflection.
        setOffline(true);
        const text = chosen.script[0];
        shouldSettle.current = true;
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

  // Enter belongs to the paragraph being written; the modifier sends.
  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      send(event as unknown as FormEvent);
    }
  };

  const lastGuide = [...messages].reverse().find((m): m is GuideMessage => m.role === 'guide');
  const finished = Boolean(lastGuide?.closing) || (offline && framework ? scriptStep >= framework.script.length - 1 : false);
  const needsCare = Boolean(lastGuide?.care);

  if (!framework) {
    return (
      <div className="reflection-panel">
        <ReflectionSketch />
        <div className="max-w-2xl">
          <h3 className="font-serif text-3xl md:text-4xl mb-5 text-fg">Guided Reflection</h3>
          <p className="text-[16px] text-ink-muted leading-relaxed">
            A quiet space to notice, name, and hold what you are carrying, grounded in scripture and open to what is
            simply true about being human. A short exchange: write as much or as little as you like.
          </p>
        </div>

        {/* Four ways in, as a contents page rather than four boxes. One column
            at every width, so nothing is squashed on a phone. */}
        <ul className="reflection-ways">
          {FRAMEWORKS.map((option, index) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => begin(option)}
                className="reflection-way"
                data-testid={`btn-framework-${option.id}`}
              >
                <span className="reflection-way-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="reflection-way-text">
                  <span className="reflection-way-title">{option.title}</span>
                  <span className="reflection-way-blurb">{option.blurb}</span>
                </span>
                <span className="reflection-way-mark" aria-hidden="true">&#8594;</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-12 pt-8 border-t border-line flex flex-col gap-5 max-w-2xl">
          <p className="text-[14px] text-ink-subtle leading-relaxed">
            Nothing you write is saved. It stays in this tab and is gone when you close it. What you write is sent to our
            AI provider only to generate the reply. There is{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-rust transition-colors">more in our privacy notice</Link>.
            It is a companion for reflection, not clinical care or crisis support.
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle">
            Looking for the full printable workbooks?{' '}
            <Link href="/contact" className="text-rust hover:text-fg transition-colors border-b border-rust pb-0.5" data-testid="link-workbooks-contact">Ask us about them</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reflection-panel">
      <div className="flex justify-between items-baseline pb-6 mb-10 border-b border-line">
        <h3 className="font-serif text-2xl md:text-3xl text-fg">{framework.title}</h3>
        <button onClick={reset} className="py-2 text-[10px] tracking-[0.2em] uppercase text-ink-subtle hover:text-rust flex items-center gap-2 transition-colors" data-testid="btn-reset-chat">
          <RotateCcw size={13} strokeWidth={1.5} /> Start over
        </button>
      </div>

      {/* The exchange runs down the page. No fixed height and no inner scroll
          area: a reflection is read, not scrolled back through, and nesting a
          scroller inside a scrolling page traps a phone's gestures. */}
      <div className="reflection-exchange" aria-live="polite">
        {messages.map((message, index) =>
          message.role === 'seeker' ? (
            <div key={message.id} className="reflection-said">
              <span className="reflection-said-label">You wrote</span>
              <p>{message.reply}</p>
            </div>
          ) : (
            <div
              key={message.id}
              className="reflection-turn"
              ref={index === messages.length - 1 ? latestPromptRef : undefined}
            >
              <p className="reflection-prompt">{message.reply}</p>

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
      </div>

      {needsCare && (
        <div className="care-note mt-10" role="note" data-testid="reflection-care">
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

      {error && <p className="mt-8 text-[14px] text-rust" data-testid="reflection-error">{error}</p>}

      {!finished ? (
        <form className="reflection-composer" onSubmit={send}>
          <label htmlFor="reflection-input" className="reflection-composer-label">
            Your answer
          </label>
          <textarea
            id="reflection-input"
            ref={composerRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onComposerKeyDown}
            placeholder="Take your time…"
            rows={3}
            disabled={pending}
            className="reflection-composer-field"
            data-testid="input-chat"
          />
          <div className="reflection-composer-actions">
            <p className="reflection-composer-hint">Nothing here is saved.</p>
            <button
              type="submit"
              disabled={!input.trim() || pending}
              className="reflection-composer-send"
              data-testid="btn-send-chat"
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-12 pt-8 border-t border-line flex flex-wrap items-center gap-x-8 gap-y-5">
          <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Conversation')} data-testid="btn-book-from-chat">
            Book a deeper conversation
          </button>
          <button onClick={reset} className="py-2 text-[10px] tracking-[0.2em] uppercase text-ink-subtle hover:text-rust transition-colors border-b border-line">
            Begin another reflection
          </button>
        </div>
      )}
    </div>
  );
}
