import { isAfter } from "date-fns";
import { type Event } from "types/event";

export const getEventStatus = (event?: Event) => {
  if (!event) {
    return { isOngoing: false, isPast: false };
  }

  const isPast = isAfter(new Date(), event.date_to);
  const isOngoing = !isPast && isAfter(new Date(), event.date_from);

  return { isOngoing, isPast };
};
