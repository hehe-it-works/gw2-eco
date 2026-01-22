import {
  discipline,
  full_item_data,
  recipe_response,
  simple_item_data,
} from "@/app/models";
import {
  createItem,
  createRecipe,
  getSimpleItemData,
  getDisciplines,
  getItems,
  getAllDbItemIds,
} from "@/db/dbQueries";

let item_ids: number[];
let recipe_ids: number[];

export async function startBackgroundSercives() {
  console.log("Starting background service...");
  const item_id_response = await fetch("https://api.guildwars2.com/v2/items");
  item_ids = await item_id_response.json();
  const timer = setInterval(async () => {
    console.log(item_ids);
    await fetchItems(item_ids.splice(0, 50));
    if (item_ids.length === 0) {
      clearInterval(timer);
    }
  }, 250);
  console.log("Started background service!");
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



export async function compareItemIdsAndFetchMissing() {
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

//add function to fetch recipes and feed them into the database
//add table for prices stuff (noo need for listings yet as far as we know)
//add html/css object to add into the table
