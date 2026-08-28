import type { IconType } from 'react-icons';
import { SiFacebook, SiInstagram, SiThreads, SiTiktok, SiWhatsapp } from 'react-icons/si';

import { activeSocials, type SocialPlatform } from '@/lib/contact';

const ICONS: Record<SocialPlatform, IconType> = {
  tiktok: SiTiktok,
  instagram: SiInstagram,
  threads: SiThreads,
  facebook: SiFacebook,
  whatsapp: SiWhatsapp,
};

/**
 * `row` is the compact icon strip for the footer; `list` is the labelled
 * column used on the contact page.
 */
export function SocialLinks({ variant = 'row', className = '' }: { variant?: 'row' | 'list'; className?: string }) {
  const links = activeSocials();
  if (links.length === 0) return null;

  if (variant === 'list') {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {links.map((link) => {
          const Icon = ICONS[link.platform];
          return (
            <a
              key={link.label}
              href={link.url!}
              target="_blank"
              rel="noreferrer"
              className="py-1 text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 text-ink-muted hover:text-rust transition-colors w-fit"
              data-testid={`link-social-${link.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            >
              <Icon aria-hidden="true" size={15} /> {link.label}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-5 ${className}`}>
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        return (
          <a
            key={link.label}
            href={link.url!}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
            className="p-2 -m-2 hover:text-sand transition-colors"
            data-testid={`link-social-${link.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
          >
            <Icon aria-hidden="true" size={16} />
          </a>
        );
      })}
    </div>
  );
}
