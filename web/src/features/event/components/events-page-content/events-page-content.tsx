import { Map } from "@components";
import { useEventsQuery } from "@features/event/api";
import { CreateEventDialog } from "../create-event-dialog";
import { EventsList } from "./events-list";
import { EventMapMarker } from "../event-map-marker";

const EventsPageContent = () => {
  const { data: events, isLoading } = useEventsQuery();

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="font-semibold">Najbliższe wydarzenia</h1>
        <CreateEventDialog />
      </div>
      <EventsList events={events} />
      <section className="w-full h-full bg-red-100 border rounded-lg shadow-sm">
        <Map zoom={7} isLoading={isLoading}>
          {events?.map((event) => (
            <EventMapMarker event={event} key={event.id} />
          ))}
        </Map>
      </section>
    </div>
  );
};

export { EventsPageContent };
