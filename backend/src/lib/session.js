import crypto from "crypto";

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function getSessionExpiry(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

