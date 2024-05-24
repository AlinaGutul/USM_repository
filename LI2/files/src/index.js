import { getRandomActivity } from './activity.js';

async function updateActivity() {
    const activityElement = document.getElementById('activity');
    try {
        const activity = await getRandomActivity();
        activityElement.textContent = activity;
    } catch (error) {
        activityElement.textContent = 'К сожалению, произошла ошибка';
    }
}

async function main() {
    await updateActivity();
    setTimeout(main, 60000); // Обновление каждую минуту
}

main();
