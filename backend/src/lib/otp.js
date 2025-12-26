export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

export function getOTPExpiry(minutes = 5) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

