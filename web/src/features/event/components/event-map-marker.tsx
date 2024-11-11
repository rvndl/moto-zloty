import { Button } from "@components/button";
import { Marker, Popup } from "react-leaflet";
import { type Event } from "types/event";
import { truncate } from "lodash";
import { useNavigate } from "react-router-dom";
import { EventStartingDate } from "./event-starting-date";
import { Icon } from "leaflet";

interface Props {
  event: Event;
}

const EventMapMarker = ({ event }: Props) => {
  const navigate = useNavigate();

  const handleOnDetails = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <Marker position={[event.latitude, event.longitude]}>
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
    </Marker>
  );
};

export { EventMapMarker };
