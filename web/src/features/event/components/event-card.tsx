import { getFilePath } from "@utils/index";
import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { type Event } from "types/event";
import { pl } from "date-fns/locale";
import { Badge } from "@components";
import clsx from "clsx";
import { getEventStatus } from "@utils/event";
import Link from "next/link";
import Image from "next/image";

type EventSize = "normal" | "small";

interface Props {
  event: Event;
  size?: EventSize;
}

const EventCard = ({ event, size = "normal" }: Props) => {
  const { isOngoing, isPast } = useMemo(() => getEventStatus(event), [event]);

  const distance = formatDistance(
    isPast ? event.date_to : event.date_from,
    new Date(),
    { locale: pl, addSuffix: true }
  );

  return (
    <Link href={`/wydarzenie/${event.id}`} rel="dofollow">
      <div
        className={clsx(
          "relative overflow-hidden border rounded-lg shadow-sm cursor-pointer h-20 md:h-32 white shrink-0 snap-start hover:-translate-y-1 transition-transform z-10 group select-none",
          size === "normal" ? "w-32 md:w-52" : "w-36 md:w-44",
          isPast && "opacity-50"
        )}
      >
        <h2 className="pointer-events-none max-w-fit translate-y-1 truncate font-normal absolute bottom-1 left-1 right-1 z-10 px-2 py-0.5 leading-none transition border border-muted/50 text-white text-sm bg-muted/50 opacity-0 rounded-md group-hover:opacity-100 group-hover:translate-y-0 backdrop-blur-xl">
          {event.name}
        </h2>
        <Badge
          variant={isOngoing ? "danger" : "secondary"}
          className="absolute z-10 top-1 left-1"
        >
          {isOngoing ? "W trakcie" : distance}
        </Badge>
        <Image
          src={getFilePath(event.banner_small_id ?? event.banner_id)}
          className="object-cover w-full h-full transition rounded-md z-200 hover:scale-105"
          alt={event.name ?? "event banner"}
          title={event.name ?? "event banner"}
          width={size === "normal" ? 200 : 150}
          height={size === "normal" ? 200 : 150}
        />
      </div>
    </Link>
  );
};

export { EventCard };
