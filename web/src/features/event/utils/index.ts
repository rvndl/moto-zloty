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

const getStateTemplate = (state: string) => {
  return {
    title: `Zloty motocyklowe w województwie ${state} – katalog 2025`,
    pageTitle: `Zloty motocyklowe w województwie ${state}`,
    description: `Poznaj terminy, miejsca i atrakcje zlotów motocyklowych w woj. ${state} – aktualny na 2025 rok`,
  };
};

const stateMetadata: Record<State, ReturnType<typeof getStateTemplate>> = {
  "województwo dolnośląskie": getStateTemplate("dolnośląskim"),
  "województwo kujawsko-pomorskie": getStateTemplate("kujawsko-pomorskim"),
  "województwo lubelskie": getStateTemplate("lubelskim"),
  "województwo lubuskie": getStateTemplate("lubuskim"),
  "województwo mazowieckie": getStateTemplate("mazowieckim"),
  "województwo małopolskie": getStateTemplate("małopolskim"),
  "województwo opolskie": getStateTemplate("opolskim"),
  "województwo podkarpackie": getStateTemplate("podkarpackim"),
  "województwo podlaskie": getStateTemplate("podlaskim"),
  "województwo pomorskie": getStateTemplate("pomorskim"),
  "województwo śląskie": getStateTemplate("śląskim"),
  "województwo świętokrzyskie": getStateTemplate("świętokrzyskim"),
  "województwo warmińsko-mazurskie": getStateTemplate("warmińsko-mazurskim"),
  "województwo wielkopolskie": getStateTemplate("wielkopolskim"),
  "województwo zachodniopomorskie": getStateTemplate("zachodniopomorskim"),
  "województwo łódzkie": getStateTemplate("łódzkim"),
};

export const getStateMetadata = (state?: State) => {
  if (!state)
    return {
      title: "Zloty motocyklowe w Polsce – katalog 2025",
      pageTitle: "Zloty motocyklowe w Polsce",
      description:
        "Poznaj terminy, miejsca i atrakcje zlotów motocyklowych w Polsce – aktualny na 2025 rok",
    };

  return stateMetadata[state];
};
