import { type InferResponse, api } from "api/eden";

// Event list response
export type Events = InferResponse<typeof api.events.get>;
export type Event = Events[number];

// Map events (different shape, no account)
export type MapEvents = InferResponse<typeof api.map.get>;
export type MapEvent = MapEvents[number];

// Carousel events
export type CarouselEvents = InferResponse<typeof api.events.carousel.get>;
export type CarouselEvent = CarouselEvents[number];

// Any event type for utility functions that work with any event shape
export type AnyEvent = Event | MapEvent | CarouselEvent;

// Single event response
export type EventDetails = InferResponse<ReturnType<typeof api.events>["get"]>;

// Event status
export type EventStatus = NonNullable<Event["status"]>;

// Address from event
export type Address = NonNullable<Event["fullAddress"]>;

// Event actions
export type EventActions = InferResponse<
  ReturnType<typeof api.events>["actions"]["get"]
>;
export type EventAction = EventActions[number];

// Related events
export type RelatedEvents = InferResponse<
  ReturnType<ReturnType<ReturnType<typeof api.events>["listRelated"]>>["get"]
>;
export type RelatedEvent = RelatedEvents["relatedByMonth"][number];

// Search events
export type SearchEvents = InferResponse<
  ReturnType<typeof api.events.search>["get"]
>;
export type SearchEvent = SearchEvents[number];

// List by state events
export type ListByStateEvents = InferResponse<
  typeof api.events.listByState.get
>;
export type ListByStateEvent = ListByStateEvents[number];
