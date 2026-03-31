import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  doublePrecision,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  relations,
  type InferSelectModel,
  type InferInsertModel,
} from "drizzle-orm";

export const accountRankEnum = pgEnum("account_rank", ["admin", "mod", "user"]);
export const eventStatusEnum = pgEnum("event_status", [
  "pending",
  "approved",
  "rejected",
]);
export const fileStatusEnum = pgEnum("file_status", ["temporary", "permanent"]);

export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    rank: accountRankEnum("rank").notNull().default("user"),
    banned: boolean("banned").notNull().default(false),
    banReason: text("ban_reason"),
    bannedAt: timestamp("banned_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    emailIdx: index("account_email_idx").on(table.email),
  }),
);

export const address = pgTable(
  "address",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    houseNumber: text("house_number"),
    road: text("road"),
    neighbourhood: text("neighbourhood"),
    suburb: text("suburb"),
    city: text("city"),
    state: text("state"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    stateIdx: index("address_state_idx").on(table.state),
  }),
);

export const event = pgTable(
  "event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    address: text("address"),
    status: eventStatusEnum("status").notNull().default("pending"),
    longitude: doublePrecision("longitude").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    dateFrom: timestamp("date_from", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    dateTo: timestamp("date_to", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    bannerId: uuid("banner_id"),
    bannerSmallId: uuid("banner_small_id"),
    accountId: uuid("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
    fullAddressId: uuid("full_address_id").references(() => address.id, {
      onDelete: "set null",
    }),
  },
  (table) => ({
    statusDateFromIdx: index("event_status_date_from_idx").on(
      table.status,
      table.dateFrom,
    ),
    statusDateToIdx: index("event_status_date_to_idx").on(
      table.status,
      table.dateTo,
    ),
    accountIdIdx: index("event_account_id_idx").on(table.accountId),
    fullAddressIdIdx: index("event_full_address_id_idx").on(
      table.fullAddressId,
    ),
  }),
);

export const file = pgTable(
  "file",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    status: fileStatusEnum("status").notNull().default("temporary"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    statusIdx: index("file_status_idx").on(table.status),
  }),
);

export const action = pgTable(
  "action",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
    actorName: text("actor_name").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    eventIdIdx: index("action_event_id_idx").on(table.eventId),
  }),
);

export const scraped = pgTable(
  "scraped",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    imageUrl: text("image_url"),
    description: text("description"),
    place: text("place"),
    seen: boolean("seen").notNull().default(false),
    sourceUrl: text("source_url").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    sourceUrlIdx: uniqueIndex("scraped_source_url_idx").on(table.sourceUrl),
    seenIdx: index("scraped_seen_idx").on(table.seen),
  }),
);

export const accountRelations = relations(account, ({ many }) => ({
  events: many(event),
  actions: many(action),
}));

export const addressRelations = relations(address, ({ many }) => ({
  events: many(event),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  account: one(account, {
    fields: [event.accountId],
    references: [account.id],
  }),
  fullAddress: one(address, {
    fields: [event.fullAddressId],
    references: [address.id],
  }),
  actions: many(action),
}));

export const actionRelations = relations(action, ({ one }) => ({
  event: one(event, {
    fields: [action.eventId],
    references: [event.id],
  }),
  actor: one(account, {
    fields: [action.actorId],
    references: [account.id],
  }),
}));

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;
export type Address = InferSelectModel<typeof address>;
export type NewAddress = InferInsertModel<typeof address>;
export type Event = InferSelectModel<typeof event>;
export type NewEvent = InferInsertModel<typeof event>;
export type File = InferSelectModel<typeof file>;
export type NewFile = InferInsertModel<typeof file>;
export type Action = InferSelectModel<typeof action>;
export type NewAction = InferInsertModel<typeof action>;
export type Scraped = InferSelectModel<typeof scraped>;
export type NewScraped = InferInsertModel<typeof scraped>;
