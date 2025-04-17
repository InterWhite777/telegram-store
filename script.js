let cart = [];

function buy(item, price) {
  cart.push({ item, price });
  showNotification("✅ Товар добавлен в корзину");
  console.log(cart); // можно удалить — для отладки
}

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.innerText = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2000);
}

function openCart() {
  if (cart.length === 0) {
    showNotification("🛒 Корзина пуста");
    return;
  }

  let summary = "🧾 Ваш заказ:\n";
  let total = 0;

  cart.forEach(({ item, price }, i) => {
    summary += `${i + 1}. ${item} — ${price} ₽\n`;
    total += price;
  });

  summary += `\nИтого: ${total} ₽`;

  // Отправка данных в Telegram-бота
  Telegram.WebApp.sendData(JSON.stringify({ type: "cart", items: cart }));

  showNotification("✅ Заказ отправлен");
  cart = []; // очищаем корзину
}
