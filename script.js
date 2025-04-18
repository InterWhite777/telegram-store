function buy(productId, price) {
  const tg = window.Telegram.WebApp;
  const username = tg.initDataUnsafe.user.username || "без ника";
  const payment_method = "YooMoney"; // по умолчанию

  tg.sendData(`${productId}:${username}:${payment_method}`);

  tg.close();
}
