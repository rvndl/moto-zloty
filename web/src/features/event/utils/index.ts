import { Address } from "types/address";

export const makeAddressString = (address?: Address) => {
  if (!address) return "Brak";
  const addressFragments: string[] = [];

  if (address.name) addressFragments.push(address.name);
  if (address.house_number) addressFragments.push(address.house_number);
  if (address.road) addressFragments.push(address.road);
  if (address.neighbourhood) addressFragments.push(address.neighbourhood);
  if (address.suburb) addressFragments.push(address.suburb);
  if (address.city) addressFragments.push(address.city);
  if (address.state) addressFragments.push(address.state);

  return addressFragments.join(", ");
};

export const states = [
  "województwo dolnośląskie",
  "województwo kujawsko-pomorskie",
  "województwo lubelskie",
  "województwo lubuskie",
  "województwo łódzkie",
  "województwo małopolskie",
  "województwo mazowieckie",
  "województwo opolskie",
  "województwo podkarpackie",
  "województwo podlaskie",
  "województwo pomorskie",
  "województwo śląskie",
  "województwo świętokrzyskie",
  "województwo warmińsko-mazurskie",
  "województwo wielkopolskie",
  "województwo zachodniopomorskie",
] as const;

export type State = (typeof states)[number];
