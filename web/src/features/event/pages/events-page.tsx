import { Map } from "@components/map";
import { Event, CreateEventDialog, EventMapMarker } from "../components";
import { useEventsQuery } from "../api";
import { useMemo } from "react";
import { compareAsc, isAfter } from "date-fns";

const EventsPage = () => {
  const { data: events } = useEventsQuery();

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

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="font-semibold">Najbliższe wydarzenia</h1>
        <CreateEventDialog />
      </div>
      <section className="flex pb-6 overflow-x-auto overflow-y-hidden gap-x-4">
        {sortedEvents?.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </section>
      <section className="w-full h-full bg-red-100 border rounded-lg shadow-sm">
        <Map zoom={7}>
          {sortedEvents?.map((event) => (
            <EventMapMarker event={event} key={event.id} />
          ))}
        </Map>
      </section>
    </div>
  );
};

export { EventsPage };
