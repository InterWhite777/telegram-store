const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

const products = [
  { name: "🎧 Наушники", price: 1990, auto: true },
  { name: "⌚️ Умные часы", price: 3490, auto: false },
  { name: "📱 Телефон", price: 5990, auto: true }
];

// Добавить товар в корзину
function addToCart(productName) {
  const product = products.find(p => p.name === productName);
  if (product) {
    cart.push(product);
    alert(`${product.name} добавлен в корзину`);
  }
}

// Показать корзину и оплату
function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста");
    return;
  }

  const summary = cart.map(p => `${p.name} - ${p.price}₽`).join("\n");
  const total = cart.reduce((acc, p) => acc + p.price, 0);

  if (confirm(`Ваш заказ:\n${summary}\n\nИтого: ${total}₽\nПерейти к оплате?`)) {
    const paymentLink = `https://yoomoney.ru/to/4100119106703740`; // сюда — ваша ссылка YooMoney
    const payload = {
      cart,
      total,
      user: tg.initDataUnsafe.user,
    };

    tg.sendData(JSON.stringify(payload)); // отправка в бот
    window.open(paymentLink, "_blank"); // открытие YooMoney
  }
}
