const API_KEY = "8ef244ba7c254c3aa7c16f7b8aa0e9d3"; // Replace with your Spoonacular API Key
const API_URL = "https://api.spoonacular.com/recipes/findByIngredients";

document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const ingredients = document.getElementById("ingredients").value;
    const outputDiv = document.getElementById("output");
    outputDiv.style.display = "block";
    outputDiv.innerHTML = "<p>Finding recipes... ⏳</p>";

    try {
        // 1️⃣ Fetch recipes based on ingredients
        const response = await fetch(`${API_URL}?ingredients=${ingredients}&number=3&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.length > 0) {
            outputDiv.innerHTML = "<h2>🍲 Recipes Found:</h2>";
            
            for (let recipe of data) {
                const recipeDetails = await getRecipeDetails(recipe.id);
                outputDiv.innerHTML += generateRecipeHTML(recipe, recipeDetails);
            }
        } else {
            outputDiv.innerHTML = "<p>No recipes found. Try different ingredients!</p>";
        }

    } catch (error) {
        outputDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

// 2️⃣ Fetch full recipe details including steps
async function getRecipeDetails(recipeId) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY}`;
    const response = await fetch(detailsUrl);
    return await response.json();
}

// 3️⃣ Generate the HTML for each recipe
function generateRecipeHTML(recipe, details) {
    let stepsHTML = "<h4>Instructions:</h4><ol>";
    
    if (details.analyzedInstructions.length > 0) {
        details.analyzedInstructions[0].steps.forEach(step => {
            stepsHTML += `<li>${step.step}</li>`;
        });
    } else {
        stepsHTML += "<li>No instructions available.</li>";
    }
    stepsHTML += "</ol>";

    return `
        <div class="recipe">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" width="200">
            <p><strong>Ingredients Used:</strong> ${recipe.usedIngredientCount}</p>
            <p><strong>Missed Ingredients:</strong> ${recipe.missedIngredientCount}</p>
            ${stepsHTML}
        </div>
        <hr>
    `;
}
