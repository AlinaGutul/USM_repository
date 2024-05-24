// Начнем с объявления массива для хранения транзакций
let transactions = [];

// Функция для добавления транзакции с анимацией
function addTransactionWithAnimation(transaction) {
    const tableBody = document.querySelector('#transaction-table tbody');
    const row = tableBody.insertRow();
    
    // Обрезаем описание до первых 4 слов
    const shortDescription = transaction.description.split(' ').slice(0, 4).join(' ');

    // Добавляем ячейки с данными транзакции
    row.innerHTML = `
        <td>${transaction.id}</td>
        <td>${transaction.date}</td>
        <td>${transaction.category}</td>
        <td>${shortDescription}</td> <!-- Отображаем краткое описание -->
        <td><button class="delete-button" data-id="${transaction.id}">Удалить</button></td>
    `;

    // Определяем цвет строки в зависимости от суммы транзакции
    if (transaction.amount >= 0) {
        row.classList.add('positive');
    } else {
        row.classList.add('negative');
    }

    // Добавляем класс для анимации появления
    row.classList.add('fade-in');

    // Добавляем обработчик события для кнопки удаления
    row.querySelector('.delete-button').addEventListener('click', deleteTransactionWithAnimation);
    
    // Устанавливаем таймер для удаления класса анимации
    setTimeout(() => {
        row.classList.remove('fade-in');
    }, 500);
}

// Функция для удаления транзакции с анимацией
function deleteTransactionWithAnimation(event) {
    const id = parseInt(event.target.dataset.id);
    const row = event.target.closest('tr');
    
    // Добавляем класс для анимации исчезновения
    row.classList.add('fade-out');

    // Устанавливаем таймер для удаления строки из DOM после анимации
    setTimeout(() => {
        row.remove();
    }, 500);

    // Удаляем транзакцию из массива
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // Пересчитываем общую сумму транзакций
    calculateTotal();
}

// Функция для добавления транзакции
function addTransaction(event) {
    event.preventDefault(); // Предотвращаем отправку формы и перезагрузку страницы

    // Получаем данные формы
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    // Создаем объект транзакции
    const transaction = {
        id: Date.now(), // Используем метку времени в качестве уникального идентификатора
        date: new Date().toLocaleString(), // Получаем текущую дату и время
        amount: amount,
        category: category,
        description: description
    };

    // Добавляем транзакцию в массив
    transactions.push(transaction);

    // Вызываем функцию для отображения транзакции в таблице с анимацией
    addTransactionWithAnimation(transaction);

    // Вызываем функцию для пересчета общей суммы транзакций
    calculateTotal();

    // Очищаем форму после добавления транзакции
    document.getElementById('transaction-form').reset();
}

// Функция для удаления транзакции
function deleteTransaction(event) {
    const id = parseInt(event.target.dataset.id);
    
    // Удаляем транзакцию из массива
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // Удаляем строку из таблицы
    event.target.closest('tr').remove();
    
    // Пересчитываем общую сумму транзакций
    calculateTotal();
}

// Функция для подсчета общей суммы транзакций
function calculateTotal() {
    const totalElement = document.getElementById('total');
    const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    totalElement.textContent = `Общая сумма: ${totalAmount}`;
}

// Добавляем обработчик события для формы добавления транзакции
document.getElementById('transaction-form').addEventListener('submit', addTransaction);
