import {
  AnchorIcon,
  AtomIcon,
  CastleIcon,
  FactoryIcon,
  HardHatIcon,
  LandmarkIcon,
  MicIcon,
  MountainIcon,
  PawPrintIcon,
  RockingChairIcon,
  SailboatIcon,
  ScrollIcon,
  TentIcon,
  TreePineIcon,
  WheatIcon,
  WindIcon,
} from "lucide-react";
import { ReactNode } from "react";
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

const getStateTemplate = (state: string, icon: ReactNode) => {
  return {
    title: `Zloty motocyklowe w województwie ${state} – katalog 2025`,
    pageTitle: `Zloty motocyklowe w województwie ${state}`,
    description: `Poznaj terminy, miejsca i atrakcje zlotów motocyklowych w woj. ${state} – aktualny na 2025 rok`,
    icon,
  };
};

const stateMetadata: Record<State, ReturnType<typeof getStateTemplate>> = {
  "województwo dolnośląskie": getStateTemplate("dolnośląskim", <CastleIcon />),
  "województwo kujawsko-pomorskie": getStateTemplate(
    "kujawsko-pomorskim",
    <AtomIcon />,
  ),
  "województwo lubelskie": getStateTemplate("lubelskim", <WheatIcon />),
  "województwo lubuskie": getStateTemplate("lubuskim", <TreePineIcon />),
  "województwo mazowieckie": getStateTemplate("mazowieckim", <LandmarkIcon />),
  "województwo małopolskie": getStateTemplate("małopolskim", <MountainIcon />),
  "województwo opolskie": getStateTemplate("opolskim", <MicIcon />),
  "województwo podkarpackie": getStateTemplate("podkarpackim", <TentIcon />),
  "województwo podlaskie": getStateTemplate("podlaskim", <PawPrintIcon />),
  "województwo pomorskie": getStateTemplate("pomorskim", <AnchorIcon />),
  "województwo śląskie": getStateTemplate("śląskim", <HardHatIcon />),
  "województwo świętokrzyskie": getStateTemplate(
    "świętokrzyskim",
    <RockingChairIcon />,
  ),
  "województwo warmińsko-mazurskie": getStateTemplate(
    "warmińsko-mazurskim",
    <SailboatIcon />,
  ),
  "województwo wielkopolskie": getStateTemplate(
    "wielkopolskim",
    <ScrollIcon />,
  ),
  "województwo zachodniopomorskie": getStateTemplate(
    "zachodniopomorskim",
    <WindIcon />,
  ),
  "województwo łódzkie": getStateTemplate("łódzkim", <FactoryIcon />),
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

export const getStateAssociatedIcon = (state?: State) => {
  if (!state) return null;

  return stateMetadata[state].icon;
};

export const getShortState = (state?: string) => {
  if (!state) return "brak";

  const [, stateName] = state.split(" ");
  return `woj. ${stateName}`;
};
