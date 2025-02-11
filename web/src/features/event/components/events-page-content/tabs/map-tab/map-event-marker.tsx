import { type Event } from "types/event";
import { truncate } from "lodash";
import { EventStartingDate } from "../../../event-starting-date";
import { Button } from "@components";
import { getEventStatus } from "@utils/event";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

interface Props {
  event: Event;
}

const MapEventMarker = ({ event }: Props) => {
  const router = useRouter();
  const { isOngoing } = useMemo(() => getEventStatus(event), [event]);

  const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    {
      ssr: false,
    }
  );

  const MapMarker = dynamic(
    () => import("@components/map/map-marker").then((mod) => mod.MapMarker),
    {
      ssr: false,
    }
  );

  const handleOnDetails = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <MapMarker position={[event.latitude, event.longitude]} isLive={isOngoing}>
      <Popup>
        <div className="leading-snug">
          <h2 className="text-lg font-semibold">{event.name}</h2>
          <p className="w-48 text-xs text-muted text-ellipsis">
            {truncate(event.address, { length: 34 })}
          </p>
        </div>
        <div className="mt-4 w-min">
          <EventStartingDate event={event} />
        </div>
        <Button
          className="w-full mt-2"
          variant="outline"
          size="small"
          onClick={handleOnDetails}
        >
          Szczegóły
        </Button>
      </Popup>
    </MapMarker>
  );
};

export { MapEventMarker };
