import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { BookingModal } from '@/components/booking-modal';
import { isBookingLabel, type BookingLabel } from '@/lib/site-nav';

interface SiteChromeValue {
  /** Shows a transient status note in the corner. */
  notify: (message: string) => void;
  /** Opens the booking flow, optionally pre-selecting what it is for. */
  openBooking: (service?: string) => void;
}

const SiteChromeContext = createContext<SiteChromeValue | null>(null);

export function useSiteChrome(): SiteChromeValue {
  const value = useContext(SiteChromeContext);
  if (!value) {
    throw new Error('useSiteChrome must be used inside <SiteChromeProvider>');
  }
  return value;
}

/**
 * Owns the two pieces of chrome that any page can reach for: the booking
 * modal and the toast. Keeping them here means the header, footer and page
 * bodies all trigger the same instance.
 */
export function SiteChromeProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingKind, setBookingKind] = useState<BookingLabel>('Retreat');
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 4200);
  }, []);

  const openBooking = useCallback((service = 'Retreat') => {
    setBookingKind(isBookingLabel(service) ? service : 'Retreat');
    setBookingOpen(true);
  }, []);

  const value = useMemo(() => ({ notify, openBooking }), [notify, openBooking]);

  return (
    <SiteChromeContext.Provider value={value}>
      {children}
      {bookingOpen && (
        <BookingModal initialKind={bookingKind} onClose={() => setBookingOpen(false)} onNotify={notify} />
      )}
      {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
    </SiteChromeContext.Provider>
  );
}
