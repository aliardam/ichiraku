const API = ""; // same origin; leave empty or set to "http://127.0.0.1:5000" if needed

// ELEMENTS
const itemsContainer = document.getElementById("items-container");
const nameEl = document.getElementById("name");
const descEl = document.getElementById("description");
const priceEl = document.getElementById("price");
const categoryEl = document.getElementById("category");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-edit");
const msgEl = document.getElementById("form-msg");
const formTitle = document.getElementById("form-title");

let editingId = null; // when editing an item holds the item id

// UTIL
function showMsg(text, color = "#ffb86b") {
  msgEl.style.color = color;
  msgEl.textContent = text;
  setTimeout(() => {
    if (msgEl.textContent === text) msgEl.textContent = "";
  }, 3500);
}

async function safeFetch(url, opts = {}) {
  try {
    const res = await fetch((API || "") + url, opts);
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, error: e.message || e };
  }
}

// LOAD categories into select
async function loadCategories() {
  categoryEl.innerHTML = "<option>Loading…</option>";
  const r = await safeFetch("/api/categories");
  if (!r.ok) {
    categoryEl.innerHTML =
      '<option value="">(Error loading categories)</option>';
    return;
  }
  categoryEl.innerHTML = "";
  r.data.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    categoryEl.appendChild(opt);
  });
}

// LOAD items and render
async function loadItems() {
  itemsContainer.innerHTML = "<p>Loading items…</p>";
  const r = await safeFetch("/api/admin/items");
  if (!r.ok) {
    itemsContainer.innerHTML = `<p style="color:#f66">Failed to load items (status ${r.status})</p>`;
    return;
  }

  const items = r.data;
  if (!items || items.length === 0) {
    itemsContainer.innerHTML = "<p>No menu items found.</p>";
    return;
  }

  // Build table
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th><th>Name</th><th>Desc</th><th>Price</th><th>Category</th><th>Actions</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement("tbody");

  items.forEach((it) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${it.id}</td>
      <td class="meta">${escapeHtml(it.name)}</td>
      <td class="meta">${escapeHtml(it.description || "")}</td>
      <td class="meta">${Number(it.price).toFixed(2)}</td>
      <td class="meta">${escapeHtml(it.category || "")}</td>
      <td>
        <button class="small-btn" data-id="${
          it.id
        }" data-action="edit">Edit</button>
        <button class="small-btn danger" data-id="${
          it.id
        }" data-action="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  itemsContainer.innerHTML = "";
  itemsContainer.appendChild(table);

  // attach listeners
  itemsContainer.querySelectorAll("button[data-action]").forEach((btn) => {
    const id = btn.dataset.id;
    if (btn.dataset.action === "edit")
      btn.addEventListener("click", () => startEdit(id, items));
    if (btn.dataset.action === "delete")
      btn.addEventListener("click", () => removeItem(id));
  });
}

function escapeHtml(s) {
  if (!s) return "";
  return s.replace(
    /[&<>"'`]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;",
      }[c])
  );
}

// Start editing: fill form
function startEdit(id, items) {
  const it = items.find((x) => String(x.id) === String(id));
  if (!it) {
    showMsg("Item not found", "#f66");
    return;
  }
  editingId = it.id;
  nameEl.value = it.name || "";
  descEl.value = it.description || "";
  priceEl.value = Number(it.price).toFixed(2) || "";
  let found = false;
  [...categoryEl.options].forEach((opt) => {
    if (opt.textContent.toLowerCase() === (it.category || "").toLowerCase()) {
      opt.selected = true;
      found = true;
    }
  });
  // if not found, just leave the first option selected
  formTitle.textContent = `Edit item #${it.id}`;
  submitBtn.textContent = "Save changes";
  cancelBtn.style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel edit
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});

function resetForm() {
  editingId = null;
  nameEl.value = "";
  descEl.value = "";
  priceEl.value = "";
  if (categoryEl.options.length) categoryEl.selectedIndex = 0;
  formTitle.textContent = "Add New Item";
  submitBtn.textContent = "Add Item";
  cancelBtn.style.display = "none";
  msgEl.textContent = "";
}

// Add or Save
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = nameEl.value.trim();
  const description = descEl.value.trim();
  const price = parseFloat(priceEl.value);
  const category_id = parseInt(categoryEl.value);

  if (!name || !description || Number.isNaN(price) || !category_id) {
    showMsg("Please fill name, description, price and category", "#f66");
    return;
  }

  if (editingId) {
    // PUT to edit
    const body = { name, description, price, category_id };
    const r = await safeFetch(`/api/admin/edit_item/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      showMsg("Failed to update item", "#f66");
      return;
    }
    showMsg("Item updated", "#8f8");
    resetForm();
    await loadItems();
  } else {
    // POST to add
    const body = { name, description, price, category_id};
    const r = await safeFetch("/api/admin/add_item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      showMsg("Failed to add item", "#f66");
      return;
    }
    showMsg("Item added", "#8f8");
    resetForm();
    await loadItems();
  }
});

// Delete
async function removeItem(id) {
  if (!confirm("Delete this item?")) return;
  const r = await safeFetch(`/api/admin/delete_item/${id}`, {
    method: "DELETE",
  });
  if (!r.ok) {
    showMsg("Failed to delete", "#f66");
    return;
  }
  showMsg("Item deleted", "#8f8");
  await loadItems();
}

// INIT
(async function init() {
  await loadCategories();
  await loadItems();
})();
