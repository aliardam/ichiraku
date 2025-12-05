function loadOrder() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("order-list");
  const totalEl = document.getElementById("total-price");

  list.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    list.innerHTML = "<p>Your order is empty.</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("order-item");

    div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
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

// Remove item
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = e.target.dataset.index;

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    loadOrder(); // refresh
  }
});

// Clear entire order
document.getElementById("clear-order-btn").addEventListener("click", () => {
  localStorage.removeItem("cart");
  loadOrder();
});

// Load on page start
loadOrder();
