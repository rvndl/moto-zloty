import { type Event as EventType } from "types/event";
import { Event } from "../event";
import { useMemo } from "react";
import { Skeleton } from "@components";
import { sortEvents } from "@utils/event";

interface Props {
  events?: EventType[];
}

const EventsList = ({ events }: Props) => {
  const sortedEvents = useMemo(() => sortEvents(events), [events]);

  if (!events) {
    return (
      <section className="flex gap-4 pb-4 overflow-hidden gap-x-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-60 shrink-0" />
        ))}
      </section>
    );
  }

  return (
    <section className="flex pb-2 overflow-x-auto overflow-y-hidden gap-x-1 md:gap-x-4">
      {sortedEvents?.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </section>
  );
};

export { EventsList };
