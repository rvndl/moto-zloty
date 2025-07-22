import { makeAddressString } from "@features/event/utils";
import { getFilePath } from "@utils/index";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event } from "types/event";

interface Props {
  event: Event;
}

const EventCard = ({ event }: Props) => {
  const router = useRouter();
  const distance = formatDistanceToNow(event.date_from, {
    locale: pl,
    addSuffix: true,
  });

  const handleOnClick = (event: Event) => {
    router.push(`/wydarzenie/${event.id}`);
  };

  return (
    <article
      id={`wydarzenie-${event.id}`}
      key={event.id}
      className="flex flex-col transition-transform bg-white rounded-lg shadow aspect-video hover:-translate-y-1"
    >
      <Image
        src={getFilePath(event.banner_small_id ?? event.banner_id)}
        className="object-cover w-full h-full transition rounded-md cursor-pointer z-200"
        alt={event.name}
        title={event.name}
        onClick={() => handleOnClick(event)}
        width={300}
        height={200}
      />
      <div className="flex flex-col p-2">
        <h3 className="truncate">
          <Link
            href={`/wydarzenie/${event.id}`}
            className="w-full text-base font-semibold leading-5 cursor-pointer md:text-lg"
            onClick={() => handleOnClick(event)}
          >
            {event.name}
          </Link>
        </h3>
        <p className="w-full text-xs text-gray-500 truncate">
          {makeAddressString(event.full_address)}
        </p>
        <p className="flex items-center w-full mt-1 text-xs truncate md:text-sm">
          {distance}
        </p>
      </div>
    </article>
  );
};

export { EventCard };
