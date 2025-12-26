const API = "https://api.iawhats.com.mx/v1";
const token = localStorage.getItem("token");

let currentFormId = null;

if (!token) {
  window.location.href = "/";
}

// ---------- LOGOUT ----------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

// ---------- LOAD DASHBOARD ----------
async function loadDashboard() {
  try {
    const me = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    document.getElementById("account").innerText =
      `WhatsApp: ${me.account.whatsapp_number} | Plan: ${me.account.plan}`;

    document.getElementById("branding").innerText =
      me.branding ? "Powered by Saas-Formularios" : "";

    loadForms();
  } catch {
    logout();
  }
}

// ---------- CREATE FORM ----------
async function createForm() {
  const name = document.getElementById("form-name").value;
  const slug = document.getElementById("form-slug").value;

  if (!name || !slug) {
    alert("Completa nombre y slug");
    return;
  }

  await fetch(`${API}/forms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, slug })
  });

  document.getElementById("form-name").value = "";
  document.getElementById("form-slug").value = "";

  loadForms();
}

// ---------- LOAD FORMS ----------
async function loadForms() {
  const res = await fetch(`${API}/forms`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const ul = document.getElementById("forms");
  ul.innerHTML = "";

  res.forms.forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `
      <b>${f.name}</b>
      | <a href="/f/${f.slug}" target="_blank">Abrir</a>
      | <button onclick="selectForm('${f.id}')">Editar</button>
    `;
    ul.appendChild(li);
  });
}

// ---------- SELECT FORM ----------
async function selectForm(formId) {
  currentFormId = formId;
  loadFields();
}

// ---------- LOAD FIELDS ----------
async function loadFields() {
  if (!currentFormId) return;

  const res = await fetch(`${API}/forms/${currentFormId}/fields`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const container = document.getElementById("fields");
  container.innerHTML = "";

  if (!res.fields.length) {
    container.innerHTML = "Sin campos aún.";
    return;
  }

  res.fields.forEach(f => {
    const div = document.createElement("div");
    div.innerText = `${f.position}. ${f.label} (${f.type}) ${f.required ? "*" : ""}`;
    container.appendChild(div);
  });
}

// ---------- ADD FIELD ----------
async function addField() {
  if (!currentFormId) {
    alert("Selecciona un formulario");
    return;
  }

  const type = document.getElementById("field-type").value;
  const label = document.getElementById("field-label").value;
  const required = document.getElementById("field-required").checked;

  if (!label) {
    alert("Etiqueta requerida");
    return;
  }

  const position =
    document.querySelectorAll("#fields div").length + 1;

  await fetch(`${API}/forms/${currentFormId}/fields`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      label,
      required,
      position
    })
  });

  document.getElementById("field-label").value = "";
  document.getElementById("field-required").checked = false;

  loadFields();
}

loadDashboard();

