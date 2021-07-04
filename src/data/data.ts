import { Trip, TripWithImageFiles } from "./types";

export async function getTrips(): Promise<Trip[]> {
  let trips = await (await fetch(`/api/trips`)).json();
  sanitize(trips);
  return trips;
}

export async function getImageBaseUrl(): Promise<string> {
  const settings = await (await fetch(`/api/settings`)).json();
  return settings["imagesurl"];
}

export async function createNewTrip(trip: TripWithImageFiles): Promise<string> {
  await Promise.allSettled([
    saveTrip(trip as Trip),
    uploadImages(trip)]);

  return "true";
}

function sanitize(trips: Trip[]) {
  trips.forEach((t) => {
    t.date = new Date(t.date.toString());
  });
}

async function saveTrip(trip: Trip): Promise<any> {
  return await post("/api/trip", trip);
}

async function uploadImages(trip: TripWithImageFiles): Promise<any> {
  
  trip.imageFiles &&
    trip.imageFiles.forEach(async (file) => {
      const body = new FormData();
      body.append('data', file);      
      await fetch("/api/images/upload",
      {
          body: body,
          method: "post"
      });
    });

}

async function post(
  path: string,
  body: any,
  contentType?: string
): Promise<any> {
  const rawResponse = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body)
  });

  const content = await rawResponse.json();
  return content;
}
