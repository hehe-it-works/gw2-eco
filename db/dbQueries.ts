"use server";

import {
  discipline,
  recipe,
  full_item_data,
  simple_item_data,
} from "@/app/models";
import { prisma } from "./prisma";
import { json } from "node:stream/consumers";

export async function createItem(_item: full_item_data) {
  await prisma.items.create({
    data: _item,
  });
}

export async function getItem(_id: number): Promise<full_item_data> {
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
        count: ingredient.item_count,
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
        count: ingredient.item_count,
      })),
    })),
  };
  return item;
}

export async function getItems(): Promise<simple_item_data[]> {
  return await prisma.items.findMany();
}

export async function createRecipe(_recipe: recipe) {
  await prisma.recipes.create({
    data: _recipe,
  });
}

export async function createDiscipline(_discipline: discipline) {
  await prisma.disciplines.create({
    data: _discipline,
  });
}
