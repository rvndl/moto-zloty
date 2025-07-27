import { getFilePath } from "@utils/index";
import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { type Event } from "types/event";
import { pl } from "date-fns/locale";
import clsx from "clsx";
import { getEventStatus } from "@utils/event";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon, MapPinIcon } from "lucide-react";
import { stripHtml } from "string-strip-html";
import { PingIcon } from "@components/ping-icon";
import { getShortState } from "../utils";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  const { isOngoing, isPast } = useMemo(() => getEventStatus(event), [event]);

  const strippedDescription = useMemo(
    () => stripHtml(event.description).result,
    [event.description],
  );

  const distance = formatDistance(
    isPast ? event.date_to : event.date_from,
    new Date(),
    { locale: pl, addSuffix: true },
  );

  return (
    <Link href={`/wydarzenie/${event.id}`} rel="dofollow">
      <article
        id={`wydarzenie-${event.id}`}
        className={clsx(
          "w-72 h-32 rounded-lg shadow-sm bg-white border border-black/5 grid grid-cols-6 p-2 hover:-translate-y-1 transition hover:shadow",
          isPast && "opacity-65",
        )}
      >
        <Image
          src={getFilePath(event.banner_small_id ?? event.banner_id)}
          className="object-cover h-full transition rounded-md col-span-2 overflow-hidden"
          alt={event.name ?? "plakat wydarzenia"}
          title={event.name ?? "plakat wydarzenia"}
          width={75}
          height={120}
        />
        <div className="h-full col-span-4 flex flex-col justify-between">
          <div className="leading-6">
            <h2 className="font-medium truncate" title={event.name}>
              {event.name}
            </h2>
            <p className="line-clamp-2 text-sm leading-4">
              {strippedDescription}
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-muted text-xs">
            <div className="flex items-center gap-1.5">
              <ClockIcon size={16} />
              <time
                dateTime={event.date_from}
                className={clsx(isOngoing && "text-red-500")}
              >
                {isOngoing ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <PingIcon /> W trakcie
                  </span>
                ) : (
                  distance
                )}
              </time>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon size={16} />
              <p>{getShortState(event.full_address?.state)}</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export { EventCard };
