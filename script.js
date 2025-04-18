let cart = [];

function addToCart(button) {
  const product = button.closest(".product");
  const id = product.dataset.id;
  const title = product.dataset.title;
  const price = parseInt(product.dataset.price);

  const index = cart.findIndex(item => item.id === id);
  if (index >= 0) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }

  alert(`${title} добавлен в корзину`);
}

function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста");
    return;
  }

  Telegram.WebApp.sendData(JSON.stringify(cart));
  Telegram.WebApp.close();
}
