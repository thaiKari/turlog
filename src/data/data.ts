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

export async function createNewTrip(trip: Trip): Promise<string> {
  const rawResponse = await fetch(`/api/trip`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });
  const content = await rawResponse.json();

  console.log(content);
  return content
}

function sanitize(trips: Trip[]) {
  trips.forEach((t) => {
    t.date = new Date(t.date.toString());
  });
}
