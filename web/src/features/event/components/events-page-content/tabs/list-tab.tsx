import { getFilePath } from "@utils/index";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "types/event";
import Logo from "@assets/img/mz-logo-black.png";
import { groupEventsByWeek } from "@utils/event";

interface Props {
  events?: Event[];
}

const ListTab = ({ events }: Props) => {
  const navigate = useNavigate();
  const groupedEvents = useMemo(() => groupEventsByWeek(events), [events]);

  const handleOnClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  if (events?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full h-full ">
        <div className="mt-24 w-96">
          <img
            className=""
            src={Logo}
            alt="Moto Zloty"
            onClick={() => navigate("/")}
          />
          <div className="mt-6 leading-5">
            <h3 className="text-2xl font-bold">Brak wydarzeń</h3>
            <p className="font-medium text-muted">
              Dostosuj filtry, aby wyszukać inne wydarzenia
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {Object.keys(groupedEvents)?.map((weekRange) => (
        <section key={weekRange}>
          <h3 className="text-2xl font-bold">
            {weekRange}{" "}
            <span className="text-base font-normal text-muted">
              ({groupedEvents[weekRange]?.length} wydarzeń)
            </span>
          </h3>
          <div className="grid w-full grid-cols-2 gap-4 mt-2 md:grid-cols-3 lg:grid-cols-4">
            {groupedEvents[weekRange]?.map((event) => (
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
                  <p className="w-full text-xs text-gray-500 truncate">
                    {event.address}
                  </p>
                  <p className="flex items-center w-full mt-1 text-sm truncate">
                    {formatDistanceToNow(event.date_from, {
                      locale: pl,
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export { ListTab };
