import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, RotateCcw, Send } from 'lucide-react';
import { Link } from 'wouter';

const FRAMEWORKS = {
  reframing: {
    id: 'reframing',
    title: 'Cognitive Reframing',
    steps: [
      "Let's begin. What thought or emotion feels most present for you right now?",
      "If you look closely, what is the root or fear beneath that thought?",
      "How might you reframe this toward a truer story? Is there an anchor verse or prayer that could ground you here?",
      "Thank you for noticing that. Take this reframe with you today, and return whenever you need to quiet the noise."
    ]
  },
  breakthrough: {
    id: 'breakthrough',
    title: 'Breakthrough',
    steps: [
      "Let's begin. What pattern or feeling feels stuck or heavy right now?",
      "What lie might be keeping that pattern in place?",
      "What truth can replace that lie? How can you take this thought captive today?",
      "What is one small, faithful action you can choose to walk in that truth?",
      "Thank you for naming that. A breakthrough is often just a series of small, faithful steps. Hold onto your truth today."
    ]
  },
  calling: {
    id: 'calling',
    title: 'Calling',
    steps: [
      "Let's begin. In this season, what feels like it is truly yours to carry?",
      "And what feels like it is time to release or lay down?",
      "What is one simple practice that could help you walk steadily in this calling?",
      "Thank you for sharing. Remember that calling is about faithfulness where you are planted. Go in peace today."
    ]
  }
};

type Message = { id: string; role: 'guide' | 'user'; text: string };

export function SocraticCompanion({ openBooking }: { openBooking: (service: string) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeFramework = activeId ? FRAMEWORKS[activeId as keyof typeof FRAMEWORKS] : null;

  const startFramework = (id: string) => {
    setActiveId(id);
    const fw = FRAMEWORKS[id as keyof typeof FRAMEWORKS];
    setMessages([{ id: Date.now().toString(), role: 'guide', text: fw.steps[0] }]);
    setStepIndex(0);
    setInput('');
  };

  const reset = () => {
    setActiveId(null);
    setMessages([]);
    setStepIndex(0);
    setInput('');
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeFramework) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    const nextStep = stepIndex + 1;
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    if (nextStep < activeFramework.steps.length) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { id: (Date.now() + 1).toString(), role: 'guide', text: activeFramework.steps[nextStep] }
        ]);
        setStepIndex(nextStep);
      }, 600);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isFinished = activeFramework && stepIndex >= activeFramework.steps.length - 1;

  return (
    <div className="border border-line bg-bg p-8 md:p-14">
      {!activeFramework ? (
        <div className="flex flex-col gap-12">
          <div className="max-w-2xl">
            <h3 className="font-serif text-3xl mb-4 text-fg">Guided Reflection</h3>
            <p className="text-[16px] text-fg/70 leading-relaxed">A quiet space to notice, name, and reframe what you are carrying. Please note this is a gentle companion for reflection, not clinical care or crisis support.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(FRAMEWORKS).map(fw => (
              <button 
                key={fw.id} 
                onClick={() => startFramework(fw.id)} 
                className="text-left p-8 border border-line bg-transparent hover:border-moss hover:bg-moss/5 transition-all group flex flex-col justify-between h-48"
                data-testid={`btn-framework-${fw.id}`}
              >
                <h4 className="font-serif text-[1.35rem] leading-tight text-fg group-hover:text-moss transition-colors">{fw.title}</h4>
                <div className="self-end text-line group-hover:text-moss transition-colors">
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </div>
              </button>
            ))}
          </div>
          <div className="pt-8 border-t border-line text-[10px] tracking-[0.2em] uppercase text-fg/50">
            Looking for full printable workbooks? <Link href="/contact" className="text-rust hover:text-fg transition-colors border-b border-rust pb-0.5" data-testid="link-workbooks-contact">Ask us about them</Link>.
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[500px]">
          <div className="flex justify-between items-center pb-6 mb-6 border-b border-line">
            <h4 className="font-serif text-3xl text-fg">{activeFramework.title}</h4>
            <button onClick={reset} className="text-[10px] tracking-[0.2em] uppercase text-fg/50 hover:text-rust flex items-center gap-2 transition-colors" data-testid="btn-reset-chat">
              <RotateCcw size={14} strokeWidth={1.5} /> Start over
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col gap-8 pr-4 mb-6" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'guide' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-6 text-[16px] leading-relaxed ${m.role === 'guide' ? 'bg-[#EAE6DE] text-fg' : 'bg-fg text-bg'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!isFinished ? (
            <form className="flex gap-4 pt-6 border-t border-line" onSubmit={handleSend}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reflection here..."
                className="flex-1 bg-transparent border-0 border-b border-line py-3 text-[16px] focus:outline-none focus:border-moss transition-colors placeholder:text-fg/30"
                data-testid="input-chat"
              />
              <button type="submit" disabled={!input.trim()} className="w-12 h-12 flex items-center justify-center bg-fg text-bg hover:bg-moss disabled:opacity-30 transition-colors" data-testid="btn-send-chat">
                <Send size={16} strokeWidth={1.5} />
              </button>
            </form>
          ) : (
            <div className="pt-6 border-t border-line text-center">
              <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" onClick={() => openBooking('Conversation')} data-testid="btn-book-from-chat">
                Book a deeper conversation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
