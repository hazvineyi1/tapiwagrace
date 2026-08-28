/**
 * How people pay, and what the site is allowed to say about it.
 *
 * Everything here starts empty on purpose. Nothing that takes money is
 * rendered until a real value is filled in — a broken or invented payment
 * link on a page asking for £250 is worse than no link at all.
 */

/**
 * A Stripe Payment Link. Create it in the Stripe dashboard (Payments →
 * Payment links), for a fixed £250 GBP amount, then paste the URL here.
 * No code or API keys are involved; Stripe hosts the checkout.
 */
export const STRIPE_DEPOSIT_LINK: string | null = null;

export interface BankTransfer {
  accountName: string;
  sortCode: string;
  accountNumber: string;
  /** What the payer should put as the payment reference. */
  reference: string;
}

/** Fill in to show bank details on the page; leave null to keep them private. */
export const BANK_TRANSFER: BankTransfer | null = null;

export const paymentsConfigured = (): boolean =>
  STRIPE_DEPOSIT_LINK !== null || BANK_TRANSFER !== null;
