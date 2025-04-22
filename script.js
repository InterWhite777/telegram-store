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

  cart.forEach(item => {
    const itemText = `${item.name} x${item.quantity} = ${item.price * item.quantity}₽`;
    const li = document.createElement("li");
    li.textContent = itemText;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `💰 Итого: ${total}₽`;
}

function openSection(section) {
  document.getElementById("main").classList.add("hidden");
  document.getElementById("store-section").classList.add("hidden");
  document.getElementById("cart-section").classList.add("hidden");
  document.getElementById("profile-section").classList.add("hidden");

  document.getElementById(`${section}-section`).classList.remove("hidden");

  if (section === "cart") updateCartUI();
}

function backToMain() {
  document.getElementById("store-section").classList.add("hidden");
  document.getElementById("cart-section").classList.add("hidden");
  document.getElementById("profile-section").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");
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
