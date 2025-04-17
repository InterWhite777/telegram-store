const tg = window.Telegram.WebApp;
tg.expand();

const cart = [];
const cartItemsElement = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const confirmation = document.getElementById("confirmation");

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  cartItemsElement.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} — ${item.price} ₽`;
    cartItemsElement.appendChild(li);
    total += item.price;
  });

  totalElement.textContent = `Итого: ${total} ₽`;
}

function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  confirmation.style.display = "block";

  setTimeout(() => {
    confirmation.style.display = "none";
    cart.length = 0;
    updateCart();
  }, 2000);

  tg.sendData(JSON.stringify(cart)); // Отправка данных в бота
}

// Показ имени пользователя
const userInfo = document.getElementById("user-info");
if (tg.initDataUnsafe.user) {
  const { first_name, last_name, username } = tg.initDataUnsafe.user;
  userInfo.innerText = `👤 ${first_name} ${last_name || ""} (@${username || "нет"})`;
}
