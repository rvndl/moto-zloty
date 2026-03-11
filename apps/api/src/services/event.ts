import { eq, and, gte, lte, desc, asc, ne, sql } from "drizzle-orm";
import { db } from "../db";
import { event, account, address, action, file } from "../db/schema";
import { type ServiceResult, ok, err } from "./types";
import type { EventListQueryType } from "../models/event";

export type EventStatus = "pending" | "approved" | "rejected";
export type SortOrder = "Asc" | "Desc";

export interface EventWithRelations {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: EventStatus | null;
  longitude: number;
  latitude: number;
  dateFrom: string;
  dateTo: string;
  createdAt: string | null;
  bannerId: string | null;
  bannerSmallId: string | null;
  accountId: string;
  fullAddressId: string | null;
  account: {
    id: string;
    username: string;
    rank: string | null;
    createdAt: string | null;
  } | null;
  fullAddress: typeof address.$inferSelect | null;
}

export interface CreateEventInput {
  name: string;
  description?: string;
  address?: {
    name?: string;
    houseNumber?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
  };
  latitude: number;
  longitude: number;
  dateFrom: string;
  dateTo: string;
  bannerId?: string;
  bannerSmallId?: string;
}

export interface UpdateAddressInput {
  address?: {
    name?: string;
    houseNumber?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
  };
  latitude: number;
  longitude: number;
}

export const statusLabels: Record<EventStatus, string> = {
  pending: "Stworzenie wydarzenia",
  approved: "Akceptacja wydarzenia",
  rejected: "Odrzucenie wydarzenia",
};

export abstract class EventService {
  static async getById(
    eventId: string,
  ): Promise<ServiceResult<EventWithRelations>> {
    const result = await db
      .select({
        event: event,
        account: {
          id: account.id,
          username: account.username,
          rank: account.rank,
          createdAt: account.createdAt,
        },
        address: address,
      })
      .from(event)
      .leftJoin(account, eq(event.accountId, account.id))
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(eq(event.id, eventId))
      .limit(1);

    const row = result[0];
    if (!row) {
      return err(404, "Wydarzenie nie zostało znalezione");
    }

    return ok({
      ...row.event,
      account: row.account,
      fullAddress: row.address,
    });
  }

  static async getActions(eventId: string) {
    return await db.select().from(action).where(eq(action.eventId, eventId));
  }

