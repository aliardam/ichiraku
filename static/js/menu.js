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

    const imageFile = itemImages[item.name] || "placeholder.png";
    const imagePath = `${API_BASE_URL}/static/assets/${imageFile}`;

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
