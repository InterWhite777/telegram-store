
let tg = window.Telegram.WebApp;
tg.expand();

async function buy(productId) {
  const response = await fetch(`https://your-backend-url/pay/${productId}`, { method: 'POST' });
  const data = await response.json();
  if (data && data.pay_url) {
    tg.openLink(data.pay_url);
  } else {
    alert("Ошибка при создании счёта");
  }
}
