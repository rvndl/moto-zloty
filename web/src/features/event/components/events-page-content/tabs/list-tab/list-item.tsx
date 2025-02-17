import { getFilePath } from "@utils/index";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Event } from "types/event";

interface Props {
  event: Event;
}

const ListItem = ({ event }: Props) => {
  const router = useRouter();
  const distance = formatDistanceToNow(event.date_from, {
    locale: pl,
    addSuffix: true,
  });

  const handleOnClick = (event: Event) => {
    router.push(`/event/${event.id}`);
  };

  return (
    <div
      key={event.id}
      className="flex flex-col transition-transform rounded-lg shadow aspect-video bg-accent hover:-translate-y-1"
    >
      <img
        src={getFilePath(event.banner_small_id ?? event.banner_id)}
        className="object-cover w-full h-full transition rounded-md cursor-pointer z-200"
        alt="banner"
        onClick={() => handleOnClick(event)}
      />
      <div className="flex flex-col p-2">
        <Link
          href={`/event/${event.id}`}
          className="w-full text-base font-semibold leading-5 truncate cursor-pointer md:text-lg"
          onClick={() => handleOnClick(event)}
        >
          {event.name}
        </Link>
        <p className="w-full text-xs text-gray-500 truncate">{event.address}</p>
        <p className="flex items-center w-full mt-1 text-xs truncate md:text-sm">
          {distance}
        </p>
      </div>
    </div>
  );
};

export { ListItem };
