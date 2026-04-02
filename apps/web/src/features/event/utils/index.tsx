import { parseISO } from "date-fns";
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
  BookIcon,
  CloudIcon,
  CloudRainIcon,
  FlowerIcon,
  GhostIcon,
  GiftIcon,
  HeartIcon,
  IceCreamIcon,
  LeafIcon,
  SnowflakeIcon,
  SunIcon,
  UmbrellaIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { type Address } from "@features/event/types";

export const makeAddressString = (address?: Address | null) => {
  if (!address) return "Brak";
  const addressFragments: string[] = [];

  if (address.name) addressFragments.push(address.name);
  if (address.houseNumber) addressFragments.push(address.houseNumber);
  if (address.road) addressFragments.push(address.road);
  if (address.suburb) addressFragments.push(address.suburb);
  if (address.city) addressFragments.push(address.city);
  if (address.state) addressFragments.push(address.state);

  return addressFragments.join(", ");
};

export const getMonthNumberFromDateStr = (date?: string | Date) => {
  if (!date) return 1;
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj.getMonth() + 1;
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

const getStateTemplate = (
  state: string,
  statePlural: string,
  icon: ReactNode,
) => {
  return {
    title: `Zloty motocyklowe ${state} 2026 - Katalog i Wydarzenia`,
    pageTitle: `Zloty Motocyklowe: ${state} 2026`,
    description: `Szukasz imprez? Sprawdź nasz katalog: zloty motocyklowe ${state} 2026. Poznaj dokładne terminy, miejsca i atrakcje w swoim regionie.`,
    relatedDesc: `Sprawdź nadchodzące zloty i wydarzenia w regionie ${statePlural}.`,
    icon,
  };
};

const stateMetadata: Record<State, ReturnType<typeof getStateTemplate>> = {
  "województwo dolnośląskie": getStateTemplate(
    "dolnośląskie",
    "dolnośląskim",
    <CastleIcon />,
  ),
  "województwo kujawsko-pomorskie": getStateTemplate(
    "kujawsko-pomorskie",
    "kujawsko-pomorskim",
    <AtomIcon />,
  ),
  "województwo lubelskie": getStateTemplate(
    "lubelskie",
    "lubelskim",
    <WheatIcon />,
  ),
  "województwo lubuskie": getStateTemplate(
    "lubuskie",
    "lubuskim",
    <TreePineIcon />,
  ),
  "województwo mazowieckie": getStateTemplate(
    "mazowieckie",
    "mazowieckim",
    <LandmarkIcon />,
  ),
  "województwo małopolskie": getStateTemplate(
    "małopolskie",
    "małopolskim",
    <MountainIcon />,
  ),
  "województwo opolskie": getStateTemplate("opolskie", "opolskim", <MicIcon />),
  "województwo podkarpackie": getStateTemplate(
    "podkarpackie",
    "podkarpackim",
    <TentIcon />,
  ),
  "województwo podlaskie": getStateTemplate(
    "podlaskie",
    "podlaskim",
    <PawPrintIcon />,
  ),
  "województwo pomorskie": getStateTemplate(
    "pomorskie",
    "pomorskim",
    <AnchorIcon />,
  ),
  "województwo śląskie": getStateTemplate(
    "śląskie",
    "śląskim",
    <HardHatIcon />,
  ),
  "województwo świętokrzyskie": getStateTemplate(
    "świętokrzyskie",
    "świętokrzyskim",
    <RockingChairIcon />,
  ),
  "województwo warmińsko-mazurskie": getStateTemplate(
    "warmińsko-mazurskie",
    "warmińsko-mazurskim",
    <SailboatIcon />,
  ),
  "województwo wielkopolskie": getStateTemplate(
    "wielkopolskie",
    "wielkopolskim",
    <ScrollIcon />,
  ),
  "województwo zachodniopomorskie": getStateTemplate(
    "zachodniopomorskie",
    "zachodniopomorskim",
    <WindIcon />,
  ),
  "województwo łódzkie": getStateTemplate(
    "łódzkie",
    "łódzkim",
    <FactoryIcon />,
  ),
};

export const getStateMetadata = (state?: State) => {
  if (!state)
    return {
      title: "Zloty Motocyklowe w Polsce 2026 - Katalog i Wydarzenia",
      pageTitle: "Zloty Motocyklowe w Polsce 2026",
      description:
        "Poznaj terminy, miejsca i atrakcje zlotów motocyklowych w Polsce – aktualny na 2026 rok",
      relatedDesc: "Sprawdź nadchodzące wydarzenia i atrakcje w Polsce",
    };

  return stateMetadata[state];
};

export const getStateAssociatedIcon = (state?: State) => {
  if (!state) return null;

  return stateMetadata[state].icon;
};

export const getShortState = (state?: State | string | null) => {
  if (!state) return "brak";

  const [, stateName] = state.split(" ");
  return `woj. ${stateName}`;
};

export const formatStateName = (state?: State | string | null) => {
  if (!state) return "Brak";

  return state
    .replace("województwo ", "")
    .replace(/^./, (char) => char.toUpperCase());
};

export const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;
export type Month = (typeof months)[number];

const getMonthTemplate = (
  num: number,
  month: Month,
  plular: string,
  icon: ReactNode,
) => {
  return {
    title: `Zloty motocyklowe ${month} 2026 – terminarz, wydarzenia, atrakcje`,
    pageTitle: `Zloty motocyklowe – ${month} 2026`,
    description: `Sprawdź kalendarz zlotów motocyklowych na ${month} 2026 roku. Terminy, lokalizacje, opisy wydarzeń i atrakcje dla motocyklistów z całej Polski.`,
    relatedDesc: `Zobacz, co ciekawego dzieje się w ${plular} – koncerty, festyny i więcej.`,
    month,
    num,
    icon,
  };
};

const monthMetadata: Record<Month, ReturnType<typeof getMonthTemplate>> = {
  Styczeń: getMonthTemplate(1, "Styczeń", "styczniu", <SnowflakeIcon />),
  Luty: getMonthTemplate(2, "Luty", "lutym", <HeartIcon />),
  Marzec: getMonthTemplate(3, "Marzec", "marcu", <LeafIcon />),
  Kwiecień: getMonthTemplate(4, "Kwiecień", "kwietniu", <CloudRainIcon />),
  Maj: getMonthTemplate(5, "Maj", "maju", <FlowerIcon />),
  Czerwiec: getMonthTemplate(6, "Czerwiec", "czerwcu", <SunIcon />),
  Lipiec: getMonthTemplate(7, "Lipiec", "lipcu", <UmbrellaIcon />),
  Sierpień: getMonthTemplate(8, "Sierpień", "sierpniu", <IceCreamIcon />),
  Wrzesień: getMonthTemplate(9, "Wrzesień", "wrześniu", <BookIcon />),
  Październik: getMonthTemplate(
    10,
    "Październik",
    "październiku",
    <GhostIcon />,
  ),
  Listopad: getMonthTemplate(11, "Listopad", "listopadzie", <CloudIcon />),
  Grudzień: getMonthTemplate(12, "Grudzień", "grudniu", <GiftIcon />),
};

export const getMonthMetadata = (month?: Month) => {
  if (!month) return monthMetadata["Styczeń"];

  return monthMetadata[month];
};

export const getMonthAssociatedIcon = (month?: Month) => {
  if (!month) return null;

  return monthMetadata[month].icon;
};

export const getMonthNum = (month?: Month) => {
  if (!month) return undefined;

  return monthMetadata[month].num;
};

export const getMonthMetadataByMonthNum = (monthNum?: number) => {
  if (!monthNum) return undefined;

  return Object.values(monthMetadata).find(
    (metadata) => metadata.num === monthNum,
  );
};
