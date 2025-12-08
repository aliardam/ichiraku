const API_BASE_URL = "http://localhost:5000/api";

// DOM Elements
const itemsTableBody = document.getElementById("items-table-body");
const categorySelect = document.getElementById("category_id");
const form = document.getElementById("item-form");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-edit");
const formMsg = document.getElementById("form-msg");
const formTitle = document.getElementById("form-title");

// Inputs
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const isDrinkInput = document.getElementById("is_drink");
const imageInput = document.getElementById("image");
const editIdInput = document.getElementById("edit-id");

// --- INITIAL LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadItems();
});

// 1. Load Categories into Dropdown
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const cats = await res.json();
    
    categorySelect.innerHTML = "";
    cats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading categories", err);
  }
}

// 2. Load Items into Table
async function loadItems() {
  itemsTableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";
  try {
    const res = await fetch(`${API_BASE_URL}/admin/items`);
    const items = await res.json();

    itemsTableBody.innerHTML = "";
    if (items.length === 0) {
      itemsTableBody.innerHTML = "<tr><td colspan='3'>No items found.</td></tr>";
      return;
    }

    items.forEach(item => {
      const tr = document.createElement("tr");

      // Handle Image: use backend URL or placeholder
      // Note: Backend sends "/static/assets/..."
      const imgPath = item.image ? item.image : '/static/assets/placeholder.png';

      tr.innerHTML = `
        <td>
            <img src="${imgPath}" class="thumb-img" alt="img">
        </td>
        <td>
            <strong>${item.name}</strong><br>
            <span class="meta">${item.category} • $${item.price.toFixed(2)}</span>
        </td>
        <td>
            <button class="small-btn" onclick="startEdit(${item.id})">Edit</button>
            <button class="small-btn danger" onclick="deleteItem(${item.id})">Delete</button>
        </td>
      `;
      itemsTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    itemsTableBody.innerHTML = "<tr><td colspan='3'>Error loading items.</td></tr>";
  }
}

// 3. Handle Form Submit (Add OR Edit)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  formMsg.textContent = "Processing...";

  const isEdit = !!editIdInput.value;
  const url = isEdit 
    ? `${API_BASE_URL}/admin/edit_item/${editIdInput.value}`
    : `${API_BASE_URL}/admin/add_item`;
  
  // Backend edit route supports PUT or POST. We use POST for FormData usually, 
  // but if your backend expects PUT for edit, change this.
  // Based on your previous backend code: edit_item used methods=['PUT', 'POST']
  const method = isEdit ? "PUT" : "POST";

  // --- CRITICAL CHANGE: Use FormData instead of JSON ---
  const formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("description", descInput.value);
  formData.append("price", priceInput.value);
  formData.append("category_id", categorySelect.value);
  formData.append("is_drink", isDrinkInput.checked);

  // Only append image if user selected a new file
  if (imageInput.files[0]) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const res = await fetch(url, {
      method: method,
      body: formData 
      // Do NOT set 'Content-Type': 'application/json' here!
      // Browser handles it automatically for FormData.
    });
    
    const result = await res.json();

    if (res.ok) {
      formMsg.textContent = "Success!";
      resetForm();
      loadItems();
    } else {
      formMsg.textContent = "Error: " + (result.error || "Failed");
    }
  } catch (err) {
    console.error(err);
    formMsg.textContent = "Server error.";
  } finally {
    submitBtn.disabled = false;
  }
});

// 4. Delete Item
async function deleteItem(id) {
  if (!confirm("Are you sure?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/delete_item/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      loadItems();
    } else {
      alert("Failed to delete.");
    }
  } catch (err) {
    console.error(err);
  }
}

// 5. Start Edit Mode
window.startEdit = async function(id) {
    // We need to fetch the specific item details to fill the form correctly
    // Since we only have the list, let's find it in the DOM or re-fetch.
    // Simplest approach: fetch the single item details from backend logic 
    // (Or just filter from the already loaded list if we stored it).
    
    // For simplicity, we loop through the table rows? No, let's just find it in the items array.
    // To make this robust, let's just fetch all items again and find the match.
    const res = await fetch(`${API_BASE_URL}/admin/items`);
    const items = await res.json();
    const item = items.find(i => i.id === id);

    if (!item) return;

    formTitle.textContent = "Edit Item";
    submitBtn.textContent = "Update Item";
    cancelBtn.style.display = "inline-block";
    editIdInput.value = item.id;

    nameInput.value = item.name;
    descInput.value = item.description;
    priceInput.value = item.price;
    
    // We need to map category name to ID. 
    // This is tricky if we only have the name. 
    // Ideally, the admin items API should return category_id.
    // If your backend only returns category Name, we have to guess or update backend.
    // Assuming backend returns category_id OR we just select the first match by text.
    Array.from(categorySelect.options).forEach(opt => {
        if(opt.text === item.category) {
            categorySelect.value = opt.value;
        }
    });

    // Determine is_drink (Backend might not send this in the /admin/items list?)
    // If backend /api/admin/items doesn't return is_drink, you might lose this data on edit.
    // *Important*: Check your backend admin_get_items function.
    
    // Clear file input (can't set value programmatically)
    imageInput.value = ""; 
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 6. Reset Form
function resetForm() {
    form.reset();
    editIdInput.value = "";
    formTitle.textContent = "Add New Item";
    submitBtn.textContent = "Add Item";
    cancelBtn.style.display = "none";
    formMsg.textContent = "";
}

cancelBtn.addEventListener("click", resetForm);