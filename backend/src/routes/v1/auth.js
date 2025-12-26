import { Router } from "express";
import { createOtpForWhatsapp, verifyOtp } from "../../services/otp.service.js";
import { sendWhatsappOTP } from "../../services/whatsapp.service.js";
import { canRequestOtp } from "../../services/rate-limit.service.js";
import { getOrCreateAccount, createSessionForAccount } from "../../services/session.service.js";

export const authRouter = Router();

authRouter.post("/auth/request-otp", async (req, res) => {
  const { whatsapp } = req.body;

  if (!whatsapp) {
    return res.status(400).json({ ok: false, error: "Whatsapp requerido" });
  }

  try {
    const allowed = await canRequestOtp(whatsapp, 1);
    if (!allowed) {
      return res.status(429).json({
        ok: false,
        error: "Espera 1 minuto antes de solicitar otro código"
      });
    }

    const otp = await createOtpForWhatsapp(whatsapp);

    // ENVÍO REAL POR WHATSAPP (Día 3)
    await sendWhatsappOTP(whatsapp, otp);

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "OTP error" });
  }
});

authRouter.post("/auth/verify-otp", async (req, res) => {
  const { whatsapp, otp } = req.body;

  if (!whatsapp || !otp) {
    return res.status(400).json({ ok: false, error: "Datos incompletos" });
  }

  const valid = await verifyOtp(whatsapp, otp);

  if (!valid) {
    return res.status(401).json({ ok: false, error: "OTP inválido" });

  }

const account = await getOrCreateAccount(whatsapp);
const sessionToken = await createSessionForAccount(account.id);

res.json({
  ok: true,
  session_token: sessionToken,
  account: {
    id: account.id,
    whatsapp: account.whatsapp_number,
    plan: account.plan
  }
});

});


