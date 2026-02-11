"use server";

import {
  discipline,
  recipe,
  full_item_data,
  simple_item_data,
  recipe_item,
  recipe_discipline,
  price,
  recipe_tree,
  price_response,
  ingredient_tree,
} from "@/app/models";
import { prisma } from "./prisma";

export async function createItem(_item: simple_item_data) {
  console.log("Creating item... ", _item);
  await prisma.items.create({
    data: _item,
  });
  console.log("Created item", _item.id);
}

export async function getFullItemData(_id: number): Promise<full_item_data> {
  const database_response = await prisma.items.findUniqueOrThrow({
    where: {
      id: _id,
    },
    include: {
      recipes: {
        include: {
          recipe_items: {
            include: {
              items: true,
            },
          },
          items: true,
          recipe_disciplines: {
            include: {
              disciplines: true,
            },
          },
        },
      },
      recipe_items: {
        include: {
          recipes: {
            include: {
              recipe_disciplines: {
                include: {
                  disciplines: true,
                },
              },
              recipe_items: {
                include: {
                  items: true,
                },
              },
            },
          },
          items: true,
        },
      },
    },
  });

  const item: full_item_data = {
    id: database_response.id,
    name: database_response.name,
    output_of_recipes: database_response.recipes.map((recipe) => ({
      id: recipe.id,
      output_item: recipe.items,
      output_item_count: recipe.output_item_count,
      min_rating: recipe.min_rating,
      disciplines: recipe.recipe_disciplines.map((discipline) => ({
        id: discipline.disciplines.id,
        name: discipline.disciplines.name,
      })),
      ingredients: recipe.recipe_items.map((ingredient) => ({
        item_id: ingredient.item_id,
        item_count: ingredient.item_count,
      })),
    })),
    input_of_recipes: database_response.recipe_items.map((recipe) => ({
      id: recipe.recipe_id,
      output_item: recipe.items,
      output_item_count: recipe.item_count,
      min_rating: recipe.recipes.min_rating,
      disciplines: recipe.recipes.recipe_disciplines.map((discipline) => ({
        id: discipline.disciplines.id,
        name: discipline.disciplines.name,
      })),
      ingredients: recipe.recipes.recipe_items.map((ingredient) => ({
        item_id: ingredient.item_id,
        item_count: ingredient.item_count,
      })),
    })),
  };
  return item;
}

export async function getRecipesWithOutputItem(_item_id: number) {
  const root_item = await prisma.items.findUniqueOrThrow({
    where: {
      id: _item_id,
    },
  });
  const recipe_ids: number[] = (
    await prisma.recipes.findMany({
      where: {
        output_item_id: _item_id,
      },
      select: {
        id: true,
      },
    })
  ).map((id) => id.id);
  const recipe_trees = recipe_ids.map((id) => {
    return getRecipeTree(id);
  });
  const recipe_tree_array = await Promise.all(recipe_trees);
  return { item: root_item, recipe_tree: recipe_tree_array };
}

export async function getRecipeTree(_recipe_id: number): Promise<recipe_tree> {
  const root_recipe = await prisma.recipes.findUniqueOrThrow({
    where: {
      id: _recipe_id,
    },
  });
  const root_recipe_tree: recipe_tree = {
    recipe: root_recipe,
    ingredient_trees: [],
  };
  let temp_recipe_trees: recipe_tree[] = [root_recipe_tree];
  let temp_ingredient_trees: ingredient_tree[] = [];
  while (true) {
    console.log("Starting while loop....");
    while (temp_recipe_trees.length > 0) {
      const recipe_tree = temp_recipe_trees.shift()!;
      const ingredients_of_recipe_tree = await prisma.recipe_items.findMany({
        where: {
          recipe_id: recipe_tree.recipe.id,
        },
      });
      const ingredient_trees: ingredient_tree[] =
        ingredients_of_recipe_tree.map((ingredient) => ({
          ingredient: ingredient,
          recipe_trees: [],
        }));
      recipe_tree.ingredient_trees = ingredient_trees;
      temp_ingredient_trees = temp_ingredient_trees.concat(ingredient_trees);
    }
    while (temp_ingredient_trees.length > 0) {
      const ingredient_tree = temp_ingredient_trees.shift()!;
      const recipes_of_ingredient = await prisma.recipes.findMany({
        where: {
          output_item_id: ingredient_tree.ingredient.item_id,
        },
      });
      const recipe_trees: recipe_tree[] = recipes_of_ingredient.map(
        (recipe) => ({
          recipe: recipe,
          ingredient_trees: [],
        }),
      );
      ingredient_tree.recipe_trees = recipe_trees;
      temp_recipe_trees = temp_recipe_trees.concat(recipe_trees);
    }
    if (temp_recipe_trees.length === 0 && temp_ingredient_trees.length === 0)
      break;
  }
  console.log(JSON.stringify(root_recipe_tree));
  return root_recipe_tree;
}

