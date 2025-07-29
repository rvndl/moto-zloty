import { useEventCarouselQuery, useMapQuery } from "@features/event/api";
import { EventsCarousel } from "./events-carousel";
import { useEffect, useState } from "react";
import { DateFilters, Filters, initialFiltersState } from "../date-filters";
import { EventMap } from "./event-map/map";

const MapPageContent = () => {
  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    isFetching,
    refetch,
  } = useMapQuery({
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
  });
  const { data: carouselEvents } = useEventCarouselQuery();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-lg">Najbliższe wydarzenia</h2>
        <EventsCarousel events={carouselEvents} />
      </div>
      <section className="w-full h-full rounded-xl">
        <div className="flex flex-col-reverse items-start justify-between w-full gap-2 md:flex-row md:items-end">
          <DateFilters
            filters={filters}
            isLoading={isLoading}
            onChange={(filters) => setFilters(filters)}
          />
        </div>
        <div className="w-full h-full mt-2">
          <EventMap events={events} isLoading={isLoading || isFetching} />
        </div>
      </section>
    </div>
  );
};

export { MapPageContent };
