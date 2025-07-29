import { Event } from "types/event";
import { EventList } from "./event-list";
import { DateFilters, Filters } from "../date-filters";
import { StateSelectList } from "./state-select-list";
import { MonthSelectList } from "./month-select-list";

interface Props {
  events?: Event[];
  activeItem?: string;
  isLoading?: boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const ListPageContent = ({
  events,
  activeItem,
  isLoading,
  filters,
  setFilters,
}: Props) => {
  return (
    <div className="flex w-full gap-2 md:gap-4 flex-wrap-reverse md:flex-nowrap">
      <div className="w-full md:w-[27.75rem] flex flex-col gap-4 mt-6 md:mt-0">
        <StateSelectList activeState={activeItem} />
        <MonthSelectList activeMonth={activeItem} />
      </div>
      <section className="w-full h-full col-span-1 rounded-xl md:col-span-9">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 md:flex-row md:items-end">
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
    </div>
  );
};

export { ListPageContent };
