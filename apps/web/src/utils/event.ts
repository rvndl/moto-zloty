import { compareAsc, endOfWeek, format, isAfter, startOfWeek } from "date-fns";
import { match } from "ts-pattern";
import { type EventStatus, type AnyEvent } from "@features/event/types";
import { pl } from "date-fns/locale";

export const getEventStatus = (event?: AnyEvent) => {
  if (!event) {
    return { isOngoing: false, isPast: false };
  }

  const isPast = isAfter(new Date(), event.dateTo);
  const isOngoing = !isPast && isAfter(new Date(), event.dateFrom);

  return { isOngoing, isPast };
};

export const sortEvents = <T extends AnyEvent>(events?: T[]) => {
  if (!events) {
    return [];
  }

  const today = new Date();

  return events.sort((a, b) => {
    const aHasEnded = isAfter(today, new Date(a.dateTo));
    const bHasEnded = isAfter(today, new Date(b.dateTo));

    if (aHasEnded && !bHasEnded) return 1;
    if (!aHasEnded && bHasEnded) return -1;

    return compareAsc(new Date(a.dateFrom), new Date(b.dateFrom));
  });
};

export const getEventStatusText = (eventStatus?: EventStatus) => {
  return match(eventStatus)
    .with("pending", () => "Oczekujące")
    .with("approved", () => "Zaakceptowane")
    .with("rejected", () => "Odrzucone")
    .otherwise(() => "Nieznany status");
};

export const groupEventsByWeek = <T extends AnyEvent>(events?: T[]) => {
  const grouped: Record<string, T[]> = {};

  events?.forEach((event) => {
    const eventDate = event.dateFrom;
    const weekStart = format(
      startOfWeek(eventDate, { weekStartsOn: 1 }),
      "dd MMMM",
      { locale: pl },
    );
    const weekEnd = format(
      endOfWeek(eventDate, { weekStartsOn: 1 }),
      "dd MMMM",
      { locale: pl },
    );
    const weekKey = `${weekStart} - ${weekEnd}`;

    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }

    grouped[weekKey].push(event);
  });

  return grouped;
};
