import { Page } from "@components/page";
import { useEventsQuery } from "../api";
import { useEffect, useState } from "react";
import { Filters, initialFiltersState } from "../components/date-filters";
import { useParams } from "next/navigation";
import { Metadata } from "@components/metadata";
import { ListPageContent } from "../components/list-page-content";

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
        <ListPageContent
          events={events}
          paramState={paramState}
          isLoading={isLoading}
          filters={filters}
          setFilters={setFilters}
        />
      </Page>
    </>
  );
};

export { ListPage };
