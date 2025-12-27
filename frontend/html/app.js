const API = "https://api.iawhats.com.mx/v1";
const token = localStorage.getItem("token");

let currentFormId = null;
let currentFields = [];

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
  await loadFields();
}

// ---------- LOAD FIELDS ----------
async function loadFields() {
  if (!currentFormId) return;

  const res = await fetch(`${API}/forms/${currentFormId}/fields`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  currentFields = res.fields || [];

  renderFields();
}

// ---------- RENDER FIELDS ----------
function renderFields() {
  const container = document.getElementById("fields");
  container.innerHTML = "";

  if (!currentFields.length) {
    container.innerText = "Sin campos aún.";
    return;
  }

  currentFields.forEach((f, index) => {
    const div = document.createElement("div");
    div.style.marginBottom = "6px";

    div.innerHTML = `
      <b>${index + 1}.</b> ${f.label} (${f.type}) ${f.required ? "*" : ""}
      <button onclick="moveField(${index}, -1)">↑</button>
      <button onclick="moveField(${index}, 1)">↓</button>
      <button onclick="deleteField('${f.id}')">🗑</button>
    `;

    container.appendChild(div);
  });
}

// ---------- MOVE FIELD ----------
async function moveField(index, direction) {
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= currentFields.length) return;

  // Swap local array
  const temp = currentFields[index];
  currentFields[index] = currentFields[newIndex];
  currentFields[newIndex] = temp;

  renderFields();

  // Persist order
  await persistOrder();
}

// ---------- PERSIST ORDER ----------
async function persistOrder() {
  const orderedIds = currentFields.map(f => f.id);

  await fetch(`${API}/forms/${currentFormId}/fields/order`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      orderedFieldIds: orderedIds
    })
  });
}

// ---------- DELETE FIELD ----------
async function deleteField(fieldId) {
  if (!confirm("¿Eliminar este campo?")) return;

  await fetch(`${API}/forms/${currentFormId}/fields/${fieldId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  currentFields = currentFields.filter(f => f.id !== fieldId);
  renderFields();
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

  await fetch(`${API}/forms/${currentFormId}/fields`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      label,
      required
    })
  });

  document.getElementById("field-label").value = "";
  document.getElementById("field-required").checked = false;

  loadFields();
}

loadDashboard();

