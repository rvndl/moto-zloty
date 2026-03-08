import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const accountRankEnum = pgEnum("account_rank", ["admin", "mod", "user"]);
export const eventStatusEnum = pgEnum("event_status", [
  "pending",
  "approved",
  "rejected",
]);

export const fileStatusEnum = pgEnum("file_status", ["temporary", "permanent"]);

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  rank: accountRankEnum("rank").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  bannedAt: timestamp("banned_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

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

export const event = pgTable("event", {
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
  bannerId: uuid("banner_id"),
  bannerSmallId: uuid("banner_small_id"),
  accountId: uuid("account_id")
    .notNull()
    .references(() => account.id),
  fullAddressId: uuid("full_address_id").references(() => address.id),
});

export const file = pgTable("file", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull(),
  status: fileStatusEnum("status").default("temporary"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const action = pgTable("action", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull(),
  actorId: uuid("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const accountRelations = relations(account, ({ many }) => ({
  events: many(event),
}));

export const eventRelations = relations(event, ({ one }) => ({
  account: one(account, {
    fields: [event.accountId],
    references: [account.id],
  }),
  fullAddress: one(address, {
    fields: [event.fullAddressId],
    references: [address.id],
  }),
}));
