import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import { Event } from "@features/event/types/event";
import { WeekOption } from "../types/social-media";

export const UPCOMING_WEEKS_QUERY_KEY = ["UPCOMING_SOCIAL_MEDIA_EVENTS"];
export const WEEKS_AHEAD = 8;

export const getCalendarRange = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(addWeeks(start, WEEKS_AHEAD - 1), {
    weekStartsOn: 1,
  });

  return { start, end };
};

export const getWeekLabel = (start: Date, end: Date) =>
  `${format(start, "d MMMM", { locale: pl })} – ${format(end, "d MMMM", {
    locale: pl,
  })}`;

export const getWeekOptions = (
  events: Event[] | undefined,
  calendarStart: Date,
): WeekOption[] => {
  return Array.from({ length: WEEKS_AHEAD }, (_, index) => {
    const start = startOfWeek(addWeeks(calendarStart, index), {
      weekStartsOn: 1,
    });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    const count =
      events?.filter((event) => {
        const eventDate = new Date(event.dateFrom);

        return eventDate >= start && eventDate <= end;
      }).length ?? 0;

    return {
      id: start.toISOString(),
      label: getWeekLabel(start, end),
      start,
      end,
      count,
    };
  });
};

export const getEventsCountLabel = (count: number) => {
  if (count === 1) {
    return "wydarzenie";
  }

  if (count > 1 && count < 5) {
    return "wydarzenia";
  }

  return "wydarzeń";
};
