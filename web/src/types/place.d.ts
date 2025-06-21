import { Address } from "./address";

export interface Place {
  place_id: string;
  address: Address;
  lat: number;
  lon: number;
}
