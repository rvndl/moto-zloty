import { getFilePath } from "@utils/index";
import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { type Event } from "types/event";
import { pl } from "date-fns/locale";
import { Badge } from "@components";
import clsx from "clsx";
import { getEventStatus } from "@utils/event";
import { useRouter } from "next/navigation";

type EventSize = "normal" | "small";

interface Props {
  event: Event;
  size?: EventSize;
}

const Event = ({ event, size = "normal" }: Props) => {
  const router = useRouter();

  const { isOngoing, isPast } = useMemo(() => getEventStatus(event), [event]);

  const distance = formatDistance(
    isPast ? event.date_to : event.date_from,
    new Date(),
    { locale: pl, addSuffix: true }
  );

  const handleOnClick = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden border rounded-lg shadow-sm cursor-pointer h-20 md:h-32 white shrink-0 snap-start hover:-translate-y-1 transition-transform z-10",
        size === "normal" ? "w-32 md:w-52" : "w-36 md:w-44",
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
        src={getFilePath(event.banner_small_id ?? event.banner_id)}
        className="object-cover w-full h-full transition rounded-md z-200 hover:scale-105"
        alt="banner"
      />
    </div>
  );
};

export { Event };
