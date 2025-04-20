const tg = window.Telegram.WebApp;
tg.expand();

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

const products = [
  { name: "Roblox: 100 Robux", price: 120 },
  { name: "Minecraft Premium", price: 450 },
  { name: "Steam: CS2 скины", price: 999 },
];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  alert(`Товар "${product.name}" добавлен в корзину!`);
}

function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;
  products.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "bg-white p-4 rounded shadow";
    item.innerHTML = `
      <h3 class="text-lg font-semibold">${p.name}</h3>
      <p class="text-gray-700">${p.price}₽</p>
      <button onclick="addToCart(products[${i}])" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Добавить</button>
    `;
    list.appendChild(item);
  });
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow flex justify-between items-center";
    div.innerHTML = `
      <span>${item.name} — ${item.price}₽</span>
      <button onclick="removeFromCart(${i})" class="text-red-500">Удалить</button>
    `;
    container.appendChild(div);
  });
  document.getElementById("total").innerText = "Итого: " + total + "₽";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function checkout() {
  const data = {
    user: tg.initDataUnsafe.user,
    cart: cart
  };
  fetch("https://api.telegram.org/bot7940302366:AAFNwbWvIJIo2SVCOIFm5aVg8n-jrVkDWiQ/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: "<YOUR_CHAT_ID>",
      text: `🛍 Новый заказ от ${data.user.username || data.user.first_name}
` +
        data.cart.map(p => `• ${p.name} — ${p.price}₽`).join("\n") +
        `\nИтого: ${data.cart.reduce((s, p) => s + p.price, 0)}₽`
    })
  }).then(() => {
    alert("Заказ оформлен!");
    cart = [];
    saveCart();
    window.location.href = "index.html";
  });
}

function loadAccount() {
  if (document.getElementById("user-name")) {
    document.getElementById("user-name").innerText = tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
    document.getElementById("user-id").innerText = tg.initDataUnsafe.user.id;
  }
}

renderProducts();
renderCart();
loadAccount();
