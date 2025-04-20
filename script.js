let cart = [];

function buy(name, price, manual = false) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.count += 1;
  } else {
    cart.push({ name, price, count: 1, manual });
  }
  alert(`Добавлено в корзину: ${name}`);
}

function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста");
    return;
  }

  const order = cart.map(item => `${item.name} x${item.count} (${item.manual ? "ручная выдача" : "авто"})`).join(", ");
  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  const data = {
    order: order,
    total: total
  };

  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(data));
    Telegram.WebApp.close();
  } else {
    alert("WebApp не поддерживается.");
  }
}

document.getElementById("checkout").addEventListener("click", () => {
  const order = cart.map(item => `${item.name} x${item.count}`).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
  
  const data = {
      order,
      total
  };

  Telegram.WebApp.sendData(JSON.stringify(data)); // 👈 вот это важно
});
