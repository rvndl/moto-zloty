import { Map } from "@components";
import { useIsMobile } from "@hooks/use-is-mobile";
import { MapEventMarker } from "./map-event-marker";
import { getEventStatus } from "@utils/event";
import { useMemo } from "react";
import { Event } from "types/event";

interface Props {
  events?: Event[];
  isLoading?: boolean;
}

const MapTab = ({ events, isLoading }: Props) => {
  const isMobile = useIsMobile();

  const activeEvents = useMemo(
    () => events?.filter((event) => !getEventStatus(event).isPast),
    [events]
  );

  return (
    <Map zoom={isMobile ? 6 : 7} isLoading={isLoading}>
      {activeEvents?.map((event) => (
        <MapEventMarker event={event} key={event.id} />
      ))}
    </Map>
  );
};

export { MapTab };
