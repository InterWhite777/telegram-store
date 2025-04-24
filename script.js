let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  alert(`✅ Добавлено: ${name}`);
}

function updateCartUI() {
  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-gray-800 p-4 rounded shadow";

    li.innerHTML = `
      <div>
        <p class="text-lg font-medium">${item.name}</p>
        <p class="text-sm text-gray-350">Количество: ${item.quantity}</p>
      </div>
      <div class="text-right">
        <p class="text-lg font-semibold">${itemTotal}₽</p>
        <button onclick="removeFromCart(${index})" class="mt-1 text-sm text-red-500 hover:underline">Удалить</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  cartTotal.innerHTML = `💰 Итого: <span id="total-amount">${total}₽</span>`;
}


function openSection(section) {
 // document.getElementById("store-section").classList.add("hidden");
 // document.getElementById("cart-section").classList.add("hidden");
 // document.getElementById("profile-section").classList.add("hidden");
  const sections = ["main", "store-section", "cart-section", "profile-section"];
  sections.forEach(id => document.getElementById(id).classList.add("hidden"));

  document.getElementById(`${section}-section`).classList.remove("hidden");

  if (section === "cart") updateCartUI();
  if (section === "profile") loadProfileInfo();
}

function backToMain() {
 // document.getElementById("store-section").classList.remove("hidden");
 // document.getElementById("cart-section").classList.add("hidden");
 // document.getElementById("profile-section").classList.add("hidden");
  openSection("store");
}

function submitOrder() {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  const data = {
    items: cart,
    total: total
  };


  if (window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    alert("✅ Заказ отправлен!");
    cart = [];
    backToMain();
  } else {
    alert("❌ Ошибка отправки!");
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Загрузка профиля
function loadProfileInfo() {
  // Telegram WebApp API (если доступен)
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const username = user?.first_name || "Гость";
  document.getElementById("username").textContent = username;

  // Пример истории покупок (позже можно заменить на реальную)
  const history = document.getElementById("purchase-history");
  history.innerHTML = `
    <li>Roblox Item – 150₽</li>
    <li>Steam Game – 600₽</li>
  `;

