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

  cartList.classList.add("overflow-hidden", "px-2"); // Добавил это

  cartList.innerHTML = "";

  let total = 0;

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
    <div class="bg-yellow-200 text-black font-semibold rounded-lg p-3 mt-4 flex justify-between items-center shadow-inner">
      <span>💰 Итого:</span> 
      <span id="total-amount">${total}₽</span>
    </div>
  `;
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

    // Сохранение истории покупок
  let history = JSON.parse(localStorage.getItem("purchaseHistory") || "[]");
  history.push(...cart); // добавляем все товары из корзины
  localStorage.setItem("purchaseHistory", JSON.stringify(history));

  if (window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify(data));
    alert("✅ Заказ отправлен!");
    cart = [];
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
  updateCartUI();
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

