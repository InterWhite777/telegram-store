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
