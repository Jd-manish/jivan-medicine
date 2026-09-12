import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "jivan_admin_session";

/**
 * ADMIN_PANEL_PASSWORD should be set in the deployment environment.
 * A fallback is provided for local development only, preventing empty strings.
 */
const adminPassword = process.env.ADMIN_PANEL_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "dev-admin-pass-only");

if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PANEL_PASSWORD) {
  console.warn("WARNING: ADMIN_PANEL_PASSWORD environment variable is not set.");
}

const sessionSecret = process.env.ADMIN_SESSION_SECRET || adminPassword;

function expectedToken() {
  return createHmac("sha256", sessionSecret).update("jivan-admin-session-v1").digest("hex");
}

function safeEqual(value: string, expected: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(expected);

  return left.length === right.length && timingSafeEqual(left, right);
}

export function isValidAdminPassword(password: string) {
  return safeEqual(password, adminPassword);
}

export async function isAdminLoggedIn() {
  const store = await cookies();
  return safeEqual(store.get(ADMIN_COOKIE_NAME)?.value ?? "", expectedToken());
}

export function isAdminRequest(request: NextRequest) {
  return safeEqual(request.cookies.get(ADMIN_COOKIE_NAME)?.value ?? "", expectedToken());
}

export function adminCookieValue() {
  return expectedToken();
}