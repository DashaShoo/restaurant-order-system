const menuItems = [
    {
        name: "Цезарь с курицей",
        image: "images/cesar.jpg",
        composition: "Состав: Романо, куриное филе, гренки, пармезан, соус Цезарь (яичный желток, анчоусы, оливковое масло, лимонный сок)",
        price: 450
    },
    {
        name: "Паста Карбонара",
        image: "images/karbonara.jpg",
        composition: "Состав: Спагетти, бекон (или панчетта), яйца, пармезан, черный перец",
        price: 500
    },
    {
        name: "Лосось на гриле",
        image: "images/losos.jpg",
        composition: "Состав: Филе лосося, лимон, оливковое масло, зелень (укроп или петрушка), гарнир из овощей",
        price: 800
    },
    {
        name: "Куриные крылышки Баффало",
        image: "images/krylya.jpg",
        composition: "Состав: Куриные крылышки, острый соус Баффало, сельдерей, соус блю чиз",
        price: 600
    },
    {
        name: "Тартар из тунца",
        image: "images/tartar.jpg",
        composition: "Состав: Сырой тунец, авокадо, соевый соус, кунжутное масло, зеленый лук",
        price: 900
    },
    {
        name: "Бургер с говядиной",
        image: "images/burger.jpg",
        composition: "Состав: Говяжья котлета, булочка, салат айсберг, помидор, огурец, сыр чеддер, соус (кетчуп и майонез)",
        price: 650
    },
    {
        name: "Ризотто с грибами",
        image: "images/rizotto.jpg",
        composition: "Состав: Арборио рис, грибы (шампиньоны или белые), лук, чеснок, белое вино, пармезан",
        price: 700
    },
    {
        name: "Салат Нисуаз",
        image: "images/nisuaz.jpg",
        composition: "Состав: Тунец (консервированный или свежий), зеленая фасоль, картофель, яйца вкрутую, оливки, помидоры черри.",
        price: 550
    },
    {
        name: "Пирог с курицей и грибами",
        image: "images/pirog.jpg",
        composition: "Состав: Тесто (слоеное или песочное), куриное филе, грибы (шампиньоны), лук, сливки",
        price: 500
    },
    {
        name: "Тако с говядиной",
        image: "images/tako.jpg",
        composition: "Состав: Тортилья (кукурузная или пшеничная), говяжий фарш, салат айсберг, помидоры, сыр фета или чеддер",
        price: 550
    },
    {
        name: "Креветки в чесночном соусе",
        image: "images/krevetki.jpg",
        composition: "Состав: Креветки крупные, чеснок, оливковое масло, лимонный сок и зелень (петрушка).",
        price: 850
    },
    {
        name: "Стейк Рибай",
        image: "images/stake.jpg",
        composition: "Состав: Филе рибай (мраморная говядина), соль, черный перец, оливковое масло.",
        price: 1200
    }
];



// Инициализация переменной для хранения корзины
let cart = [];

// Функция для добавления блюда в корзину
function addToCart(dishName, price) {
    const existingDish = cart.find(item => item.name === dishName);
    
    if (existingDish) {
        existingDish.quantity += 1; // Увеличиваем количество, если блюдо уже в корзине
    } else {
        cart.push({ name: dishName, price, quantity: 1 }); // Добавляем новое блюдо
    }
    
    updateCartDisplay();
    
    // Анимация добавления в корзину
    const notification = document.createElement('div');
    notification.innerText = `${dishName} добавлено в корзину!`;
    notification.className = 'notification';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
       notification.remove();
    }, 2000); // Удаляем уведомление через 2 секунды
}

// Функция для обновления отображения корзины
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart__items');
    cartItemsContainer.innerHTML = ''; // Очищаем текущее содержимое

    if (cart.length === 0) {
       cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
       document.getElementById('checkout').style.display = 'none'; // Скрываем кнопку оформления заказа
       return;
   }

   cart.forEach(item => {
       const itemElement = document.createElement('div');
       itemElement.className = 'cart-item';
       itemElement.innerHTML = `
           <span class="cart-item__text">${item.name} (x${item.quantity}) - ${item.price * item.quantity} руб.</span>
           <button class="button remove-from-cart" data-name="${item.name}">Удалить</button>
       `;
       cartItemsContainer.appendChild(itemElement);
   });

   document.getElementById('checkout').style.display = 'block'; // Показываем кнопку оформления заказа
}

// Функция для уменьшения количества блюда в корзине
function removeFromCart(dishName) {
   const existingDish = cart.find(item => item.name === dishName);
   
   if (existingDish) {
       if (existingDish.quantity > 1) {
           existingDish.quantity -= 1; // Уменьшаем количество на 1
       } else {
           cart = cart.filter(item => item.name !== dishName); // Удаляем блюдо из корзины если количество равно 0
       }
   }
   
   updateCartDisplay();
}

// Функция для обработки оформления заказа
function checkout() {
   const orderSection = document.getElementById('order');
   orderSection.style.display = 'block'; // Показываем форму оформления заказа

   const form = document.getElementById('checkout-form');
   form.onsubmit = function(event) {
       event.preventDefault(); // Предотвращаем стандартное поведение формы

       const name = document.getElementById('name').value;
       const address = document.getElementById('address').value;
       const phone = document.getElementById('phone').value; // Получаем номер телефона

       const orderData = {
           name,
           address,
           phone,
           items: cart // Передаем содержимое корзины
       };

       fetch('http://localhost:5000/api/order', { // URL вашего бэкенда
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(orderData)
       })
       .then(response => response.json())
       .then(data => {
           alert(data.message); // Уведомление об успешном оформлении заказа

           // Очистка корзины после оформления заказа
           cart = [];
           updateCartDisplay();
           form.reset();
           orderSection.style.display = 'none'; // Скрываем форму после оформления заказа
       })
       .catch(error => console.error('Ошибка при оформлении заказа:', error));
   };
}

// Функция для отрисовки карточек меню из массива
function renderMenuItems() {
   const menuList = document.querySelector('.menu__list');
   const template = document.getElementById('item-template');

   menuItems.forEach(item => {
       const clone = template.content.cloneNode(true);
       
       clone.querySelector('.menu__item-heading').innerText = item.name;
       clone.querySelector('.menu__pic').src = item.image;
       clone.querySelector('.menu__composition').innerText = item.composition;
       clone.querySelector('.price').innerText = `Цена: ${item.price} руб`;
       
       // Добавляем обработчик события для кнопки "Добавить в корзину"
       const addToCartButton = clone.querySelector('.add-to-cart');
       addToCartButton.addEventListener('click', () => {
           addToCart(item.name, item.price);
       });

       menuList.appendChild(clone);
   });
}

// Привязываем события к кнопкам при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
   renderMenuItems(); // Отрисовываем блюда при загрузке страницы

   document.getElementById('checkout').addEventListener('click', checkout);
   
   // Обработчик событий для кнопок удаления в корзине
   document.querySelector('.cart__items').addEventListener('click', (event) => {
       if (event.target.classList.contains('remove-from-cart')) {
           const dishName = event.target.dataset.name;
           removeFromCart(dishName);
       }
   });
});

// Обновление отображения корзины при загрузке страницы
updateCartDisplay();