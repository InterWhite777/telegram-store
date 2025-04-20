let cart = [];

function renderProducts() {
  const container = document.getElementById("products");
  products.forEach(product => {
    const item = document.createElement("div");
    item.innerHTML = `
      <img src="${product.image}" width="200" height="150" /><br/>
      <strong>${product.name}</strong><br/>
      <span>${product.price}₽</span><br/>
      <button onclick="addToCart(${product.id})">Добавить в корзину</button>
    `;
    container.appendChild(item);
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.name + " - " + item.price + "₽";
    cartList.appendChild(li);
  });
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("total").textContent = "Итого: " + total + "₽";
}

function checkout() {
  const data = {
    order: cart.map(item => item.name).join(", "),
    total: cart.reduce((sum, item) => sum + item.price, 0)
  };
  Telegram.WebApp.sendData(JSON.stringify(data));
  Telegram.WebApp.close();
}

window.onload = () => {
  renderProducts();
};
