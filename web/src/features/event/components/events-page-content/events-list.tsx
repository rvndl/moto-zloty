import { type Event as EventType } from "types/event";
import { Event } from "../event";
import { useMemo } from "react";
import { compareAsc, isAfter } from "date-fns";
import { Skeleton } from "@components/skeleton";

interface Props {
  events?: EventType[];
}

const EventsList = ({ events }: Props) => {
  const sortedEvents = useMemo(() => {
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
  }, [events]);

  if (!events) {
    return (
      <section className="flex gap-4 pb-6 overflow-hidden gap-x-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-60 shrink-0" />
        ))}
      </section>
    );
  }

  return (
    <section className="flex pb-6 overflow-x-auto overflow-y-hidden gap-x-4">
      {sortedEvents?.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </section>
  );
};

export { EventsList };
