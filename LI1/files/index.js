const fs = require('fs'); // Подключаем модуль для работы с файловой системой
const readline = require('readline'); // Подключаем модуль для работы с вводом-выводом через командную строку

// Класс для анализа транзакций
class TransactionAnalyzer {
    constructor(transactions) {
        this.transactions = transactions; // Инициализируем список транзакций
    }

    addTransaction(transaction) {
        this.transactions.push(transaction); // Добавление новой транзакции
        console.log('Транзакция успешно добавлена.');
    }

    getAllTransactions() {
        return this.transactions; // Возвращаем все транзакции
    }

    getUniqueTransactionType() {
        return [...new Set(this.transactions.map(t => t.transaction_type))]; // Возвращаем уникальные типы транзакций
    }

    calculateTotalAmount() {
        return this.transactions.reduce((acc, t) => acc + t.transaction_amount, 0); // Рассчитываем общую сумму всех транзакций
    }

    calculateTotalAmountByDate(year, month, day) {
        return this.transactions.filter(t => {
            const date = new Date(t.transaction_date); // Преобразуем дату транзакции в объект Date
            return (!year || date.getFullYear() === year) &&
                (!month || date.getMonth() + 1 === month) &&
                (!day || date.getDate() === day); // Фильтруем транзакции по указанной дате
        }).reduce((acc, t) => acc + t.transaction_amount, 0); // Рассчитываем общую сумму отфильтрованных транзакций
    }

    getTransactionByType(type) {
        return this.transactions.filter(t => t.transaction_type === type); // Возвращаем транзакции указанного типа
    }

    getTransactionsInDateRange(startDate, endDate) {
        return this.transactions.filter(t => {
            const date = new Date(t.transaction_date); // Преобразуем дату транзакции в объект Date
            return date >= new Date(startDate) && date <= new Date(endDate); // Фильтруем транзакции по диапазону дат
        });
    }

    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(t => t.merchant_name === merchantName); // Возвращаем транзакции указанного торгового места
    }

    calculateAverageTransactionAmount() {
        return this.calculateTotalAmount() / this.transactions.length; // Рассчитываем среднюю сумму транзакций
    }

    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(t => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount); // Фильтруем транзакции по диапазону сумм
    }

    calculateTotalDebitAmount() {
        return this.transactions.filter(t => t.transaction_type === 'debit')
            .reduce((acc, t) => acc + t.transaction_amount, 0); // Рассчитываем общую сумму дебетовых транзакций
    }

    findMostTransactionsMonth() {
        const monthYearCount = this.transactions.reduce((acc, t) => {
            const date = new Date(t.transaction_date); // Преобразуем дату транзакции в объект Date
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Форматируем месяц и год
            acc[monthYear] = (acc[monthYear] || 0) + 1; // Считаем количество транзакций за каждый месяц
            return acc;
        }, {});

        const mostTransactionsMonthYear = Object.keys(monthYearCount).reduce((a, b) => monthYearCount[a] > monthYearCount[b] ? a : b); // Находим месяц с наибольшим количеством транзакций

        return mostTransactionsMonthYear; // Возвращаем результат
    }

    findMostDebitTransactionMonth() {
        const monthCount = this.transactions.filter(t => t.transaction_type === 'debit')
            .reduce((acc, t) => {
                const date = new Date(t.transaction_date); // Преобразуем дату транзакции в объект Date
                const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Форматируем месяц и год
                acc[monthYear] = (acc[monthYear] || 0) + 1; // Считаем количество дебетовых транзакций за каждый месяц
                return acc;
            }, {});

        const mostTransactionsDebitMonthYear = Object.keys(monthCount).reduce((a, b) => monthCount[a] > monthCount[b] ? a : b); // Находим месяц с наибольшим количеством дебетовых транзакций

        return mostTransactionsDebitMonthYear; // Возвращаем результат
    }

    mostTransactionTypes() {
        const typeCount = this.transactions.reduce((acc, t) => {
            acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1; // Считаем количество транзакций каждого типа
            return acc;
        }, {});

        if (typeCount.debit > typeCount.credit) {
            return 'debit'; // Возвращаем 'debit', если дебетовых транзакций больше
        } else if (typeCount.credit > typeCount.debit) {
            return 'credit'; // Возвращаем 'credit', если кредитных транзакций больше
        } else {
            return 'equal'; // Возвращаем 'equal', если количество дебетовых и кредитных транзакций одинаково
        }
    }

    getTransactionsBeforeDate(date) {
        return this.transactions.filter(t => new Date(t.transaction_date) < new Date(date)); // Возвращаем транзакции до указанной даты
    }

    findTransactionById(id) {
        return this.transactions.find(t => t.transaction_id === id); // Находим транзакцию по ID
    }

    mapTransactionDescriptions() {
        return this.transactions.map(t => t.transaction_description); // Возвращаем описания всех транзакций
    }
}

