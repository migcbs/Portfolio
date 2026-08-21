import Stripe from "stripe";

let stripeClient: Stripe | null | undefined;

/** Returns null (not undefined) when STRIPE_SECRET_KEY isn't set, so callers can no-op gracefully instead of throwing. */
export function getStripe(): Stripe | null {
  if (stripeClient !== undefined) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  stripeClient = key ? new Stripe(key) : null;
  return stripeClient;
}
