import { atom } from "recoil";

export interface GeoLocation {
  name: string;
  type: string;
  kommune: string;
  fylke: string;
  coordinates: LatLng;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export const selectedLocationState = atom<GeoLocation | null>({
  key: "selectedLocationState",
  default: null,
});

interface KartverkLocationSearchResponse {
  sokStatus: SokStatus;
  totaltAntallTreff: string;
  stedsnavn: KartverkLocation[];
}

interface SokStatus {
  ok: string;
  melding: string;
}

interface KartverkLocation {
  ssrId: string;
  navnetype: string;
  kommunenavn: string;
  fylkesnavn: string;
  stedsnavn: string;
  aust: string;
  nord: string;
  skrivemaatestatus: string;
  spraak: string;
  skrivemaatenavn: string;
  epsgKode: string;
}

export const KartverkLocationSearch = async (
  searchString: string
): Promise<GeoLocation[]> => {
  const query = `https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=${searchString}*&maxAnt=5&epsgKode=4258`;

  const apiResult = await fetch(query, {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  });

  if (apiResult.status === 200) {
    return await KartverkResponseToLocations(apiResult);
  }

  return [];
};

async function KartverkResponseToLocations(
  apiResult: Response
): Promise<GeoLocation[] | PromiseLike<GeoLocation[]>> {
  
  const response = (await apiResult.json()) as KartverkLocationSearchResponse;

  if (response.totaltAntallTreff === '0') {
      return []
  }

  const locations = response.stedsnavn.map((l: KartverkLocation): GeoLocation => {
    return ({
        name: l.stedsnavn,
        type: l.navnetype,
        kommune: l.kommunenavn,
        fylke: l.fylkesnavn,
        coordinates: {
            lat: parseFloat(l.nord),
            lng: parseFloat(l.aust)
        }
    });
  });

  return locations;
}
