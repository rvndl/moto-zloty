import { Address } from "types/address";
import { type Event } from "types/event";

type CreateEventResponse = Event;
type ChangeEventStatusReponse = Event;
type ChangeEventAddressResponse = Address;
type EventsResponse = Event[];
type EventResponse = Event;
type RelatedEventsResponse = {
  related_by_month: Event[];
  related_by_state: Event[];
};

export type {
  CreateEventResponse,
  EventsResponse,
  EventResponse,
  ChangeEventStatusReponse,
  ChangeEventAddressResponse,
  RelatedEventsResponse,
};
