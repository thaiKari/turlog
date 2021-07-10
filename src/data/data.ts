import { ImageFile, Trip } from "./types";

export async function getTrips(): Promise<Trip[]> {
  let trips = await (await fetch(`/api/trips`)).json();
  sanitize(trips);
  return trips;
}

export async function getImageBaseUrl(): Promise<string> {
  const settings = await (await fetch(`/api/settings`)).json();
  return settings["imagesurl"];
}

export async function deleteTrip(id: string): Promise<void> {
  console.log("delete", id);
  try {
    await fetch(`/api/trip/${id}`, { method: "DELETE" });
  } catch (error) {
    console.log(error);
  }
}

export async function createOrUpdateTrip(
  trip: Trip,
  imageFiles: ImageFile[]
): Promise<string> {
  const existingIms = trip.images ?? [];
  const imageNames = [...existingIms, ...imageFiles.map((im) => im.name)];

  await Promise.all([
    saveTrip({ ...trip, images: imageNames } as Trip),
    uploadImages(imageFiles),
  ]);

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

async function uploadImages(imageFiles: ImageFile[]): Promise<any> {
  let tasks = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const image = imageFiles[i];
    const body = new FormData();
    body.append("data", image);
    tasks.push(
      fetch("/api/images/upload", {
        body: body,
        method: "post",
      })
    );
  }

  await Promise.all(tasks);
}

async function post(
  path: string,
  body: any,
  contentType?: string
): Promise<any> {
  const rawResponse = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const content = await rawResponse.json();
  return content;
}
