/**
 * How people pay, and what the site is allowed to say about it.
 *
 * Everything here starts empty on purpose. Nothing that takes money, and no
 * claim about money being protected, is rendered until a real value is filled
 * in. A dead payment link — or worse, an unearned promise of protection — on
 * a page asking for £250 is far worse than saying nothing.
 */

/**
 * A hosted payment link for the deposit.
 *
 * This may be a Stripe Payment Link, or the link issued by a trust-based
 * travel payment provider. Deliberately not named after a provider: if the
 * processor changes, only the value here changes.
 */
export const DEPOSIT_PAYMENT_LINK: string | null = null;

export interface BankTransfer {
  accountName: string;
  sortCode: string;
  accountNumber: string;
  /** What the payer should put as the payment reference. */
  reference: string;
}

/** Fill in to show bank details on the page; leave null to keep them private. */
export const BANK_TRANSFER: BankTransfer | null = null;

export interface FinancialProtection {
  /** e.g. "Protected Trust Services" */
  provider: string;
  /** The membership or licence number the provider issues. */
  membershipNumber: string;
  /**
   * Providers usually mandate the exact wording you must display. Paste theirs
   * here; the default below is a plain-English placeholder, not their text.
   */
  statement?: string;
  /** The provider's page where a customer can verify the membership. */
  verifyUrl?: string;
}

/**
 * Set ONLY once trust-based protection is actually in place and the provider
 * has confirmed the membership number.
 *
 * Saying money is protected when it is not would mislead someone into paying
 * a deposit they believe is safe. Leave this null until it is true.
 */
export const FINANCIAL_PROTECTION: FinancialProtection | null = null;

export const DEFAULT_PROTECTION_STATEMENT =
  'The money you pay for a retreat is held in trust until your retreat has taken place, rather than being spent by us in the meantime. If a retreat could not go ahead, your payment would be returned to you from that trust.';

/**
 * Read through a function so the value keeps its declared union type.
 * TypeScript narrows a `const` initialised to null down to `null` within this
 * module, which would make the configured branch unreachable at compile time.
 */
function currentProtection(): FinancialProtection | null {
  return FINANCIAL_PROTECTION;
}

export const protectionStatement = (): string | null => {
  const protection = currentProtection();
  if (!protection) return null;
  return protection.statement ?? DEFAULT_PROTECTION_STATEMENT;
};
