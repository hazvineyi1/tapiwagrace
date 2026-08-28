import { useEffect } from 'react';

import { CONTACT } from '@/lib/contact';

const SECTIONS = [
  {
    heading: 'Who we are',
    body: [
      '31 & Rooted is a Christ-centred community for women, founded by Tapiwanashe Grace Pereira and based in the United Kingdom. We are the data controller for the information described here.',
      `You can reach us at ${CONTACT.email} or ${CONTACT.phone}.`,
    ],
  },
  {
    heading: 'What we collect, and why',
    body: [
      'When you book a retreat, a conversation or the meal programme, we record your name, email address, any preferred date and time, and anything you write in the message field. We use it to reply to you and arrange what you have asked for. Our lawful basis is taking steps at your request before entering into an arrangement, and our legitimate interest in responding to enquiries.',
      'When you write to us through the contact form, we record your name, email address, subject and message, and use them to reply. Our lawful basis is our legitimate interest in answering people who contact us.',
      'When you join the mailing list, we record your email address and use it to send you occasional notes. Our lawful basis is your consent, and you can withdraw it at any time by emailing us.',
    ],
  },
  {
    heading: 'The guided reflection',
    body: [
      'What you type into the guided reflection is sent to Anthropic, our AI provider, so that a reply can be generated. It is processed to produce that reply and is not used to train their models.',
      'We do not store your reflection. It lives only in your browser while the page is open, and it is gone when you close the tab. We cannot read it, and it is never written to our database.',
      'It is a companion for reflection, not clinical care or crisis support. Please do not share anything you would not want processed by a third-party provider, and if you are in crisis please contact your GP, a trusted person, or the emergency services.',
    ],
  },
  {
    heading: 'Keeping the forms usable',
    body: [
      'To stop automated submissions flooding the forms, we record that a submission happened alongside a one-way hash of the sender’s IP address. We never store the address itself, and the hash cannot be turned back into one. These records are deleted after 24 hours.',
      'Our lawful basis is our legitimate interest in keeping the site working for the people it is for.',
    ],
  },
  {
    heading: 'Cookies and tracking',
    body: [
      'This site sets no cookies. There is no analytics, no advertising, and no third-party tracking of any kind. That is why you are not being asked to accept anything.',
    ],
  },
  {
    heading: 'Who else handles your information',
    body: [
      'Our hosting provider stores the site and its database on our behalf. Our email provider delivers the notification that tells us an enquiry has arrived. Anthropic processes guided-reflection messages as described above. We do not sell your information, and we do not share it for marketing.',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'We keep enquiries and messages while we are in contact with you and for a reasonable period afterwards, so we have a record of what was arranged. We keep your email address on the mailing list until you ask us to remove it.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'Under UK data protection law you can ask us for a copy of the information we hold about you, ask us to correct it or delete it, object to how we are using it, ask us to restrict its use, or withdraw consent you have given. Email us and we will respond within one month.',
      'If you are unhappy with how we have handled your information you can complain to the Information Commissioner’s Office at ico.org.uk, or by calling 0303 123 1113.',
    ],
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy | 31&Rooted';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1 pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-6 block font-medium">Privacy</span>
        <h1 className="text-[2.6rem] md:text-[3.6rem] leading-[1.1] text-fg mb-8">
          What we do with <em className="italic text-rust">what you tell us.</em>
        </h1>
        <p className="text-[16px] text-ink-muted leading-relaxed mb-4">
          Plainly: we only collect what we need in order to reply to you, we do not track you, and we do not keep your
          reflections.
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
          <span className="text-[10px] tracking-[0.2em] uppercase text-ink-subtle block mb-4">Questions about any of this</span>
          <a href={`mailto:${CONTACT.email}`} className="inline-block py-1 font-serif text-xl text-fg hover:text-rust transition-colors" data-testid="link-privacy-email">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </main>
  );
}
