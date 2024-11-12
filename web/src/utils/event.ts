import { compareAsc, isAfter } from "date-fns";
import { type Event } from "types/event";

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
