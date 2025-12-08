const API_BASE_URL = "http://localhost:5000";

// Retrieve the logged-in user (Saved during Login)
const user = JSON.parse(localStorage.getItem("user"));

// ------------------------------------------------------
// PART 1: CURRENT CART (Local Storage)
// ------------------------------------------------------
function loadOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("order-list");
  const totalEl = document.getElementById("total-price");

  // Safety check if elements exist
  if (!list || !totalEl) return;

  list.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("order-item");

    // Ensure image source is correct
    // If the image link already has "http...", use it. Otherwise, add base URL.
    // (This depends on how you saved it in menu.js. Usually, keep it simple:)
    const imgSrc = item.img; 

    div.innerHTML = `
            <img src="${imgSrc}" alt="${item.name}" style="width:100px; height:100px; object-fit:cover;">
            <div>
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <strong>$${item.price.toFixed(2)}</strong>
            </div>
            <button class="remove-btn" data-index="${index}">✖</button>
        `;

    list.appendChild(div);
  });

  totalEl.textContent = "$" + total.toFixed(2);
}

// Event: Remove single item from cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    loadOrder(); // Refresh Cart UI
  }
});

// Event: Clear entire cart
const clearBtn = document.getElementById("clear-order-btn");
if(clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      loadOrder();
    });
}

// ------------------------------------------------------
// PART 2: CHECKOUT (Send Order to Database)
// ------------------------------------------------------
const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!user || !user.id) {
      alert("Please login to place an order.");
      // Optional: Redirect to login
      // window.location.href = "/login"; 
      return;
    }

    // 1. Group items for Backend: { id: 1, quantity: 2 }
    const itemMap = {};
    cart.forEach((item) => {
      // Use item.id (ensure your menu.js saves 'id' into localStorage)
      if (itemMap[item.id]) {
        itemMap[item.id].quantity += 1;
      } else {
        itemMap[item.id] = { id: item.id, quantity: 1 };
      }
    });
    
    // Convert map to array
    const itemsPayload = Object.values(itemMap);

    // 2. Send to API
    try {
      const response = await fetch(`${API_BASE_URL}/api/place_order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          items: itemsPayload,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Order placed successfully! Order ID: " + result.order_id);
        
        // Clear Local Storage Cart
        localStorage.removeItem("cart");
        loadOrder(); // Update Cart UI (Empty)
        
        // Reload History
        loadOrderHistory(); 
      } else {
        alert("Error placing order: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server.");
    }
  });
}

// ------------------------------------------------------
// PART 3: ORDER HISTORY (Fetch from Database)
// ------------------------------------------------------
async function loadOrderHistory() {
  const historyContainer = document.getElementById("order-history-list");

  // If there is no history container in HTML, stop here
  if (!historyContainer) return;

  if (!user || !user.id) {
    historyContainer.innerHTML = "<p>Please login to view order history.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/my_orders/${user.id}`);
    const orders = await response.json();

    historyContainer.innerHTML = ""; // Clear list

    if (orders.length === 0) {
      historyContainer.innerHTML = "<p>No past orders found.</p>";
      return;
    }

    // Loop through database orders
    orders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("history-card"); // You can style this class in CSS
      orderCard.style.border = "1px solid #ccc";
      orderCard.style.padding = "15px";
      orderCard.style.marginBottom = "15px";

      // Create HTML list of items inside this order
      const itemsListHtml = order.items
        .map((i) => `<li>${i.name} x${i.quantity} - $${i.price}</li>`)
        .join("");

      orderCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:bold;">
            <span>Order #${order.order_id}</span>
            <span>${order.date}</span>
        </div>
        <ul style="margin-bottom:10px;">${itemsListHtml}</ul>
        <div style="display:flex; justify-content:space-between; border-top:1px solid #eee; padding-top:5px;">
            <span>Status: ${order.status}</span>
            <span>Total: <strong>$${order.total.toFixed(2)}</strong></span>
        </div>
      `;

      historyContainer.appendChild(orderCard);
    });

  } catch (error) {
    console.error("Error fetching history:", error);
    historyContainer.innerHTML = "<p>Error loading history.</p>";
  }
}

// ------------------------------------------------------
// INITIALIZE
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadOrder();        // Load Local Cart
    loadOrderHistory(); // Load Database History
});