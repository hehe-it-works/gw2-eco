'use server'
import { startBackgroundSercives,  compareItemIdsAndFetchMissing} from "./backgroundServices";

export async function startUp(){
    compareItemIdsAndFetchMissing();
}