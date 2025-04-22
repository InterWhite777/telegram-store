const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartCount();
  animateCart();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = count;
}

function animateCart() {
  const icon = document.getElementById("cart-icon");
  if (icon) {
    icon.classList.add("animate-bounce");
    setTimeout(() => icon.classList.remove("animate-bounce"), 300);
  }
}

function goToCart() {
  document.getElementById("store").classList.add("hidden");
  document.getElementById("cabinet").classList.add("hidden");
  document.getElementById("cart").classList.remove("hidden");
  renderCart();
}

function goToCabinet() {
  document.getElementById("store").classList.add("hidden");
  document.getElementById("cart").classList.add("hidden");
  document.getElementById("cabinet").classList.remove("hidden");
}

function goBack() {
  document.getElementById("store").classList.remove("hidden");
  document.getElementById("cart").classList.add("hidden");
  document.getElementById("cabinet").classList.add("hidden");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p class='text-center text-gray-500'>Корзина пуста</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "flex justify-between py-2 border-b";
    div.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>${item.price * item.quantity}₽</span>
    `;
    container.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").innerText = `Итого: ${total}₽`;
}

function sendOrder() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const data = {
    items: cart,
    total: total
  };
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(data));
    Telegram.WebApp.close();
  }
}
