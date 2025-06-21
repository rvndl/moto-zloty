import { useEventCarouselQuery, useEventsQuery } from "@features/event/api";
import { EventsCarousel } from "./events-carousel";
import { useEffect, useState } from "react";
import { EventsFilters, Filters, initialFiltersState } from "./events-filters";
import { MapTab } from "./tabs";

const MapPageContent = () => {
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
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">Najbliższe wydarzenia</h2>
        <EventsCarousel events={carouselEvents} />
      </div>
      <section className="w-full h-full rounded-xl">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 mt-2 md:mt-4 md:flex-row md:items-end">
          <EventsFilters
            filters={filters}
            isLoading={isLoading}
            onChange={(filters) => setFilters(filters)}
          />
        </div>
        <div className="w-full h-full mt-2">
          <MapTab events={events} isLoading={isLoading || isFetching} />
        </div>
      </section>
    </div>
  );
};

export { MapPageContent };
