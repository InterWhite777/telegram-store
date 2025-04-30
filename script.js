let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  alert(`✅ Добавлено: ${name}`);
}


function updateCartUI() {
  const cartList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartList.classList.add("overflow-hidden", "px-2");
  cartList.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    // Если корзина пуста, показываем красивое сообщение
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "text-center text-gray-400 text-lg mt-5 animate-fade";
    emptyMessage.innerHTML = "Корзина пуста 🛒";
    cartList.appendChild(emptyMessage);

    // Очищаем блок с итого
    cartTotal.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = `
      w-full 
      bg-gray-800/80 
      border border-gray-600 
      rounded-lg 
      p-3 
      mb-3 
      shadow-md 
      transition 
      transform 
      origin-center 
      hover:scale-105 
      hover:shadow-lg 
      hover:shadow-indigo-500/40 
      duration-300
    `.replace(/\s+/g, ' ').trim();

    li.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <p class="text-lg font-medium text-white">${item.name}</p>
          <p class="text-sm text-gray-400">Количество: ${item.quantity}</p>
        </div>
        <div class="text-right">
          <p class="text-lg font-semibold text-white">${itemTotal}₽</p>
          <button onclick="removeFromCart(${index})" class="mt-1 text-sm text-red-400 hover:underline">Удалить</button>
        </div>
      </div>
    `;
    cartList.appendChild(li);
  });

  cartTotal.innerHTML = `
    <div class="flex justify-between items-center p-2 rounded text-lg font-semibold text-yellow-400">
      <span>💰 Итого:</span>
      <span id="total-amount">${total} ₽</span>
    </div>
  `;
}




// Анимация плавной смены суммы
function animateTotal(oldTotal, newTotal) {
  const totalAmount = document.getElementById("total-amount");
  const duration = 500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(oldTotal + (newTotal - oldTotal) * progress);

    totalAmount.textContent = `${current} ₽`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Подсветка кнопки "Оформить заказ"
function highlightCheckoutButton() {
  const checkoutButton = document.getElementById("checkout-button");
  if (!checkoutButton) return;

  checkoutButton.classList.add("ring", "ring-green-400", "ring-offset-2");

  setTimeout(() => {
    checkoutButton.classList.remove("ring", "ring-green-400", "ring-offset-2");
  }, 500);
}



function submitOrder() {
  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  let total = 0;
  cart.forEach(item => total += item.price * item.quantity);

  const data = {
    items: cart,
    total: total
  };

  const order = {
    items: [...cart],
    total: total,
    date: new Date().toLocaleString()
  };

  // Сохраняем заказ в историю
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
  history.push(order);
  localStorage.setItem("orderHistory", JSON.stringify(history));

  // 🎬 Анимация "падения" карточек перед очисткой корзины
  const cartList = document.getElementById("cart-items");
  const items = cartList.querySelectorAll("li");

  items.forEach((item, i) => {
    item.classList.add("fall-out");
    item.style.animationDelay = `${i * 50}ms`; // задержка для каждой
  });

  setTimeout(() => {
    cart = [];
    updateCartUI();
  }, items.length * 50 + 400); // подождём пока закончится анимация

  if (window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    alert("✅ Заказ отправлен!");
    backToMain();
  } else {
    alert("❌ Ошибка отправки!");
  }
}






function openSection(section) {
  const sections = ["main", "store-section", "cart-section", "profile-section"];

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  document.getElementById(`${section}-section`).classList.remove("hidden");

  if (section === "cart") updateCartUI();
  if (section === "profile") loadProfileInfo();
}







function backToMain() {
  openSection("store");
}







function removeFromCart(index) {
  cart.splice(index, 1);

  if (cart.length === 0) {
    const cartList = document.getElementById("cart-items");
    const items = cartList.querySelectorAll("li");
    items.forEach((item, i) => {
      item.classList.add("fall-out");
      item.style.animationDelay = `${i * 50}ms`;
    });

    setTimeout(() => {
      updateCartUI();
    }, items.length * 50 + 400);
  } else {
    updateCartUI();
  }
}







function loadProfileInfo() {
  const tg = window.Telegram.WebApp;
  const usernameSpan = document.getElementById("username");
  const user = tg.initDataUnsafe?.user;

  if (user) {
    const name = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    usernameSpan.textContent = name || "Неизвестный пользователь";
  } else {
    usernameSpan.textContent = "Гость";
  }

  // Загрузка истории заказов
  const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const historyList = document.getElementById("purchase-history");

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<li class="text-gray-500 italic">Покупок пока нет</li>`;
    return;
  }

  history.forEach((order, index) => {
    const li = document.createElement("li");
    li.classList.add("border", "border-gray-600", "rounded", "p-2");

    const summary = document.createElement("div");
    summary.className = "flex justify-between items-center cursor-pointer";
    summary.innerHTML = `
      <span>📦 Заказ #${index + 1} — ${order.date}</span>
      <span class="text-green-400 font-semibold">${order.total}₽</span>
    `;

    const details = document.createElement("div");
    details.classList.add("hidden", "mt-2", "text-sm", "text-gray-300");

        // Словарь для замены названий товаров
    const nameMapping = {
      "Steam Game": "🕹 Игра в Steam",
      "Project9class": "⛏ Предмет Minecraft",
      "Roblox Item": "🎮 Предмет Roblox",
      "Steam Account": "Рандомный аккаунт Steam",
      // сюда добавляй свои замены
    };
    
    order.items.forEach(item => {
      let displayName = nameMapping[item.name] || item.name;
      const p = document.createElement("p");
      p.textContent = `${displayName} × ${item.quantity} = ${item.price * item.quantity}₽`;
      details.appendChild(p);
    });


    summary.onclick = () => {
      details.classList.toggle("hidden");
    };

    li.appendChild(summary);
    li.appendChild(details);
    historyList.appendChild(li);
  });
}

