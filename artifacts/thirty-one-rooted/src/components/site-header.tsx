import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import { useSiteChrome } from '@/components/site-chrome';
import { scrollToSection, setPendingSection } from '@/lib/site-nav';

const SECTION_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'tools', label: 'Tools' },
  { id: 'daily', label: '31 Sisters Daily' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { openBooking } = useSiteChrome();

  const onHome = location === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  /** On home this scrolls; elsewhere it navigates home and scrolls on arrival. */
  const goToSection = (id: string) => {
    closeMenu();
    if (onHome) {
      scrollToSection(id);
      return;
    }
    setPendingSection(id);
    setLocation('/');
  };

  const navLink = 'py-2 text-[13px] lg:text-[10px] tracking-[0.2em] uppercase text-fg hover:text-rust transition-colors';

  return (
    <header className={`fixed top-0 left-0 right-0 h-24 px-6 md:px-12 flex items-center justify-between z-50 transition-all duration-300 ${scrolled || !onHome ? 'bg-bg/95 backdrop-blur-md border-b border-line' : 'bg-transparent'}`}>
      <a
        href="/"
        className="flex items-center gap-4 py-2 group"
        data-testid="link-home"
        onClick={(event) => {
          event.preventDefault();
          closeMenu();
          if (onHome) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setLocation('/');
          }
        }}
      >
        <span className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium text-rust">31 &amp; Rooted</span>
      </a>

      <nav className={`fixed inset-0 bg-bg flex flex-col justify-center items-center gap-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:bg-transparent lg:flex-row lg:justify-end lg:gap-8 lg:transform-none ${menuOpen ? 'translate-y-0' : '-translate-y-full lg:translate-y-0'}`} aria-label="Main navigation">
        <button className="lg:hidden absolute top-8 right-6 text-ink-subtle hover:text-rust transition-colors" onClick={closeMenu} aria-label="Close menu"><X size={24} strokeWidth={1.5} /></button>

        <Link href="/retreats" className={navLink} onClick={closeMenu} data-testid="link-nav-retreats">Retreats</Link>

        {SECTION_LINKS.map((link) => (
          <button key={link.id} className={navLink} onClick={() => goToSection(link.id)} data-testid={`button-nav-${link.id}`}>
            {link.label}
          </button>
        ))}
        <Link href="/contact" className={navLink} onClick={closeMenu} data-testid="link-nav-contact">Contact</Link>

        <button className="mt-8 lg:mt-0 text-[11px] lg:text-[10px] tracking-[0.2em] uppercase bg-moss text-bg px-8 lg:px-6 py-4 lg:py-3 hover:bg-fg transition-colors" onClick={() => { closeMenu(); openBooking(); }} data-testid="button-nav-book">Book a space</button>
      </nav>

      <button className="lg:hidden text-fg" onClick={() => setMenuOpen(true)} aria-label="Open navigation" data-testid="button-menu">
        <Menu size={24} strokeWidth={1.5} />
      </button>
    </header>
  );
}
