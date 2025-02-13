import { Tabs } from "@components";
import { useEventCarouselQuery, useEventsQuery } from "@features/event/api";
import { EventsCarousel } from "./events-carousel";
import { useEffect, useState } from "react";
import { EventsFilters, Filters, initialFiltersState } from "./events-filters";
import { match } from "ts-pattern";
import { ListTab, MapTab } from "./tabs";

type Tab = "Widok mapy" | "Widok listy";

const EventsPageContent = () => {
  const [tab, setTab] = useState<Tab>("Widok mapy");
  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    isFetching,
    refetch,
  } = useEventsQuery({
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
    sort_order: filters.sortOption?.id,
  });
  const { data: carouselEvents } = useEventCarouselQuery();

  useEffect(() => {
    if (events?.length) {
      document.dispatchEvent(new Event("pre-render"));
    }
  }, [events]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">Najbliższe wydarzenia</h3>
        <EventsCarousel events={carouselEvents} />
      </div>
      <section className="w-full h-full rounded-xl">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 mt-2 md:mt-4 md:flex-row md:items-end">
          <EventsFilters
            filters={filters}
            showSorting={tab === "Widok listy"}
            isLoading={isLoading}
            onChange={(filters) => setFilters(filters)}
          />
          <Tabs<Tab>
            tabs={["Widok mapy", "Widok listy"]}
            activeTab={tab}
            className="self-end"
            onChange={(tab) => setTab(tab)}
          />
        </div>
        <div className="w-full h-full mt-2">
          {match(tab)
            .with("Widok mapy", () => (
              <MapTab events={events} isLoading={isLoading || isFetching} />
            ))
            .with("Widok listy", () => <ListTab events={events} />)
            .otherwise(() => null)}
        </div>
      </section>
    </div>
  );
};

export { EventsPageContent };
