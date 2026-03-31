import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    rank: accountRankEnum("rank").default("user"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    bannedAt: timestamp("banned_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    bannedIdx: index("account_banned_idx").on(table.banned),
  }),
);

export const address = pgTable("address", {
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
});

export const file = pgTable(
  "file",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    status: fileStatusEnum("status").default("temporary"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    statusIdx: index("file_status_idx").on(table.status),
  }),
);

export const event = pgTable(
  "event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    address: text("address"),
    status: eventStatusEnum("status").default("pending"),
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

    bannerId: uuid("banner_id").references(() => file.id, {
      onDelete: "set null",
    }),
    bannerSmallId: uuid("banner_small_id").references(() => file.id, {
      onDelete: "set null",
    }),

    accountId: uuid("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),

    fullAddressId: uuid("full_address_id").references(() => address.id, {
      onDelete: "set null",
    }),
  },
  (table) => ({
    accountIdIdx: index("event_account_id_idx").on(table.accountId),
    statusIdx: index("event_status_idx").on(table.status),
    datesIdx: index("event_dates_idx").on(table.dateFrom, table.dateTo),
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
    actorIdIdx: index("action_actor_id_idx").on(table.actorId),
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
    seen: boolean("seen").default(false),
    sourceUrl: text("source_url").notNull().unique(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => ({
    seenIdx: index("scraped_seen_idx").on(table.seen),
  }),
);

export const accountRelations = relations(account, ({ many }) => ({
  events: many(event),
  actions: many(action),
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
  banner: one(file, {
    fields: [event.bannerId],
    references: [file.id],
  }),
  bannerSmall: one(file, {
    fields: [event.bannerSmallId],
    references: [file.id],
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