// Загрузка данных из файла transactions.json
const transactions = JSON.parse(fs.readFileSync('transactions.json', 'utf8')); // Читаем файл и парсим его содержимое

// Создание экземпляра TransactionAnalyzer
const analyzer = new TransactionAnalyzer(transactions); // Создаем новый экземпляр TransactionAnalyzer с загруженными транзакциями

// Настройка интерфейса readline
const rl = readline.createInterface({
    input: process.stdin, // Устанавливаем стандартный ввод
    output: process.stdout // Устанавливаем стандартный вывод
});

const menu = `
=====================================
              М Е Н Ю
=====================================
1. Добавить транзакцию
2. Показать все транзакции
3. Показать уникальные типы транзакций
4. Рассчитать общую сумму транзакций
5. Рассчитать сумму транзакций по дате
6. Показать транзакции по типу
7. Показать транзакции в диапазоне дат
8. Показать транзакции по торговому месту
9. Рассчитать среднюю сумму транзакций
10. Показать транзакции в заданном диапазоне сумм
11. Рассчитать общую сумму дебетовых транзакций
12. Найти месяц с наибольшим количеством транзакций
13. Найти месяц с наибольшим количеством дебетовых транзакций
14. Определить, каких транзакций больше всего (debit или credit)
15. Показать транзакции до указанной даты
16. Найти транзакцию по ID
17. Показать описания всех транзакций
18. Выйти из программы
=====================================
Выберите действие (введите соответствующий номер): `;


