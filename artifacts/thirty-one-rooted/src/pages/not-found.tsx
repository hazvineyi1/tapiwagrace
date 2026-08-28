import { useEffect } from 'react';
import { Link } from 'wouter';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | 31&Rooted';
  }, []);

  return (
    <main className="flex-1 pt-48 pb-32 px-6 md:px-12 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <span className="text-[10px] tracking-[0.2em] uppercase text-rust mb-8 block font-medium">Page not found</span>
        <h1 className="text-4xl md:text-[3.25rem] leading-[1.05] text-fg mb-8">
          This path has not been <em className="italic text-rust">made yet.</em>
        </h1>
        <p className="text-[16px] text-fg/70 leading-relaxed mb-12">
          The page you were looking for is not here. Come back to the beginning, or write to us and we will point you the right way.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Link href="/" className="bg-moss text-bg px-8 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-fg transition-colors" data-testid="link-notfound-home">
            Return home
          </Link>
          <Link href="/contact" className="text-[10px] tracking-[0.2em] uppercase border-b border-line pb-1 hover:border-rust hover:text-rust transition-colors" data-testid="link-notfound-contact">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
