"use server";
import {
  startBackgroundSercives,
  fetchMissingItems,
  fetchMissingRecipes,
} from "./backgroundServices";

export async function startUp() {
  startBackgroundSercives();
}
