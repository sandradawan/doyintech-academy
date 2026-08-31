/** Certificate fee in Nigerian Naira */
export const CERT_FEE_NGN = 2500;
/** Paystack amounts are in kobo (1 NGN = 100 kobo) */
export const CERT_FEE_KOBO = CERT_FEE_NGN * 100;

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function appBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL?.replace(/^(?!https?:)/, "https://") ||
    "http://localhost:3000"
  );
}
