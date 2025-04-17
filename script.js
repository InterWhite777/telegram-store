function buy(item, price) {
  const data = {
    item: item,
    price: price
  };

  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.disableClosingConfirmation(); // <-- предотвращаем автоматическое закрытие
    Telegram.WebApp.sendData(JSON.stringify(data));
  } else {
    alert("Telegram WebApp API не найден");
  }
}
