"use server";
import { getRecipeTree } from "@/db/dbQueries";
import {
  startBackgroundSercives,
  fetchMissingItems,
  fetchMissingRecipes,
} from "./backgroundServices";

export async function startUp() {
  getRecipeTree(987);
  //startBackgroundSercives();
}
