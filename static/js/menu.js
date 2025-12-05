const categories = document.querySelectorAll(".category");
const itemsSection = document.getElementById("items");
const categoriesSection = document.getElementById("categories");
const backBtn = document.getElementById("back-btn");
const categoryTitle = document.getElementById("category-title");
const itemList = document.getElementById("item-list");

const API_BASE_URL = "http://localhost:5000"; // adjust if needed

// Fetch items by category from backend
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
const itemImages = {
  Edamame: "edamame.jpg",
  Gyoza: "gyoza.jpeg",
  "Agedashi Tofu": "tofu.jpg",
  "Chicken Teriyaki": "ChickenTeriyaki.jpg",
  "Salmon Donburi": "salmon-donburi.jpg",
  Ramen: "ramen.jpg",
  "Mochi Ice Cream": "mochi.jpg",
  "Matcha Cheesecake": "matcha-cheesecake.jpg",
  Dorayaki: "dorayaki.jpg",
  "Green Tea": "green-tea.jpg",
  Ramune: "ramune.jpg",
  "Matcha Latte": "matcha-Latte.jpg",
  "California Roll": "california-roll.jpg",
  "Vegetable Sushi Roll": "veg_sushi.jpg",
};

categories.forEach((cat) => {
  cat.addEventListener("click", async () => {
    const category = cat.dataset.category;
    await showItems(category);
  });
});

backBtn.addEventListener("click", () => {
  itemsSection.classList.add("hidden");
  categoriesSection.classList.remove("hidden");
});

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
    div.dataset.id = item.id;
    div.dataset.name = item.name;
    div.dataset.description = item.description;
    div.dataset.ingredients = item.ingredients || "No ingredients listed";
    div.dataset.price = item.price;
    const imageFile = itemImages[item.name] || "placeholder.png";
    const imagePath = `${API_BASE_URL}/static/assets/${imageFile}`;

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
// Open item popup
document.addEventListener("click", function (e) {
  const item = e.target.closest(".item");
  if (!item) return;

  document.getElementById("detail-name").textContent = item.dataset.name;
  document.getElementById("detail-description").textContent =
    "Description: " + item.dataset.description;
  document.getElementById("detail-ingredients").textContent =
    "Ingredients: " + item.dataset.ingredients;
  document.getElementById("detail-price").textContent =
    "Price: $" + parseFloat(item.dataset.price).toFixed(2);

  document.getElementById("detail-img").src = item.dataset.img;

  // store id for later ordering
  document
    .getElementById("add-to-order-btn")
    .setAttribute("data-id", item.dataset.id);

  document.getElementById("item-detail-overlay").classList.remove("hidden");
});

// Close popup
document.getElementById("close-detail-btn").addEventListener("click", () => {
  document.getElementById("item-detail-overlay").classList.add("hidden");
});
// Add item to order
document.getElementById("add-to-order-btn").addEventListener("click", () => {
  const itemId = event.target.getAttribute("data-id");

  const orderItem = {
    id: itemId,
    name: document.getElementById("detail-name").textContent,
    description: document
      .getElementById("detail-description")
      .textContent.replace("Description: ", ""),
    ingredients: document
      .getElementById("detail-ingredients")
      .textContent.replace("Ingredients: ", ""),
    price: parseFloat(
      document
        .getElementById("detail-price")
        .textContent.replace("Price: $", "")
    ),
    img: document.getElementById("detail-img").src,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(orderItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to your order!");

  document.getElementById("item-detail-overlay").classList.add("hidden");
});
