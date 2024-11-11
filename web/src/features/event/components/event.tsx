import { getFilePath } from "@utils/index";
import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { type Event } from "types/event";
import { pl } from "date-fns/locale";
import { Badge } from "@components/badge";
import clsx from "clsx";
import { getEventStatus } from "@utils/event";
import { useNavigate } from "react-router-dom";

interface Props {
  event: Event;
}

const Event = ({ event }: Props) => {
  const navigate = useNavigate();

  const { isOngoing, isPast } = useMemo(() => getEventStatus(event), [event]);

  const distance = formatDistance(
    isPast ? event.date_to : event.date_from,
    new Date(),
    { locale: pl, addSuffix: true }
  );

  const handleOnClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden border rounded-lg shadow-sm cursor-pointer h-36 white w-60 shrink-0",
        isPast && "opacity-50"
      )}
      onClick={handleOnClick}
    >
      <Badge
        variant={isOngoing ? "danger" : "secondary"}
        className="absolute z-10 top-1 left-1"
      >
        {isOngoing ? "W trakcie" : distance}
      </Badge>
      <img
        src={getFilePath(event.banner_id)}
        className="object-cover w-full h-full transition rounded-md z-200 hover:scale-105"
        alt="banner"
      />
    </div>
  );
};

export { Event };
