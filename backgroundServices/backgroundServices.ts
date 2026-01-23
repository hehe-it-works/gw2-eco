import {
  discipline,
  full_item_data,
  recipe_response,
  simple_item_data,
} from "@/app/models";
import {
  createItem,
  createRecipe,
  tryGetSimpleItemData,
  getDisciplines,
  getItems,
  getAllDbItemIds,
  getAllDbRecipeIds,
  createRecipeItem,
  createRecipeDiscipline,
} from "@/db/dbQueries";

let item_ids: number[];
let missing_ids: number[];

export async function startBackgroundSercives() {
  fetchMissingRecipes();
}

export async function fetchMissingItems() {
  const db_item_ids = await getAllDbItemIds();
  const item_id_response = await fetch("https://api.guildwars2.com/v2/items");
  const api_item_ids: number[] = await item_id_response.json();
  const missing_ids = api_item_ids.filter((id) => !db_item_ids.includes(id));
  if (missing_ids.length > 0) {
    const timer = setInterval(async () => {
      await fetchItems(missing_ids.splice(0, 50));
      if (missing_ids.length === 0) {
        clearInterval(timer);
      }
    }, 250);
  }
}

async function fetchItems(ids: number[]) {
  console.log(ids);
  const item_response = await fetch(
    `https://api.guildwars2.com/v2/items?ids=${ids.join(",")}`,
  );
  const items: simple_item_data[] = await item_response.json();
  console.log(items);
  items.forEach(async (item) => {
    await createItem({
      id: item.id,
      name: item.name,
    });
  });
}

export async function fetchMissingRecipes() {
  console.log("Looking for missing recipes...");
  const db_recipe_ids = await getAllDbRecipeIds();
  const recipe_id_respone = await fetch(
    "https://api.guildwars2.com/v2/recipes",
  );
  const api_recipe_ids: number[] = await recipe_id_respone.json();
  const missing_ids = api_recipe_ids.filter(
    (id) => !db_recipe_ids.includes(id),
  );
  if (missing_ids.length > 0) {
    const timer = setInterval(async () => {
      await fetchRecipes(missing_ids.splice(0, 50));
      if (missing_ids.length === 0) {
        console.log("Finished recipe fetch!");
        clearInterval(timer);
      }
    }, 250);
  }
}

async function fetchRecipes(ids: number[]) {
  const recipe_response = await fetch(
    `https://api.guildwars2.com/v2/recipes?ids=${ids.join(",")}`,
  );
  const recipes: recipe_response[] = await recipe_response.json();
  recipes.forEach(async (recipe) => {
    console.log("Creating recipe...", recipe.id);
    const _output_item = await tryGetSimpleItemData(recipe.output_item_id);
    if (_output_item === null) {
      console.warn("Failed to get output item", recipe.output_item_id);
      return;
    }
    const _disciplines: discipline[] = await getDisciplines(recipe.disciplines);
    await createRecipe({
      id: recipe.id,
      output_item: _output_item,
      output_item_count: recipe.output_item_count,
      disciplines: _disciplines,
      min_rating: recipe.min_rating,
      ingredients: recipe.ingredients,
    });
    recipe.ingredients.forEach(async (ingredient) => {
      await createRecipeItem({
        recipe_id: recipe.id,
        ingredient: ingredient,
      });
    });
    _disciplines.forEach(async (discipline) => {
      await createRecipeDiscipline({
        recipe_id: recipe.id,
        discipline: discipline,
      });
    });
    console.log("Created recipe", recipe.id);
  });
}

//add table for prices stuff (noo need for listings yet as far as we know)
//add html/css object to add into the table
