import { t } from "elysia";

export const AddressModel = t.Object({
  name: t.Optional(t.String()),
  houseNumber: t.Optional(t.String()),
  road: t.Optional(t.String()),
  neighbourhood: t.Optional(t.String()),
  suburb: t.Optional(t.String()),
  city: t.Optional(t.String()),
  state: t.Optional(t.String()),
});

export const CreateEventBody = t.Object({
  name: t.String({ minLength: 1, description: "Event name" }),
  description: t.Optional(t.String({ description: "Event description" })),
  address: t.Optional(AddressModel),
  latitude: t.Number({ description: "Latitude coordinate" }),
  longitude: t.Number({ description: "Longitude coordinate" }),
  dateFrom: t.String({ description: "Event start date (ISO string)" }),
  dateTo: t.String({ description: "Event end date (ISO string)" }),
  bannerId: t.Optional(t.String({ format: "uuid" })),
  bannerSmallId: t.Optional(t.String({ format: "uuid" })),
});

export const EventListQuery = t.Object({
  dateFrom: t.Optional(
    t.String({ description: "Filter events starting from this date" }),
  ),
  dateTo: t.Optional(
    t.String({ description: "Filter events until this date" }),
  ),
  sortOrder: t.Optional(t.Union([t.Literal("Asc"), t.Literal("Desc")])),
  state: t.Optional(t.String({ description: "Filter by state/region" })),
  month: t.Optional(t.String({ description: "Filter by month" })),
  year: t.Optional(t.String({ description: "Filter by year" })),
});

export const EventIdParams = t.Object({
  id: t.String({ format: "uuid", description: "Event ID" }),
});

export const AccountSummary = t.Object({
  id: t.String({ format: "uuid" }),
  username: t.String(),
  rank: t.Nullable(t.String()),
  createdAt: t.Nullable(t.Date()),
});

export const AddressResponse = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.Nullable(t.String()),
  houseNumber: t.Nullable(t.String()),
  road: t.Nullable(t.String()),
  neighbourhood: t.Nullable(t.String()),
  suburb: t.Nullable(t.String()),
  city: t.Nullable(t.String()),
  state: t.Nullable(t.String()),
  createdAt: t.Nullable(t.Date()),
});

export const EventResponse = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String(),
  description: t.Nullable(t.String()),
  address: t.Nullable(t.String()),
  status: t.Nullable(
    t.Union([
      t.Literal("pending"),
      t.Literal("approved"),
      t.Literal("rejected"),
    ]),
  ),
  longitude: t.Number(),
  latitude: t.Number(),
  dateFrom: t.Date(),
  dateTo: t.Date(),
  createdAt: t.Nullable(t.Date()),
  bannerId: t.Nullable(t.String()),
  bannerSmallId: t.Nullable(t.String()),
  accountId: t.String(),
  fullAddressId: t.Nullable(t.String()),
  account: t.Nullable(AccountSummary),
  fullAddress: t.Nullable(AddressResponse),
});

export const EventListResponse = t.Array(EventResponse);

export type CreateEventBodyType = typeof CreateEventBody.static;
export type EventListQueryType = typeof EventListQuery.static;
export type EventResponseType = typeof EventResponse.static;
