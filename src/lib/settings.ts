/**
 * Site settings — hardcoded defaults. No database required.
 */

export const SETTING_KEYS = [
  "support_enabled",
  "support_headline",
  "support_message",
  "support_upi",
  "support_bank_name",
  "support_account_name",
  "support_account_number",
  "support_ifsc",
  "support_swift",
  "support_paypal",
  "support_crypto",
  "support_qr_url",
  "support_note",
  "ads_enabled",
  "ads_client_id",
  "ads_slot_home",
  "ads_slot_article",
  "ads_slot_sidebar",
  "site_tagline",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];
export type SettingsMap = Record<SettingKey, string>;

export const defaultSettings: SettingsMap = {
  support_enabled: "true",
  support_headline: "Help us keep Jivan free for everyone",
  support_message:
    "Jivan is run as a public-service project. We take no commission, sell nothing and show no paid placements. Server and research costs are paid out of pocket. If this platform saved you money, a small contribution helps us keep it free for the next family who needs it.",
  support_upi: "",
  support_bank_name: "",
  support_account_name: "",
  support_account_number: "",
  support_ifsc: "",
  support_swift: "",
  support_paypal: "",
  support_crypto: "",
  support_qr_url: "",
  support_note: "Contributions are voluntary. They are not a payment for medicine and give no medical entitlement.",
  ads_enabled: "false",
  ads_client_id: "",
  ads_slot_home: "",
  ads_slot_article: "",
  ads_slot_sidebar: "",
  site_tagline: "Same molecule. Fraction of the price.",
};

export async function getSettings(): Promise<SettingsMap> {
  return { ...defaultSettings };
}

export async function saveSettings(_values: Partial<SettingsMap>) {
  // No-op — settings are hardcoded for static deployment.
}
