import { atom, selector } from "recoil";
import { getTrips, getImageBaseUrl } from "./data";
import { Trip, TripWithImageFiles } from "./types";
import { v4 as uuidv4 } from 'uuid';

export const updateTripsState = atom({
    key: "updateTripsState",
    default: 0,
  });

export const tripsState = selector<Trip[]>({
    key: 'tripsState',
    get:  async ({ get }) => {
        get(updateTripsState);
        return await getTrips();
      }
});

export const imagesBaseUrlState = atom({
    key: 'imagesBaseUrlState',
    default: selector({
        key: 'imagesBaseUrlStatet',
        get: async () => await getImageBaseUrl(),        
    }), 
  });

  export const selectedTripIdState = atom({
    key: 'selectedTripIdState',
    default: '' as string
  });
  
  export const selectedTripState = selector({
    key: 'selectedTripState',
    get: ({ get }) => {
      const trips: Trip[] = get(tripsState);
      const selectedTripId: string = get(selectedTripIdState);
      const trip = trips.find(p => p.id === selectedTripId);
      if (!trip) return getNewTrip();
      return trip as TripWithImageFiles
    }
  });

export const editingTripState = atom({
    key: 'editingTripState',
    default: selectedTripState 
  });

  export const getNewTrip = (): TripWithImageFiles => {
    return  {
      id: uuidv4(),
      date: new Date(),
      name: '',
      
    } as Trip
  }