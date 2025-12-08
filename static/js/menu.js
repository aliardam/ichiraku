const categories = document.querySelectorAll(".category");
const itemsSection = document.getElementById("items");
const categoriesSection = document.getElementById("categories");
const backBtn = document.getElementById("back-btn");
const categoryTitle = document.getElementById("category-title");
const itemList = document.getElementById("item-list");

const API_BASE_URL = "http://localhost:5000"; 

// 1. Fetch items by category from backend
async function fetchItemsByCategory(categoryName) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/menu/${categoryName}`);
    if (!response.ok) throw new Error("Category not found");
    const items = await response.json();
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

// 2. Handle Category Clicks
categories.forEach((cat) => {
  cat.addEventListener("click", async () => {
    const category = cat.dataset.category;
    await showItems(category);
  });
});

// 3. Handle Back Button
backBtn.addEventListener("click", () => {
  itemsSection.classList.add("hidden");
  categoriesSection.classList.remove("hidden");
});

// 4. Show Items Function (Updated for DB Images)
async function showItems(categoryName) {
  itemList.innerHTML = "<p>Loading...</p>";
  categoryTitle.textContent =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const items = await fetchItemsByCategory(categoryName);

  itemList.innerHTML = "";

  if (items.length === 0) {
    itemList.innerHTML = "<p>No items found for this category.</p>";
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item");
    
    // Store data for the popup
    div.dataset.id = item.id;
    div.dataset.name = item.name;
    div.dataset.description = item.description;
    div.dataset.price = item.price;
    
    // --- KEY CHANGE: Dynamic Images from Database ---
    // If backend sends an image link, use it. Otherwise, use placeholder.
    // Note: The backend sends the link as "/api/images/filename.jpg"
    let imagePath;
    if (item.image) {
        imagePath = `${API_BASE_URL}${item.image}`;
    } else {
        // Fallback to local placeholder
        imagePath = `${API_BASE_URL}/static/assets/placeholder.png`; 
    }

    div.dataset.img = imagePath;

    div.innerHTML = `
      <img src="${imagePath}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <strong>$${item.price.toFixed(2)}</strong>
    `;

    itemList.appendChild(div);
  });

  categoriesSection.classList.add("hidden");
  itemsSection.classList.remove("hidden");
}

// 5. Open Item Popup
document.addEventListener("click", function (e) {
  const item = e.target.closest(".item");
  if (!item) return;

  document.getElementById("detail-name").textContent = item.dataset.name;
  
  // Handle description check
  const desc = item.dataset.description && item.dataset.description !== "undefined" 
    ? item.dataset.description 
    : "No description available";
    
  document.getElementById("detail-description").textContent = "Description: " + desc;
  
  // Note: We removed ingredients since it wasn't in your updated DB model, 
  // but you can add it back if you add a column for it.
  const ingElement = document.getElementById("detail-ingredients");
  if(ingElement) ingElement.textContent = ""; 

  document.getElementById("detail-price").textContent = "Price: $" + parseFloat(item.dataset.price).toFixed(2);
  document.getElementById("detail-img").src = item.dataset.img;

  // Store ID on the button for later ordering
  document.getElementById("add-to-order-btn").setAttribute("data-id", item.dataset.id);

  document.getElementById("item-detail-overlay").classList.remove("hidden");
});

// 6. Close Popup
document.getElementById("close-detail-btn").addEventListener("click", () => {
  document.getElementById("item-detail-overlay").classList.add("hidden");
});

// 7. Add Item to Order (Local Storage)
document.getElementById("add-to-order-btn").addEventListener("click", () => {
  const btn = document.getElementById("add-to-order-btn");
  const itemId = btn.getAttribute("data-id");

  // Create the cart item object
  const orderItem = {
    id: itemId, // Important for backend
    name: document.getElementById("detail-name").textContent,
    description: document.getElementById("detail-description").textContent.replace("Description: ", ""),
    price: parseFloat(
      document.getElementById("detail-price").textContent.replace("Price: $", "")
    ),
    img: document.getElementById("detail-img").src,
    quantity: 1
  };

  // Save to LocalStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(orderItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to your order!");

  document.getElementById("item-detail-overlay").classList.add("hidden");
});