// Инициализация переменной для хранения корзины
let cart = [];

// Функция для добавления блюда в корзину
function addToCart(dishName, price) {
    const existingDish = cart.find(item => item.name === dishName);
    if (existingDish) {
        existingDish.quantity += 1; // Увеличиваем количество, если блюдо уже в корзине
    } else {
        cart.push({ name: dishName, price: price, quantity: 1 }); // Добавляем новое блюдо
    }
    updateCartDisplay();
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
            <span>${item.name} (x${item.quantity}) - ${item.price * item.quantity} руб.</span>
            <button class="button remove-from-cart" data-name="${item.name}">Удалить</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    document.getElementById('checkout').style.display = 'block'; // Показываем кнопку оформления заказа
}

// Функция для удаления блюда из корзины
function removeFromCart(dishName) {
    cart = cart.filter(item => item.name !== dishName); // Удаляем блюдо из корзины
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

        // Здесь можно добавить код для отправки данных на сервер

        alert(`Заказ оформлен на имя: ${name}, адрес: ${address}, телефон: ${phone}.`);
        
        // Очистка корзины после оформления заказа
        cart = [];
        updateCartDisplay();
        form.reset();
        orderSection.style.display = 'none'; // Скрываем форму после оформления заказа
    };
}

// Привязываем события к кнопкам "Добавить в корзину" и "Удалить"
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dishElement = button.closest('.menu__item'); // Находим родительский элемент блюда
            const dishName = dishElement.querySelector('.menu__item-heading').innerText;
            const priceText = dishElement.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('Цена: ', '').replace(' руб', ''));

            addToCart(dishName, price);
        });
    });

    document.getElementById('checkout').addEventListener('click', checkout);
    
    // Обработчик событий для кнопок "Удалить" в корзине
    document.querySelector('.cart__items').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const dishName = event.target.dataset.name;
            removeFromCart(dishName);
        }
    });
});

updateCartDisplay();