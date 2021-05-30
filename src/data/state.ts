import { atom, selector } from "recoil";
import { getTrips, getImageBaseUrl } from "./data";
import { Trip } from "./types";

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
