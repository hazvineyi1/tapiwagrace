import { useEffect } from 'react';

import { CONTACT } from '@/lib/contact';
import { DEPOSIT_GBP } from '@/lib/retreats';

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'Who these terms are between',
    body: [
      `These booking conditions are between you and 31 & Rooted, founded by Tapiwanashe Grace Pereira and based in the United Kingdom. They apply when you book a retreat with us. You can reach us at ${CONTACT.email} or ${CONTACT.phone}.`,
    ],
  },
  {
    heading: 'Making a booking',
    body: [
      'Sending an enquiry through this site does not create a booking and does not hold a place. We will write back to confirm whether there is room, what the total cost is, and what the dates are.',
      `Your place is held once we have confirmed it in writing and received your £${DEPOSIT_GBP} deposit. At that point a contract exists between us on these terms.`,
    ],
  },
  {
    heading: 'Prices and what they include',
    body: [
      'Prices are per person and are shown on the retreat page. They include accommodation for the nights listed, all meals, all teaching and sessions, the printed workbooks, and airport transfers on arrival and departure.',
      'They do not include flights, travel insurance, optional treatments such as hammam and massage, or anything you buy for yourself while you are there.',
      'The price we confirm in writing is the price you pay. If our costs change after that, we absorb it.',
    ],
  },
  {
    heading: 'Paying',
    body: [
      `A £${DEPOSIT_GBP} deposit secures your place. The balance is due eight weeks before the retreat begins.`,
      'If you book within eight weeks of the start date, the full amount is due when you book.',
      'If the balance is not paid by the due date we will chase you before doing anything else. If it remains unpaid we may treat the booking as cancelled by you, and the cancellation terms below will apply.',
      'If paying in one go is what stands between you and coming, ask us about instalments. We would rather find a way.',
    ],
  },
  {
    heading: 'If you need to cancel',
    body: [
      'Tell us as soon as you know, in writing. The date we receive your message is the date we use.',
      `The deposit is non-refundable, because it is spent on holding the house from the moment you book. Beyond that: cancel more than eight weeks before the start and you owe nothing further; between four and eight weeks before, half the total is due; less than four weeks before, the full amount is due.`,
      'If we are able to fill your place we will refund what we recover, less the deposit. We will always try.',
      'You may transfer your place to another woman at any point up to two weeks before the retreat, at no charge, as long as we have her details and she accepts these terms.',
      'Because a retreat is a leisure service provided on specific dates, the fourteen-day cancellation right that applies to most online purchases does not apply here. Your rights under these terms are set out above.',
    ],
  },
  {
    heading: 'If we have to cancel or change something',
    body: [
      'If we cancel a retreat for any reason other than your own conduct, you choose: a full refund of everything you have paid us, including the deposit, or a place on the next retreat.',
      'We cannot refund what you have spent elsewhere — flights above all — which is why we ask every guest to hold travel insurance before booking anything.',
      'Small changes happen: a session moves, an excursion is swapped, a room is reallocated. We will tell you. If we have to make a significant change to the dates or the destination before you travel, you may cancel and take a full refund instead.',
    ],
  },
  {
    heading: 'Travel insurance',
    body: [
      'We ask every guest to hold travel insurance that covers cancellation, medical treatment and repatriation for the whole trip, and to have it in place before booking flights. Please make sure it covers any condition you already have.',
    ],
  },
  {
    heading: 'Passports, visas and health',
    body: [
      'Making sure your passport, visas and vaccinations are in order for the destination is your responsibility. We will tell you what we understand to be required, but requirements depend on your own nationality and can change, and we cannot check them for you.',
      'If you cannot travel because your documents are not in order, the cancellation terms above apply.',
    ],
  },
  {
    heading: 'Your wellbeing while you are with us',
    body: [
      'Please tell us on booking about any medical condition, mobility need, allergy or dietary requirement, so we can be honest with you about whether the retreat will suit you and make what arrangements we can.',
      'A retreat is a space for reflection, prayer and rest. It is not clinical care, therapy, or crisis support, and nothing offered on it is a substitute for medical advice.',
    ],
  },
  {
    heading: 'Being together',
    body: [
      'What is shared in a session stays in that room. We ask everyone to hold that.',
      'In the rare case that someone’s behaviour puts others at risk or makes the retreat untenable for the rest of the group, we may ask them to leave. No refund would be due, and travel home would be at their own cost.',
    ],
  },
  {
    heading: 'Our responsibility to you',
    body: [
      'We will provide the retreat with reasonable care and skill, and we are responsible for loss or damage you suffer as a foreseeable result of our breaking these terms or failing to use that care.',
      'We are not responsible for events outside our reasonable control, or for the acts of independent suppliers you contract with yourself, such as your airline.',
      'Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that cannot lawfully be limited. Your statutory rights as a consumer are not affected.',
    ],
  },
  {
    heading: 'If something goes wrong',
    body: [
      'Tell us while you are still with us if at all possible, so we have the chance to put it right there and then. If that is not possible, or it is not resolved, write to us within twenty-eight days of coming home and we will respond properly.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you live in Scotland or Northern Ireland you may also bring proceedings in your own courts.',
    ],
  },
];

export default function Terms() {
  useEffect(() => {
    document.title = 'Booking terms | 31&Rooted';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex-1 pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">Booking terms</span>
        <h1 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
          What you can expect, and <em className="italic text-rust">what we ask.</em>
        </h1>
        <p className="text-[16px] text-ink-muted leading-relaxed mb-4">
          Plainly: a deposit holds your place, the balance is due eight weeks before, and if we ever cancel on you, you
          get everything back.
        </p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle mb-16">Last updated 28 August 2026</p>

        <div className="flex flex-col gap-14">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[1.6rem] md:text-[1.9rem] leading-tight text-fg mb-5 pb-4 border-b border-line">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-[16px] leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-line">
          <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle block mb-4">Anything here you want explained</span>
          <a href={`mailto:${CONTACT.email}`} className="inline-block py-1 font-serif text-xl text-fg hover:text-rust transition-colors" data-testid="link-terms-email">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </main>
  );
}
