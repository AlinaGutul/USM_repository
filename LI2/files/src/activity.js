export async function getRandomActivity() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }
        const data = await response.json();
        return data.meals[0].strMeal;
    } catch (error) {
        console.error('Error fetching activity:', error.message);
        throw error;
    }
}
