function buy(product, price) {
  const data = { product, price };
  Telegram.WebApp.sendData(JSON.stringify(data));
  Telegram.WebApp.close();
}