export async function tryGetSimpleItemData(
  _id: number,
): Promise<simple_item_data | null> {
  console.log("Looking for item with id", _id);
  try {
    const database_response = await prisma.items.findUniqueOrThrow({
      where: {
        id: _id,
      },
    });
    const item: simple_item_data = {
      id: database_response.id,
      name: database_response.name,
    };
    return item;
  } catch {
    console.error("Failed to find item with id", _id);
    return null;
  }
}

/*export async function tryGetRecipe(_id: number): Promise<recipe | null> {
  console.log("Looking for recipe with id", _id);
  try{
    const database_response = await prisma.recipes.findUniqueOrThrow({
      where: {
        id: _id,
      }
    });
    const recipe: recipe = {
      id: database_response.id,
      output_item: database_response.id,
      output_item_count: database_response.output_item_count,
      min_rating: database_response.min_rating,
      disciplines: 
    }
  }
}*/

export async function getItems(): Promise<simple_item_data[]> {
  return await prisma.items.findMany();
}

export async function getDisciplines(_names: string[]): Promise<discipline[]> {
  let disciplines: discipline[] = [];
  _names.forEach(async (_name) => {
    const name_response = await prisma.disciplines.findFirstOrThrow({
      where: {
        name: _name,
      },
    });
    disciplines.push(name_response);
  });
  return disciplines;
}

export async function getAllDbItemIds(): Promise<number[]> {
  const item_ids_response = await prisma.items.findMany({
    select: {
      id: true,
    },
  });
  const item_id_array = item_ids_response.map((item) => item.id);
  console.log(item_id_array);
  return item_id_array;
}

export async function getAllDbRecipeIds(): Promise<number[]> {
  const recipe_ids_response = await prisma.recipes.findMany({
    select: {
      id: true,
    },
  });
  const recipe_id_array = recipe_ids_response.map((recipe) => recipe.id);
  return recipe_id_array;
}

export async function createRecipe(_recipe: recipe) {
  await prisma.recipes.create({
    data: {
      id: _recipe.id,
      output_item_id: _recipe.output_item.id,
      output_item_count: _recipe.output_item_count,
      min_rating: _recipe.min_rating,
    },
  });
}
export async function createRecipeItem(_recipe_item: recipe_item) {
  console.log("Creating recipe item...", _recipe_item);
  await prisma.recipe_items.create({
    data: {
      recipe_id: _recipe_item.recipe_id,
      item_id: _recipe_item.ingredient.item_id,
      item_count: _recipe_item.ingredient.item_count,
    },
  });
}

export async function createRecipeDiscipline(
  _recipe_discipline: recipe_discipline,
) {
  console.log("Creating recipe discipline...", _recipe_discipline);
  await prisma.recipe_disciplines.create({
    data: {
      recipe_id: _recipe_discipline.recipe_id,
      discipline_id: _recipe_discipline.discipline.id,
    },
  });
}

export async function createDiscipline(_discipline: discipline) {
  await prisma.disciplines.create({
    data: _discipline,
  });
}

export async function tryCreatePrice(_price: price_response) {
  console.log("Creating price...", _price);

  try {
    await prisma.prices.create({
      data: {
        item_id: _price.id,
        whitelisted: _price.whitelisted,
        buys_quantity: _price.buys.quantity,
        buys_unit_price: _price.buys.unit_price,
        sells_quantity: _price.sells.quantity,
        sells_unit_price: _price.sells.unit_price,
      },
    });
  } catch {
    console.warn("Couldnt update price of:", _price.id);
  }

  //console.log("Created price!", _price.item.id);
}

export async function getAllPricesItemIds(): Promise<number[]> {
  const prices_response = await prisma.prices.findMany({
    select: {
      item_id: true,
    },
  });
  const item_id_array = prices_response.map((price) => price.item_id);
  return item_id_array;
}

export async function updatePrice(_price: price_response) {
  console.log("Updating price...", _price);
  await prisma.prices.update({
    where: {
      item_id: _price.id,
    },
    data: {
      whitelisted: _price.whitelisted,
      buys_quantity: _price.buys.quantity,
      buys_unit_price: _price.buys.unit_price,
      sells_quantity: _price.sells.quantity,
      sells_unit_price: _price.sells.unit_price,
    },
  });
}
