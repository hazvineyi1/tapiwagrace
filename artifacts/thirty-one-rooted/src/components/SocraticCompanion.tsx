import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, RotateCcw, Send } from 'lucide-react';

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
    <div className="socratic-container">
      {!activeFramework ? (
        <div className="socratic-choosers">
          <div className="socratic-intro">
            <h3>Guided Reflection</h3>
            <p>A quiet space to notice, name, and reframe what you are carrying. Please note this is a gentle companion for reflection, not clinical care or crisis support.</p>
          </div>
          <div className="socratic-grid">
            {Object.values(FRAMEWORKS).map(fw => (
              <button 
                key={fw.id} 
                onClick={() => startFramework(fw.id)} 
                className="socratic-card"
                data-testid={`btn-framework-${fw.id}`}
              >
                <h4>{fw.title}</h4>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <div className="socratic-purchase-note">
            <p>Looking for the full printable workbooks? <a href="https://wa.me/?text=I'd%20love%20to%20purchase%20the%20full%20guided%20workbooks." target="_blank" rel="noreferrer">Purchase the complete process via WhatsApp</a>.</p>
          </div>
        </div>
      ) : (
        <div className="socratic-chat">
          <div className="socratic-chat-header">
            <h4>{activeFramework.title}</h4>
            <button onClick={reset} className="button-icon" aria-label="Reset reflection" data-testid="btn-reset-chat"><RotateCcw size={14} /> Start over</button>
          </div>
          
          <div className="socratic-messages">
            {messages.map((m) => (
              <div key={m.id} className={`socratic-msg ${m.role}`}>
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!isFinished ? (
            <form className="socratic-input-area" onSubmit={handleSend}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reflection here..."
                className="socratic-input"
                data-testid="input-chat"
              />
              <button type="submit" className="button-icon" disabled={!input.trim()} aria-label="Send message" data-testid="btn-send-chat">
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div className="socratic-finished">
              <button className="button-primary" onClick={() => openBooking('Conversation')} data-testid="btn-book-from-chat">
                Book a deeper conversation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}