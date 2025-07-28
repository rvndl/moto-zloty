import { Event } from "types/event";
import { EventList } from "./event-list";
import clsx from "clsx";
import Link from "next/link";
import { getStateAssociatedIcon, states } from "@features/event/utils";
import { DateFilters, Filters } from "../date-filters";
import { Button } from "@components/button";

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
    <div className="flex w-full gap-2 md:gap-4 flex-wrap md:flex-nowrap">
      <section className="w-full h-full col-span-1 rounded-xl md:col-span-9">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 mt-2 md:mt-4 md:flex-row md:items-end">
          <DateFilters
            filters={filters}
            isLoading={isLoading}
            onChange={(filters) => setFilters(filters)}
            showSorting
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
      <div className="mt-6 md:mt-0 bg-white rounded-lg h-min shadow-sm border p-4 w-full md:w-[26.75rem]">
        <hgroup>
          <h2 className="text-xl font-semibold">Zloty w danym województwie</h2>
          <p className="text-muted text-sm">
            Wybierz województwo, aby wyświetlić zloty w tym regionie.
          </p>
        </hgroup>
        <ol className="mt-4">
          {states.map((state) => (
            <li
              key={state}
              className={clsx("text-primary text-opacity-90 ml-0.5")}
            >
              <Link href={`/lista-wydarzen/${encodeURIComponent(state)}`}>
                <Button
                  variant={paramState === state ? "primary" : "ghost"}
                  className="capitalize w-full"
                  textAlignment="left"
                  icon={getStateAssociatedIcon(state)}
                >
                  {state}
                </Button>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export { ListPageContent };