  static async list(query: EventListQueryType) {
    const {
      dateFrom,
      dateTo,
      sortOrder,
      state,
      year = new Date().getFullYear(),
      month,
    } = query;

    const conditions = [eq(event.status, "approved")];

    if (dateFrom) {
      conditions.push(gte(event.dateFrom, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(event.dateFrom, dateTo));
    }

    conditions.push(eq(sql`EXTRACT(YEAR FROM ${event.dateFrom})`, year));

    if (month) {
      conditions.push(
        eq(sql`EXTRACT(MONTH FROM ${event.dateFrom})`, parseInt(month)),
      );
    }

    const orderBy =
      sortOrder === "Asc" ? asc(event.dateFrom) : desc(event.dateFrom);

    let queryBuilder = db
      .select({
        event: event,
        account: {
          id: account.id,
          username: account.username,
          rank: account.rank,
          createdAt: account.createdAt,
        },
        address: address,
      })
      .from(event)
      .leftJoin(account, eq(event.accountId, account.id))
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(and(...conditions))
      .orderBy(orderBy);

    if (state) {
      queryBuilder = db
        .select({
          event: event,
          account: {
            id: account.id,
            username: account.username,
            rank: account.rank,
            createdAt: account.createdAt,
          },
          address: address,
        })
        .from(event)
        .leftJoin(account, eq(event.accountId, account.id))
        .leftJoin(address, eq(event.fullAddressId, address.id))
        .where(and(...conditions, eq(address.state, state)))
        .orderBy(orderBy);
    }

    const results = await queryBuilder;

    return results.map((row) => ({
      ...row.event,
      account: row.account,
      fullAddress: row.address,
    }));
  }

  static async search(searchQuery: string) {
    const results = await db
      .select({
        event: event,
        address: address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(
        and(
          ne(event.status, "rejected"),
          sql`similarity(
            ${event.name} || ' ' ||
            COALESCE(${event.address}, '') || ' ' ||
            COALESCE(${address.name}, '') || ' ' ||
            COALESCE(${address.city}, '') || ' ' ||
            COALESCE(${address.state}, '')
          , ${searchQuery}) > 0.06`,
        ),
      )
      .orderBy(
        sql`similarity(
          ${event.name} || ' ' ||
          COALESCE(${event.address}, '') || ' ' ||
          COALESCE(${address.name}, '') || ' ' ||
          COALESCE(${address.city}, '') || ' ' ||
          COALESCE(${address.state}, '')
        , ${searchQuery}) DESC`,
      )
      .limit(10);

    return results.map((row) => ({
      ...row.event,
      fullAddress: row.address,
    }));
  }

  static async create(
    input: CreateEventInput,
    userId: string,
    username: string,
  ): Promise<ServiceResult<typeof event.$inferSelect>> {
    const {
      name,
      description,
      address: addressInput,
      latitude,
      longitude,
      dateFrom,
      dateTo,
      bannerId,
      bannerSmallId,
    } = input;

    const [newAddress] = await db
      .insert(address)
      .values({ ...addressInput })
      .returning();

    if (!newAddress) {
      return err(500, "Failed to create address");
    }

    const [newEvent] = await db
      .insert(event)
      .values({
        name,
        description,
        fullAddressId: newAddress.id,
        latitude,
        longitude,
        dateFrom,
        dateTo,
        bannerId,
        bannerSmallId,
        accountId: userId,
        status: "pending",
      })
      .returning();

    if (!newEvent) {
      return err(500, "Failed to create event");
    }

    if (bannerId) {
      await db
        .update(file)
        .set({ status: "permanent" })
        .where(eq(file.id, bannerId));
    }

    if (bannerSmallId) {
      await db
        .update(file)
        .set({ status: "permanent" })
        .where(eq(file.id, bannerSmallId));
    }

    await db.insert(action).values({
      eventId: newEvent.id,
      actorId: userId,
      actorName: username,
      content: "Stworzenie wydarzenia",
    });

    return ok(newEvent);
  }

  static async updateStatus(
    eventId: string,
    newStatus: EventStatus,
    userId: string,
    username: string,
  ): Promise<ServiceResult<typeof event.$inferSelect>> {
    const [updatedEvent] = await db
      .update(event)
      .set({ status: newStatus })
      .where(eq(event.id, eventId))
      .returning();

    if (!updatedEvent) {
      return err(404, "Wydarzenie nie zostało znalezione");
    }

    await db.insert(action).values({
      eventId: updatedEvent.id,
      actorId: userId,
      actorName: username,
      content: statusLabels[newStatus] || newStatus,
    });

    return ok(updatedEvent);
  }

  static async updateAddress(
    eventId: string,
    input: UpdateAddressInput,
    userId: string,
    username: string,
    userRank: string,
    isPermittedFn: (rank: string) => boolean,
  ): Promise<ServiceResult<typeof address.$inferSelect>> {
    const [existingEvent] = await db
      .select()
      .from(event)
      .where(eq(event.id, eventId))
      .limit(1);

    if (!existingEvent) {
      return err(404, "Wystąpił błąd podczas pobierania wydarzenia");
    }

    if (!isPermittedFn(userRank) && existingEvent.accountId !== userId) {
      return err(403, "Brak uprawnień");
    }

    const { address: addressInput, latitude, longitude } = input;

    let updatedAddress;

    if (existingEvent.fullAddressId) {
      [updatedAddress] = await db
        .update(address)
        .set({ ...addressInput })
        .where(eq(address.id, existingEvent.fullAddressId))
        .returning();
    } else {
      const [newAddress] = await db
        .insert(address)
        .values({ ...addressInput })
        .returning();

      if (!newAddress) {
        return err(500, "Failed to create address");
      }

      updatedAddress = newAddress;

      await db
        .update(event)
        .set({ fullAddressId: newAddress.id })
        .where(eq(event.id, eventId));
    }

    await db
      .update(event)
      .set({ latitude, longitude })
      .where(eq(event.id, eventId));

    await db.insert(action).values({
      eventId: eventId,
      actorId: userId,
      actorName: username,
      content: "Aktualizacja adresu",
    });

    return ok(updatedAddress!);
  }

  static async listAll() {
    return await db.select().from(event);
  }

  static async getCarousel(limit = 15) {
    const results = await db
      .select({
        event: {
          id: event.id,
          name: event.name,
          address: event.address,
          dateFrom: event.dateFrom,
          dateTo: event.dateTo,
          description: event.description,
          createdAt: event.createdAt,
          bannerId: event.bannerId,
          bannerSmallId: event.bannerSmallId,
          fullAddressId: event.fullAddressId,
        },
        address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(
        and(
          eq(event.status, "approved"),
          gte(event.dateTo, new Date().toISOString()),
        ),
      )
      .orderBy(asc(event.dateFrom))
      .limit(limit);

    return results.map((row) => ({
      ...row.event,
      description: row.event.description?.slice(0, 60),
      fullAddress: row.address,
    }));
  }

  static async listApproved() {
    const results = await db
      .select({
        event,
        address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(eq(event.status, "approved"));

    return results.map((row) => ({
      ...row.event,
      fullAddress: row.address,
    }));
  }

  static async listByStateGrouped() {
    const results = await db
      .select({
        event,
        address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(eq(event.status, "approved"));

    const now = new Date();

    const sortedEvents = results
      .map((row) => ({
        ...row.event,
        description: row.event.description?.slice(0, 60),
        fullAddress: row.address,
      }))
      .sort((a, b) => {
        const aFrom = new Date(a.dateFrom);
        const aTo = new Date(a.dateTo);
        const bFrom = new Date(b.dateFrom);
        const bTo = new Date(b.dateTo);

        const aOngoing = aFrom <= now && now <= aTo;
        const bOngoing = bFrom <= now && now <= bTo;

        if (aOngoing && !bOngoing) return -1;
        if (!aOngoing && bOngoing) return 1;

        if (!aOngoing && !bOngoing) {
          const aUpcoming = aFrom > now;
          const bUpcoming = bFrom > now;

          if (aUpcoming && !bUpcoming) return -1;
          if (!aUpcoming && bUpcoming) return 1;

          if (aUpcoming && bUpcoming) {
            return aFrom.getTime() - bFrom.getTime();
          } else {
            return bFrom.getTime() - aFrom.getTime();
          }
        }

        return aFrom.getTime() - bFrom.getTime();
      });

    const groupedEvents: Record<string, typeof sortedEvents> = {};

    for (const event of sortedEvents) {
      const state = event.fullAddress?.state?.toLowerCase() || "unknown";
      if (!groupedEvents[state]) {
        groupedEvents[state] = [];
      }

      if (groupedEvents[state].length < 4) {
        groupedEvents[state].push(event);
      }
    }

    return Object.values(groupedEvents).flat();
  }

  static async listForMap(dateFrom?: string, dateTo?: string) {
    const conditions = [
      eq(event.status, "approved"),
      gte(event.dateTo, new Date().toISOString()),
    ];

    if (dateFrom) {
      conditions.push(gte(event.dateFrom, dateFrom));
    }

    if (dateTo) {
      conditions.push(lte(event.dateFrom, dateTo));
    }

    const results = await db
      .select({
        event: {
          id: event.id,
          name: event.name,
          address: event.address,
          longitude: event.longitude,
          latitude: event.latitude,
          dateFrom: event.dateFrom,
          dateTo: event.dateTo,
          createdAt: event.createdAt,
          bannerId: event.bannerId,
          bannerSmallId: event.bannerSmallId,
          fullAddressId: event.fullAddressId,
        },
        address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(and(...conditions));

    return results.map((row) => ({
      ...row.event,
      fullAddress: row.address,
    }));
  }

  static async getRelated(eventId: string, month: number, state: string) {
    const relatedByMonth = await db
      .select()
      .from(event)
      .where(
        and(
          sql`EXTRACT(MONTH FROM ${event.dateFrom}) = ${month}`,
          ne(event.id, eventId),
          eq(event.status, "approved"),
        ),
      )
      .orderBy(asc(event.dateFrom))
      .limit(6);

    const relatedByState = await db
      .select({
        event,
        address,
      })
      .from(event)
      .leftJoin(address, eq(event.fullAddressId, address.id))
      .where(
        and(
          eq(address.state, state),
          ne(event.id, eventId),
          eq(event.status, "approved"),
        ),
      )
      .orderBy(asc(event.dateFrom))
      .limit(6);

    return {
      relatedByMonth,
      relatedByState: relatedByState.map((r) => r.event),
    };
  }
}
