'use server'
import { startBackgroundSercives,  compareItemIdsAndFetchMissing, startRecipeFetch} from "./backgroundServices";

export async function startUp(){
    startRecipeFetch();
}