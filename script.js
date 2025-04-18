
function buy(product, price, paymentType = 'yoomoney') {
  let user = window.Telegram.WebApp.initDataUnsafe?.user || {};
  const data = {
    товар: product,
    сумма: price,
    покупатель: user.username || user.first_name || 'неизвестен',
    способ: paymentType
  };
  const message = JSON.stringify(data, null, 2);

  Telegram.WebApp.sendData(message);

  // Переход на оплату
  if (paymentType === 'yoomoney') {
    window.open(`https://yoomoney.ru/to/4100119106703740`, '_blank');
  } else if (paymentType === 'qiwi') {
    window.open(`https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=YOUR_QIWI_NUMBER&amountInteger=${price}&currency=643&blocked[0]=account`, '_blank');
  }

  alert("✅ Заказ оформлен! Информация отправлена.");
}