const handleUserInput = (choice) => {
    switch (choice) {
        // Пункт меню для добавления транзакции
        case '1':
            // Пользователь вводит ID транзакции
            rl.question('Введите ID транзакции: ', (transaction_id) => {
                // Пользователь вводит дату транзакции
                rl.question('Введите дату транзакции (гггг-мм-дд): ', (transaction_date) => {
                    // Пользователь вводит сумму транзакции
                    rl.question('Введите сумму транзакции: ', (transaction_amount) => {
                        // Пользователь вводит тип транзакции
                        rl.question('Введите тип транзакции (debit/credit): ', (transaction_type) => {
                            // Пользователь вводит описание транзакции
                            rl.question('Введите описание транзакции: ', (transaction_description) => {
                                // Пользователь вводит название торгового места
                                rl.question('Введите название торгового места: ', (merchant_name) => {
                                    // Пользователь вводит тип карты
                                    rl.question('Введите тип карты: ', (card_type) => {
                                        // Создаем объект транзакции
                                        const transaction = {
                                            transaction_id,
                                            transaction_date,
                                            transaction_amount: parseFloat(transaction_amount),
                                            transaction_type,
                                            transaction_description,
                                            merchant_name,
                                            card_type
                                        };
                                        // Добавляем транзакцию
                                        analyzer.addTransaction(transaction);
                                        rl.question(menu, handleUserInput); // Показать меню снова
                                    });
                                });
                            });
                        });
                    });
                });
            });
            return;
        case '2':
            console.log(analyzer.getAllTransactions()); // Показать все транзакции
            break;
        case '3':
            console.log(analyzer.getUniqueTransactionType()); // Показать уникальные типы транзакций
            break;
        case '4':
            console.log(analyzer.calculateTotalAmount()); // Рассчитать общую сумму транзакций
            break;
        case '5':
            rl.question('Введите год: ', (year) => { // Запросить год
                rl.question('Введите месяц: ', (month) => { // Запросить месяц
                    rl.question('Введите день: ', (day) => { // Запросить день
                        console.log(analyzer.calculateTotalAmountByDate(parseInt(year), parseInt(month), parseInt(day))); // Рассчитать общую сумму транзакций по дате
                        rl.question(menu, handleUserInput); // Показать меню снова
                    });
                });
            });
            return;
        case '6':
            rl.question('Введите тип транзакции (debit/credit): ', (type) => { // Запросить тип транзакции
                console.log(analyzer.getTransactionByType(type)); // Показать транзакции по типу
                rl.question(menu, handleUserInput); // Показать меню снова
            });
            return;
        // Пункт меню для показа транзакций в диапазоне дат
        case '7':
            // Пользователь вводит начальную дату
            rl.question('Введите начальную дату (yyyy-mm-dd): ', (startDate) => {
                // Пользователь вводит конечную дату
                rl.question('Введите конечную дату (yyyy-mm-dd): ', (endDate) => {
                    // Выводим транзакции в заданном диапазоне дат
                    console.log(analyzer.getTransactionsInDateRange(startDate, endDate));
                    // Запрашиваем следующее действие у пользователя
                    rl.question(menu, handleUserInput);
                });
            });
            return;

        // Пункт меню для показа транзакций по торговому месту
        case '8':
            // Пользователь вводит название торгового места
            rl.question('Введите название торгового места: ', (merchantName) => {
                // Выводим транзакции для указанного торгового места
                console.log(analyzer.getTransactionsByMerchant(merchantName));
                // Запрашиваем следующее действие у пользователя
                rl.question(menu, handleUserInput);
            });
            return;

        // Пункт меню для расчета средней суммы транзакций
        case '9':
            // Выводим среднюю сумму транзакций
            console.log(analyzer.calculateAverageTransactionAmount());
            break;

        // Пункт меню для показа транзакций в заданном диапазоне сумм
        case '10':
            // Пользователь вводит минимальную сумму
            rl.question('Введите минимальную сумму: ', (minAmount) => {
                // Пользователь вводит максимальную сумму
                rl.question('Введите максимальную сумму: ', (maxAmount) => {
                    // Выводим транзакции в заданном диапазоне сумм
                    console.log(analyzer.getTransactionsByAmountRange(parseFloat(minAmount), parseFloat(maxAmount)));
                    // Запрашиваем следующее действие у пользователя
                    rl.question(menu, handleUserInput);
                });
            });
            return;

        // Пункт меню для расчета общей суммы дебетовых транзакций
        case '11':
            // Выводим общую сумму дебетовых транзакций
            console.log(analyzer.calculateTotalDebitAmount());
            break;

        // Пункт меню для поиска месяца с наибольшим количеством транзакций
        case '12':
            // Выводим месяц с наибольшим количеством транзакций
            console.log(analyzer.findMostTransactionsMonth());
            break;

        // Пункт меню для поиска месяца с наибольшим количеством дебетовых транзакций
        case '13':
            // Выводим месяц с наибольшим количеством дебетовых транзакций
            console.log(analyzer.findMostDebitTransactionMonth());
            break;

        // Пункт меню для определения, каких транзакций больше всего (debit или credit)
        case '14':
            // Выводим тип транзакций, которых больше всего
            console.log(analyzer.mostTransactionTypes());
            break;

        // Пункт меню для показа транзакций до указанной даты
        case '15':
            // Пользователь вводит дату
            rl.question('Введите дату (yyyy-mm-dd): ', (date) => {
                // Выводим транзакции до указанной даты
                console.log(analyzer.getTransactionsBeforeDate(date));
                // Запрашиваем следующее действие у пользователя
                rl.question(menu, handleUserInput);
            });
            return;

        // Пункт меню для поиска транзакции по ID
        case '16':
            // Пользователь вводит ID транзакции
            rl.question('Введите ID транзакции: ', (id) => {
                // Выводим информацию о транзакции по указанному ID
                console.log(analyzer.findTransactionById(id));
                // Запрашиваем следующее действие у пользователя
                rl.question(menu, handleUserInput);
            });
            return;

        // Пункт меню для показа описаний всех транзакций
        case '17':
            // Выводим описания всех транзакций
            console.log(analyzer.mapTransactionDescriptions());
            break;

        // Пункт меню для выхода из программы
        case '18':
            // Закрываем интерфейс readline
            rl.close();
            return;

        // Обработка неверного выбора
        default:
            console.log('Неверный выбор, попробуйте снова.');
    }
    rl.question(menu, handleUserInput);
};

// Запуск меню
rl.question(menu, handleUserInput);