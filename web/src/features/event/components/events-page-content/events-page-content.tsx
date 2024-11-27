import { Map } from "@components";
import { useEventsQuery } from "@features/event/api";
import { EventsList } from "./events-list";
import { EventMapMarker } from "../event-map-marker";
import { useIsMobile } from "@hooks/use-is-mobile";
import { useEffect } from "react";

const EventsPageContent = () => {
  const { data: events, isLoading } = useEventsQuery();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (events?.length) {
      document.dispatchEvent(new Event("pre-render"));
    }
  }, [events]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">Najbliższe wydarzenia</h2>
        <EventsList events={events} />
      </div>
      <section className="w-full h-full bg-red-100 border rounded-lg shadow-sm">
        <Map zoom={isMobile ? 6 : 7} isLoading={isLoading}>
          {events?.map((event) => (
            <EventMapMarker event={event} key={event.id} />
          ))}
        </Map>
      </section>
    </div>
  );
};

export { EventsPageContent };
