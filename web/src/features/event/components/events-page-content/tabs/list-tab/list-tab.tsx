import { useMemo } from "react";
import { Event } from "types/event";
import Logo from "@assets/img/mz-logo-black.png";
import { groupEventsByWeek } from "@utils/event";
import { ListItem } from "./list-item";
import { useRouter } from "next/navigation";

interface Props {
  events?: Event[];
}

const ListTab = ({ events }: Props) => {
  const router = useRouter();
  const groupedEvents = useMemo(() => groupEventsByWeek(events), [events]);

  if (events?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full h-full ">
        <div className="mt-24 w-96">
          <img
            className=""
            src={Logo.src}
            alt="Moto Zloty"
            onClick={() => router.push("/")}
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
          <h3 className="text-xl font-bold md:text-2xl">
            {weekRange}{" "}
            <span className="text-sm font-normal md:text-base text-muted">
              ({groupedEvents[weekRange]?.length} wydarzeń)
            </span>
          </h3>
          <div className="grid w-full grid-cols-2 gap-2 mt-2 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {groupedEvents[weekRange]?.map((event) => (
              <ListItem key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export { ListTab };
