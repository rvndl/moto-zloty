import { getFilePath } from "@utils/index";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Event } from "types/event";

interface Props {
  event: Event;
}

const ListItem = ({ event }: Props) => {
  const navigate = useNavigate();
  const distance = formatDistanceToNow(event.date_from, {
    locale: pl,
    addSuffix: true,
  });

  const handleOnClick = (event: Event) => {
    navigate(`/event/${event.id}`);
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
        <a
          className="w-full text-lg font-semibold leading-5 truncate cursor-pointer"
          onClick={() => handleOnClick(event)}
        >
          {event.name}
        </a>
        <p className="w-full text-xs text-gray-500 truncate">{event.address}</p>
        <p className="flex items-center w-full mt-1 text-sm truncate">
          {distance}
        </p>
      </div>
    </div>
  );
};

export { ListItem };
