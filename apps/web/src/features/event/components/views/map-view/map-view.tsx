import { api, useQuery } from "api/eden";
import { EventMap } from "../home-view/event-map/map";

const MAP_EVENTS_QUERY_KEY = ["map-view"];

const MapView = () => {
  const { data: events } = useQuery(MAP_EVENTS_QUERY_KEY, () => api.map.get());

  return (
    <div className="h-[75vh]">
      <EventMap events={events} />
    </div>
  );
};

export { MapView, MAP_EVENTS_QUERY_KEY };
