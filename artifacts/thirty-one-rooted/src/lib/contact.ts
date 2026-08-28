/** The ministry's real contact points, used across the site. */
export const CONTACT = {
  email: '31sistertosister@gmail.com',
  phone: '+44 7537 929463',
  /** tel: needs the number without spaces. */
  phoneHref: 'tel:+447537929463',
} as const;

export type SocialPlatform = 'tiktok' | 'instagram' | 'threads' | 'facebook' | 'whatsapp';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  /** null until the account is confirmed — unset links are never rendered. */
  url: string | null;
}

/**
 * Add a URL here and the link appears everywhere at once. Entries left null
 * are skipped rather than rendered as dead links.
 */
export const SOCIALS: SocialLink[] = [
  { platform: 'tiktok', label: 'TikTok · 31 & Rooted', url: 'https://www.tiktok.com/@31androoted' },
  { platform: 'tiktok', label: 'TikTok · 31 Sisters Daily', url: 'https://www.tiktok.com/@31sistersdaily' },
  { platform: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/447537929463' },
  { platform: 'instagram', label: 'Instagram', url: null },
  { platform: 'threads', label: 'Threads', url: null },
  { platform: 'facebook', label: 'Facebook', url: null },
];

export const activeSocials = (): SocialLink[] => SOCIALS.filter((s) => s.url !== null);
