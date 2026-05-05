import type { WeeklyMotorcycleEventType } from "../../models/instagram-carousel";

export interface StateGroup {
  state: string;
  events: WeeklyMotorcycleEventType[];
}

export interface TopStateSummary {
  state: string;
  count: number;
}

export interface OverviewSlideInput {
  kind: "overview";
  weekLabel: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  eventCount: number;
  stateCount: number;
  topStates: TopStateSummary[];
}

export interface StateSlideInput {
  kind: "state";
  state: string;
  events: WeeklyMotorcycleEventType[];
}

export interface StateSlideEventPreview {
  name: string;
  url: string;
  dateFrom: string;
  dateTo: string;
  location: string;
}

export type InstagramCarouselInput = OverviewSlideInput | StateSlideInput;
