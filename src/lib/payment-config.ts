/**
 * ═══════════════════════════════════════════════════════════════
 *  💳 PAYMENT CONFIGURATION — EDIT THIS FILE TO UPDATE PAYMENTS
 * ═══════════════════════════════════════════════════════════════
 *
 *  This is the ONLY file you need to edit to:
 *   • Add/remove payment methods (UPI, PayPal, Bank, Crypto)
 *   • Change the support button headline/message
 *   • Enable/disable the support button
 *   • Add a QR code for UPI/PayPal payments
 *
 *  After editing, run: npm run build
 *  Then deploy to Cloudflare Pages.
 *
 *  HOW TO ADD PAYMENT METHODS:
 *  ─────────────────────────────
 *  1. Fill in the fields below (UPI, PayPal, Bank, Crypto)
 *  2. Leave any field as "" (empty) to hide it on the site
 *  3. Set enabled to false to hide the entire support button
 *
 * ═══════════════════════════════════════════════════════════════
 */

export const paymentConfig = {
  /** Set to false to hide the "Help the admin" button completely */
  enabled: true,

  /** Headline on the support page */
  headline: "Help us keep Jivan free for everyone",

  /** Message explaining why support is needed */
  message:
    "Jivan is run as a public-service project. We take no commission, sell nothing and show no paid placements. Server and research costs are paid out of pocket. If this platform saved you money, a small contribution helps us keep it free for the next family who needs it.",

  /**
   * ┌─────────────────────────────────────────────┐
   * │  UPI — For Indian donors                    │
   * │  Most popular in India (PhonePe, GPay, etc) │
   * └─────────────────────────────────────────────┘
   */
  upi: {
    /** Your UPI ID — e.g. "yourname@upi" or "yourname@ybl" */
    id: "",
    /** Your name as shown on UPI (for display only) */
    displayName: "",
  },

  /**
   * ┌─────────────────────────────────────────────┐
   * │  PayPal — For international donors          │
   * │  Works in US, EU, Australia, most countries │
   * └─────────────────────────────────────────────┘
   */
  paypal: {
    /** Your PayPal.me link — e.g. "https://paypal.me/yourname" */
    link: "",
    /** Or your PayPal email — e.g. "you@email.com" */
    email: "",
  },

  /**
   * ┌─────────────────────────────────────────────┐
   * │  Bank Transfer — For direct transfers       │
   * │  Works for NEFT, RTGS, SWIFT transfers      │
   * └─────────────────────────────────────────────┘
   */
  bank: {
    /** Bank name — e.g. "State Bank of India" */
    name: "",
    /** Account holder name — e.g. "Jivan Foundation" */
    accountHolder: "",
    /** Account number — e.g. "1234567890" */
    accountNumber: "",
    /** IFSC code (India) — e.g. "SBIN0001234" */
    ifsc: "",
    /** SWIFT/BIC code (international) — e.g. "SBININBB" */
    swift: "",
  },

  /**
   * ┌─────────────────────────────────────────────┐
   * │  Crypto — For crypto donations              │
   * │  Bitcoin, Ethereum, USDT, etc.              │
   * └─────────────────────────────────────────────┘
   */
  crypto: {
    /** Bitcoin address */
    btc: "",
    /** Ethereum address */
    eth: "",
    /** USDT (TRC-20) address */
    usdt: "",
    /** Any other crypto — free text */
    other: "",
  },

  /**
   * ┌─────────────────────────────────────────────┐
   * │  QR Code — Shows on the support page        │
   * │  Upload your QR to any image host and paste │
   * │  the URL here. Works great for UPI QR.      │
   * └─────────────────────────────────────────────┘
   */
  qrCodeUrl: "",

  /** Note shown at the bottom of the support page */
  note: "Contributions are voluntary. They are not a payment for medicine and give no medical entitlement.",
} as const;

/**
 * Get all configured payment methods (non-empty ones).
 * Used by the support page to display payment options.
 */
export function getPaymentMethods(): { label: string; value: string }[] {
  const methods: { label: string; value: string }[] = [];

  if (paymentConfig.upi.id) {
    methods.push({ label: "UPI ID", value: paymentConfig.upi.id });
  }
  if (paymentConfig.paypal.link) {
    methods.push({ label: "PayPal", value: paymentConfig.paypal.link });
  }
  if (paymentConfig.paypal.email && !paymentConfig.paypal.link) {
    methods.push({ label: "PayPal Email", value: paymentConfig.paypal.email });
  }
  if (paymentConfig.bank.name) {
    methods.push({ label: "Bank Name", value: paymentConfig.bank.name });
  }
  if (paymentConfig.bank.accountHolder) {
    methods.push({ label: "Account Holder", value: paymentConfig.bank.accountHolder });
  }
  if (paymentConfig.bank.accountNumber) {
    methods.push({ label: "Account Number", value: paymentConfig.bank.accountNumber });
  }
  if (paymentConfig.bank.ifsc) {
    methods.push({ label: "IFSC Code", value: paymentConfig.bank.ifsc });
  }
  if (paymentConfig.bank.swift) {
    methods.push({ label: "SWIFT / BIC", value: paymentConfig.bank.swift });
  }
  if (paymentConfig.crypto.btc) {
    methods.push({ label: "Bitcoin (BTC)", value: paymentConfig.crypto.btc });
  }
  if (paymentConfig.crypto.eth) {
    methods.push({ label: "Ethereum (ETH)", value: paymentConfig.crypto.eth });
  }
  if (paymentConfig.crypto.usdt) {
    methods.push({ label: "USDT (TRC-20)", value: paymentConfig.crypto.usdt });
  }
  if (paymentConfig.crypto.other) {
    methods.push({ label: "Crypto", value: paymentConfig.crypto.other });
  }

  return methods;
}