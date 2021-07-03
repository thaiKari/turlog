import { atom, selector } from "recoil";
import { getTrips, getImageBaseUrl } from "./data";
import { Trip } from "./types";
import { v4 as uuidv4 } from 'uuid';

export const tripsState = selector<Trip[]>({
    key: 'tripsState',
    get:  async () => await getTrips()

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
      return trip
    }
  });

export const editingTripState = atom({
    key: 'editingTripState',
    default: selectedTripState
  });

  export const getNewTrip = (): Trip => {
    return  {
      id: uuidv4(),
      date: new Date(),
      name: '',
      
    } as Trip
  }