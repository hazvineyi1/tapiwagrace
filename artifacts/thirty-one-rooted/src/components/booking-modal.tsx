import { useState } from 'react';
import { Check, ChevronLeft, X } from 'lucide-react';
import { useCreateBooking } from '@workspace/api-client-react';

import { HoneypotField } from '@/components/honeypot-field';

import { BOOKING_KINDS, errorMessage, formatUkDate, isBookingLabel, todayIso, type BookingLabel } from '@/lib/site-nav';

const TIME_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

export function BookingModal({
  initialKind,
  onClose,
  onNotify,
}: {
  initialKind: BookingLabel;
  onClose: () => void;
  onNotify: (message: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<BookingLabel>(initialKind);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [complete, setComplete] = useState(false);

  const createBooking = useCreateBooking();
  const isMeal = kind === 'Meal Packaging';

  const proceed = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (!name.trim() || !email.trim()) {
      onNotify('Add your name and email so we can hold your place.');
      return;
    }

    createBooking.mutate(
      {
        data: {
          kind: BOOKING_KINDS[kind],
          name,
          email,
          ...(date ? { preferredDate: date } : {}),
          preferredTime: time,
          ...(message.trim() ? { message } : {}),
          ...(website ? { website } : {}),
        },
      },
      {
        onSuccess: () => setComplete(true),
        onError: (error) =>
          onNotify(errorMessage(error, 'That did not send. Please check your details and try again.')),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-fg/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="bg-bg text-fg w-full max-w-xl p-8 md:p-14 relative max-h-[90vh] overflow-y-auto shadow-2xl modal-animate" role="dialog" aria-modal="true" aria-labelledby="booking-title" data-testid="dialog-booking">
        <button className="absolute top-6 right-6 p-2 text-ink-subtle hover:text-rust transition-colors" onClick={onClose} aria-label="Close booking" data-testid="button-booking-close"><X size={20} strokeWidth={1.5} /></button>

        <div className="mb-10">
          <span className="text-[10px] tracking-[0.2em] uppercase text-rust block mb-4 font-medium">Make room for this</span>
          <h2 id="booking-title" className="font-serif text-3xl md:text-4xl text-fg">
            {complete ? (isMeal ? 'Your meal enquiry is on its way.' : 'Your enquiry is with us.') : (isMeal ? 'Enquire about the meal programme' : 'Book a space')}
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
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">What are you making room for?</span>
                  <select value={kind} onChange={(event) => isBookingLabel(event.target.value) && setKind(event.target.value)} className="w-full bg-transparent border-0 border-b border-line py-4 text-xl font-serif text-fg focus:ring-0 focus:border-moss transition-colors" data-testid="select-booking-kind">
                    <option value="Retreat">Retreat · Pricing varies</option>
                    <option value="Conversation">Conversation · £95</option>
                    <option value="Meal Packaging">Meal Packaging · paid programme</option>
                  </select>
                </label>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8 border-y border-line">
                  <span className="text-[14px] text-ink-muted max-w-[280px] leading-relaxed">
                    {isMeal ? 'Nourishing meals prepared and coordinated for delivery. Cost depends on meal count and delivery needs.' : kind === 'Retreat' ? 'Details shared after enquiry. Includes a confirmation and preparation guide.' : 'Includes a confirmation, preparation guide, and a space held with care.'}
                  </span>
                  <strong className="font-serif text-3xl font-normal text-moss">
                    {kind === 'Retreat' ? 'Pricing varies' : kind === 'Conversation' ? '£95' : 'Cost per meal'}
                  </strong>
                </div>

                <p className="text-[14px] text-ink-subtle leading-relaxed">
                  {isMeal ? 'Tell us how many meals are needed, who they are for, and where delivery may be needed. We will follow up with availability and the paid per-meal cost.' : 'The retreat is a held space for deeper formation. A conversation is a focused one-to-one starting point for the season you are in.'}
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">{isMeal ? 'Preferred delivery date' : 'Preferred date'}</span>
                  <input type="date" value={date} min={todayIso()} onChange={(event) => setDate(event.target.value)} className="w-full bg-transparent border-0 border-b border-line py-4 text-xl font-serif text-fg focus:ring-0 focus:border-moss transition-colors" data-testid="input-booking-date" />
                  <span className="mt-3 block text-[13px] text-ink-subtle leading-relaxed">Dates are confirmed by reply — leave this blank if you are flexible.</span>
                </label>

                <div className="block mt-8">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">{isMeal ? 'Preferred delivery window' : 'Preferred time'}</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => (
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
                    <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">Your name</span>
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Doe" className="w-full bg-transparent border-0 border-b border-line py-3 text-lg font-serif text-fg focus:ring-0 focus:border-moss transition-colors placeholder:text-ink-subtle placeholder:font-sans placeholder:text-[15px]" data-testid="input-booking-name" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">Email address</span>
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@example.com" className="w-full bg-transparent border-0 border-b border-line py-3 text-lg font-serif text-fg focus:ring-0 focus:border-moss transition-colors placeholder:text-ink-subtle placeholder:font-sans placeholder:text-[15px]" data-testid="input-booking-email" />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-ink-muted block mb-4">{isMeal ? 'How many meals, and for whom?' : 'Anything we should know?'}</span>
                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder={isMeal ? 'Six meals a week for my mother, delivered in Borrowdale.' : 'Optional.'} className="w-full bg-transparent border-0 border-b border-line py-3 text-[16px] text-fg focus:ring-0 focus:border-moss transition-colors placeholder:text-ink-subtle resize-none" data-testid="input-booking-message" />
                </label>

                <HoneypotField value={website} onChange={setWebsite} />

                <div className="bg-[#EAE6DE]/50 p-6 text-[14px] text-ink-muted leading-relaxed border border-line">
                  <strong className="text-moss uppercase text-[10px] tracking-[0.2em] block mb-3 font-medium">{kind}</strong>
                  {date ? `${formatUkDate(date)} · ${time}` : `Flexible on dates · ${time}`}<br /><br />
                  {isMeal ? 'We will use this as a starting point for your meal programme enquiry. We will confirm availability, delivery details, and the per-meal cost before anything is scheduled.' : 'We\'ll reply with a confirmation and the details you need next.'}
                </div>
              </div>
            )}

            {step === 3 && (
              <p className="mt-10 text-[13px] leading-relaxed text-ink-subtle">
                Sending this is an enquiry, not a confirmed booking — we reply first. When you do book, our{' '}
                <a href="/terms" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-rust transition-colors">booking terms</a>{' '}
                apply.
              </p>
            )}

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-line">
              {step > 1 ? (
                <button className="text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 text-ink-subtle hover:text-rust transition-colors" onClick={() => setStep(step - 1)} data-testid="button-booking-back">
                  <ChevronLeft size={14} strokeWidth={1.5} /> Back
                </button>
              ) : <span />}
              <button className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors disabled:opacity-40" onClick={proceed} disabled={createBooking.isPending} data-testid="button-booking-next">
                {createBooking.isPending ? 'Sending…' : step === 3 ? (isMeal ? 'Send enquiry' : 'Send my request') : 'Continue'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-moss text-bg mx-auto flex items-center justify-center mb-8">
              <Check size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-3xl mb-6 text-fg">
              {isMeal ? 'We will be in touch about your meals.' : `Thank you, ${name.trim().split(' ')[0] || 'friend'}.`}
            </h3>
            <p className="text-[15px] text-ink-muted leading-relaxed max-w-sm mx-auto mb-10">
              {isMeal ? `Look for a reply at ${email.trim()}. We will follow up with availability, delivery details, and the paid per-meal cost.` : `Your request is recorded and we will reply at ${email.trim()} to confirm. Until then, let the question stay with you: what are you making room for?`}
            </p>
            <button className="text-[10px] tracking-[0.2em] uppercase border-b border-line pb-1 hover:border-moss hover:text-moss transition-colors text-ink-muted" onClick={onClose} data-testid="button-booking-done">Return home</button>
          </div>
        )}
      </div>
    </div>
  );
}
