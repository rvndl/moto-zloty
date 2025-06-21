import { Page } from "@components/page";
import { ListTab } from "../components/map-view/tabs";
import { useEventsQuery } from "../api";
import { useEffect, useState } from "react";
import {
  EventsFilters,
  Filters,
  initialFiltersState,
} from "../components/map-view/events-filters";
import { states } from "../utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { Metadata } from "@components/metadata";

const ListPage = () => {
  const params = useParams();
  const paramState = params?.params?.[0];
  const title = !paramState
    ? "Zloty motocyklowe w całej Polsce"
    : `Zloty motocyklowe w ${paramState}`;

  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    refetch,
  } = useEventsQuery({
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
    sort_order: filters.sortOption?.id,
    state: paramState,
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paramState]);

  return (
    <>
      <Metadata
        title={title}
        description={`Zloty motocyklowe w ${
          paramState || "całej Polsce"
        }. Sprawdź listę wydarzeń motocyklowych, które odbywają się w Twoim regionie.`}
        canonical={`https://motozloty.pl/lista-wydarzen/${paramState || ""}`}
      />
      <Page
        title={title}
        breadcrumbs={[
          {
            label: "Lista wydarzeń",
            to: "/lista-wydarzen",
            isActive: !paramState,
          },
          ...(paramState
            ? [
                {
                  label: paramState,
                  to: `/lista-wydarzen/${paramState}`,
                  isActive: true,
                },
              ]
            : []),
        ]}
      >
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-12 md:gap-4">
          <section className="w-full h-full col-span-1 rounded-xl md:col-span-9">
            <div className="flex flex-col-reverse items-start justify-between w-full gap-2 mt-2 md:mt-4 md:flex-row md:items-end">
              <EventsFilters
                filters={filters}
                isLoading={isLoading}
                onChange={(filters) => setFilters(filters)}
              />
            </div>
            <div className="w-full h-full mt-2">
              <ListTab
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
      </Page>
    </>
  );
};

export { ListPage };
