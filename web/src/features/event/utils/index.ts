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
