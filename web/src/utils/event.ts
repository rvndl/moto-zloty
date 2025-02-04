import {
  compareAsc,
  endOfWeek,
  format,
  isAfter,
  parseISO,
  startOfWeek,
} from "date-fns";
import { match } from "ts-pattern";
import { EventStatus, type Event } from "types/event";

export const getEventStatus = (event?: Event) => {
  if (!event) {
    return { isOngoing: false, isPast: false };
  }

  const isPast = isAfter(new Date(), event.date_to);
  const isOngoing = !isPast && isAfter(new Date(), event.date_from);

  return { isOngoing, isPast };
};

export const sortEvents = (events?: Event[]) => {
  if (!events) {
    return [];
  }

  const today = new Date();

  return events.sort((a, b) => {
    const aHasEnded = isAfter(today, new Date(a.date_to));
    const bHasEnded = isAfter(today, new Date(b.date_to));

    if (aHasEnded && !bHasEnded) return 1;
    if (!aHasEnded && bHasEnded) return -1;

    return compareAsc(new Date(a.date_from), new Date(b.date_from));
  });
};

export const getEventStatusText = (eventStatus?: EventStatus) => {
  return match(eventStatus)
    .with("PENDING", () => "Oczekujące")
    .with("APPROVED", () => "Zaakceptowane")
    .with("REJECTED", () => "Odrzucone")
    .otherwise(() => "Nieznany status");
};

export const groupEventsByWeek = (events?: Event[]) => {
  const grouped: Record<string, Event[]> = {};

  events?.forEach((event) => {
    const eventDate = parseISO(event.date_from);
    const weekStart = format(
      startOfWeek(eventDate, { weekStartsOn: 1 }),
      "dd.MM.yyyy"
    );
    const weekEnd = format(
      endOfWeek(eventDate, { weekStartsOn: 1 }),
      "dd.MM.yyyy"
    );
    const weekKey = `${weekStart} - ${weekEnd}`;

    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }
    grouped[weekKey].push(event);
  });

  return grouped;
};
