import { full_item_data, simple_item_data } from "@/app/models";
import { createItem } from "@/db/dbQueries";

let item_ids: number[];

export async function startBackgroundSercives() {
  console.log("Starting background service...");
  const item_id_response = await fetch("https://api.guildwars2.com/v2/items");
  item_ids = await item_id_response.json();
  const timer = setInterval(async () => {
    await fetchItems(item_ids.splice(0, 50));
    if (item_ids.length === 0) {
      clearInterval(timer);
    }
  }, 250);
  console.log("Started background service!");
}

async function fetchItems(ids: number[]) {
  const item_response = await fetch(
    `https://api.guildwars2.com/v2/items?ids=${ids.join(",")}`,
  );
  const items: simple_item_data[] = await item_response.json();
  items.forEach(async (item) => {
    await createItem({
      id: item.id,
      name: item.name,
    });
  });
}

//add function to see if all the items are in the database and if not add the missing ones
//add function to fetch recipes and feed them into the database
//add table for prices stuff (noo need for listings yet as far as we know)
