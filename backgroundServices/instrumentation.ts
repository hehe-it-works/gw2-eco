'use server'
import { startBackgroundSercives } from "./backgroundServices";

export async function startUp(){
    startBackgroundSercives();
}