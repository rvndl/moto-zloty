import { type Event } from "types/event";

type CreateEventResponse = Event;
type ChangeEventStatusReponse = Event;
type EventsResponse = Event[];
type EventResponse = Event;

export type {
  CreateEventResponse,
  EventsResponse,
  EventResponse,
  ChangeEventStatusReponse,
};
