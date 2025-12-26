const API = "https://api.iawhats.com.mx/v1";

async function requestOTP() {
  const whatsapp = document.getElementById("whatsapp").value;

  if (!whatsapp) {
    alert("Ingresa tu número de WhatsApp");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp })
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.error || "Error enviando código");
      return;
    }

    // SOLO si el backend confirma
    document.getElementById("step-phone").style.display = "none";
    document.getElementById("step-otp").style.display = "block";

  } catch (err) {
    console.error(err);
    alert("Error de conexión");
  }
}

async function verifyOTP() {
  const whatsapp = document.getElementById("whatsapp").value;
  const otp = document.getElementById("otp").value;

  const res = await fetch(`${API}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ whatsapp, otp })
  });

  const data = await res.json();

  if (data.session_token) {
    localStorage.setItem("token", data.session_token);
    window.location.href = "/dashboard.html";
  } else {
    alert("OTP inválido");
  }
}

