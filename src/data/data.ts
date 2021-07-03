import { Trip } from "./types";

export async function getTrips(): Promise<Trip[]> {
  let trips = await (await fetch(`/api/trips`)).json();
  sanitize(trips);
  return trips;
}

export async function getImageBaseUrl(): Promise<string> {
  const settings = await (await fetch(`/api/settings`)).json();
  return settings["imagesurl"];
}

function sanitize(trips: Trip[]) {
  trips.forEach((t) => {
    t.date = new Date(t.date.toString());
  });
}
