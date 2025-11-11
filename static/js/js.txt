const categories = document.querySelectorAll(".category");
const itemsSection = document.getElementById("items");
const categoriesSection = document.getElementById("categories");
const backBtn = document.getElementById("back-btn");
const categoryTitle = document.getElementById("category-title");
const itemList = document.getElementById("item-list");

// Your Flask backend URL - UPDATE THIS WITH YOUR ACTUAL FLASK SERVER URL
const API_BASE_URL = 'http://localhost:5000'; // Change if your Flask server runs on different port

// Function to fetch categories from backend
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Function to fetch items by category from backend
async function fetchItemsByCategory(categoryName) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/menu/${categoryName}`);
        if (!response.ok) {
            throw new Error('Category not found');
        }
        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

// Map your frontend category names to backend category names
const categoryMapping = {
    'sushi': 'Main Dishes', // Sushi items are in Main Dishes in your DB
    'Noodles': 'Main Dishes', // Noodles are in Main Dishes
    'drinks': 'Drinks' // Drinks match directly
};

categories.forEach((cat) => {
    cat.addEventListener("click", async () => {
        const frontendCategory = cat.dataset.category;
        const backendCategory = categoryMapping[frontendCategory];
        await showItems(backendCategory, frontendCategory);
    });
});

backBtn.addEventListener("click", () => {
    itemsSection.classList.add("hidden");
    categoriesSection.classList.remove("hidden");
});

async function showItems(backendCategory, frontendCategory) {
    // Show loading state
    itemList.innerHTML = "<p>Loading...</p>";
    categoryTitle.textContent = frontendCategory.charAt(0).toUpperCase() + frontendCategory.slice(1);

    const items = await fetchItemsByCategory(backendCategory);
    
    itemList.innerHTML = "";
    
    if (items.length === 0) {
        itemList.innerHTML = "<p>No items found for this category.</p>";
    } else {
        // Filter items based on frontend category
        let filteredItems = items;
        if (frontendCategory === 'sushi') {
            filteredItems = items.filter(item => 
                item.name.includes('Roll') || item.name.includes('Sushi')
            );
        } else if (frontendCategory === 'Noodles') {
            filteredItems = items.filter(item => 
                item.name.includes('Ramen') || item.name.includes('Noodle')
            );
        } else if (frontendCategory === 'drinks') {
            filteredItems = items.filter(item => item.is_drink);
        }

        if (filteredItems.length === 0) {
            itemList.innerHTML = "<p>No items found for this category.</p>";
        } else {
            filteredItems.forEach((item) => {
                const div = document.createElement("div");
                div.classList.add("item");
                
                // Create image path based on item name
                const imageName = item.name.toLowerCase().replace(/ /g, '') + '.jpg';
                const imagePath = `${API_BASE_URL}/static/assets/${imageName}`;
                
                div.innerHTML = `
                    <img src="${imagePath}" alt="${item.name}" onerror="this.src='${API_BASE_URL}/static/assets/placeholder.jpg'">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <strong>$${item.price.toFixed(2)}</strong>
                `;
                itemList.appendChild(div);
            });
        }
    }

    categoriesSection.classList.add("hidden");
    itemsSection.classList.remove("hidden");
}