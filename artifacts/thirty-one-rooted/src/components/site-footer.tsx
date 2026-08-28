import { useState, type FormEvent } from 'react';
import { MoveRight } from 'lucide-react';
import { Link } from 'wouter';
import { useSubscribeToNewsletter } from '@workspace/api-client-react';

import { useSiteChrome } from '@/components/site-chrome';
import { SocialLinks } from '@/components/social-links';
import { CONTACT } from '@/lib/contact';
import { errorMessage } from '@/lib/site-nav';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const { notify, openBooking } = useSiteChrome();
  const subscribe = useSubscribeToNewsletter();

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      notify('Add your email so we know where to send the next note.');
      return;
    }

    subscribe.mutate(
      { data: { email } },
      {
        onSuccess: (result) => {
          setEmail('');
          notify(
            result.alreadySubscribed
              ? 'You are already on the list. A note for the becoming will find you soon.'
              : 'You are on the list. A note for the becoming will find you soon.',
          );
        },
        onError: (error) =>
          notify(errorMessage(error, 'That email did not go through. Please check it and try again.')),
      },
    );
  };

  return (
    <footer className="bg-fg text-bg pt-24 pb-12 px-6 md:px-12 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pb-20 border-b border-bg/10">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-sand mb-6 block font-medium">The next faithful step</span>
            <h2 className="text-4xl md:text-5xl leading-tight font-serif">Come as you are.<br/><em className="italic text-sand">Stay for the becoming.</em></h2>
          </div>

          <div className="flex flex-col justify-end">
            <form className="flex items-end gap-4 w-full" onSubmit={handleNewsletter}>
              <div className="flex-1">
                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-bg/50 mb-4">A note for the woman becoming</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-0 border-b border-bg/20 py-3 text-base text-bg focus:outline-none focus:border-sand transition-colors placeholder:text-bg/60 rounded-none"
                  data-testid="input-newsletter-email"
                />
              </div>
              <button type="submit" disabled={subscribe.isPending} className="w-12 h-12 flex items-center justify-center bg-bg text-fg hover:bg-sand transition-colors disabled:opacity-40" aria-label="Join the 31 and Rooted list" data-testid="button-newsletter-submit">
                <MoveRight size={16} strokeWidth={1.5} />
              </button>
            </form>
            <p className="mt-5 text-[11px] leading-relaxed text-bg/60 max-w-md">
              We will only use your address to send you occasional notes from 31 &amp; Rooted, and never pass it on.
              Unsubscribe whenever you like. See our{' '}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-sand transition-colors">privacy notice</Link>.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-[10px] tracking-[0.2em] uppercase text-bg/50">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <span>31 &amp; Rooted · 31 Sisters Daily</span>
            <a href={`mailto:${CONTACT.email}`} className="py-2 hover:text-sand transition-colors">{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="py-2 hover:text-sand transition-colors">{CONTACT.phone}</a>
          </div>

          <SocialLinks variant="row" className="order-3 md:order-none text-bg/70" />

          <div className="flex flex-wrap gap-6">
            <Link href="/contact" className="py-2 hover:text-sand transition-colors" data-testid="link-footer-contact">Contact</Link>
            <Link href="/privacy" className="py-2 hover:text-sand transition-colors" data-testid="link-footer-privacy">Privacy</Link>
            <button onClick={() => openBooking()} className="py-2 hover:text-sand transition-colors text-left" data-testid="button-footer-book">Book a space</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
