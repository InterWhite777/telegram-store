const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { name: "🎧 Наушники", price: 1990, auto: true },
  { name: "⌚️ Умные часы", price: 3490, auto: false },
  { name: "📱 Телефон", price: 5990, auto: true }
];

let cart = [];

function addToCart(name) {
  cart.push(name);
  alert("Товар добавлен в корзину: " + name);
}

function checkout() {

  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  let order = cart.join(", ");
  tg.sendData(JSON.stringify({ action: "buy", order: order }));



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


  tg.close();

}

const productList = document.getElementById("product-list");

products.forEach(p => {
  const el = document.createElement("div");
  el.className = "product";
  el.innerHTML = `
    <h3>${p.name}</h3>
    <p>Цена: ${p.price}₽</p>
    <p>Выдача: ${p.auto ? "автоматическая" : "вручную"}</p>
    <button onclick="addToCart('${p.name}')">Добавить в корзину</button>
  `;
  productList.appendChild(el);
});
