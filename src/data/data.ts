import { Trip } from "./types";


export async function getTrips() : Promise<Trip[]> {
    const trips = await( await fetch(`/api/trips`)).json();
    return trips;    
}

export async function getImageBaseUrl() : Promise<string> {
    const settings = await( await fetch(`/api/settings`)).json();
    return settings["imagesurl"]
}



