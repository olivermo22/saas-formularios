const API = "https://api.iawhats.com.mx/v1";

async function requestOTP() {
  const whatsapp = document.getElementById("whatsapp").value;

  await fetch(`${API}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ whatsapp })
  });

  document.getElementById("step-phone").style.display = "none";
  document.getElementById("step-otp").style.display = "block";
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

