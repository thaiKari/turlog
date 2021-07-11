import { atom, selector } from "recoil";
import { getTrips, getImageBaseUrl } from "./data";
import { ImageFile, Trip } from "./types";
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


export const getNewTrip = (): Trip => {
    return  {
      id: uuidv4(),
      name: '',
    } as Trip
  }

export const editingTripState = atom<Trip | undefined>({
    key: 'editingTripState',
    default: getNewTrip() 
  });

export const imageFilesState = atom({
    key: 'imageFilesState',
    default: [] as ImageFile[]
  });
  
  export const tripFormRedirectUrlState = atom({
    key: 'tripFormRedirectUrlState',
    default: ''
  });  

  export const isMobileState = atom({
    key: 'isMobileState',
    default: false
  });  