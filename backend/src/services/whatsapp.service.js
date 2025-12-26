import twilio from "twilio";
import { env } from "../config/env.js";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsappOTP(to, otp) {
  const message = `🔐 Tu código de acceso a Saas-Formularios es: ${otp}\n⏱ Válido por 5 minutos.`;

  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to.replace("whatsapp:", "")}`,
    body: message
  });
}

export async function sendWhatsappNotification(to, message) {
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${to.replace("whatsapp:", "")}`,
    body: message
  });
}

