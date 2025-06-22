import { Event } from "types/event";
import { EventList } from "./event-list";
import clsx from "clsx";
import Link from "next/link";
import { states } from "@features/event/utils";
import { DateFilters, Filters } from "../date-filters";

interface Props {
  events?: Event[];
  paramState?: string;
  isLoading?: boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const ListPageContent = ({
  events,
  paramState,
  isLoading,
  filters,
  setFilters,
}: Props) => {
  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-12 md:gap-4">
      <section className="w-full h-full col-span-1 rounded-xl md:col-span-9">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 mt-2 md:mt-4 md:flex-row md:items-end">
          <DateFilters
            filters={filters}
            isLoading={isLoading}
            onChange={(filters) => setFilters(filters)}
          />
        </div>
        <div className="w-full h-full mt-2">
          <EventList
            events={events}
            emptyRedirectTo="/lista-wydarzen"
            emptyText="Brak wydarzeń w wybranym województwie"
          />
        </div>
      </section>
      <div className="col-span-1 mt-6 md:col-span-3 md:mt-0">
        <h2 className="text-lg font-medium">Zloty w danym województwie</h2>
        <ol className="list-disc list-inside ">
          {states.map((state) => (
            <li
              key={state}
              className={clsx(
                "text-primary text-opacity-90 ml-0.5",
                paramState === state && "font-medium text-opacity-100"
              )}
            >
              <Link href={`/lista-wydarzen/${state}`}>{state}</Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export { ListPageContent };
