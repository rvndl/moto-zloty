import { Page } from "@components/page";
import { useEventsQuery } from "../api";
import { useEffect, useMemo, useState } from "react";
import { Filters, initialFiltersState } from "../components/date-filters";
import { Metadata } from "@components/metadata";
import { ListPageContent } from "../components/list-page-content";
import { getMonthMetadata, getStateMetadata, Month, State } from "../utils";
import { useRouter } from "next/router";
import { BreadcrumbProps } from "@components/page/breadcrumbs";

const thisYear = new Date().getFullYear();

const ListPage = () => {
  const router = useRouter();
  const { params } = router.query;

  const { state, month } = useMemo(() => {
    if (!params) return { state: undefined, month: undefined };

    if (Array.isArray(params)) {
      if (params.length === 1) {
        return { state: params[0], month: undefined };
      } else if (params.length === 2 && params[0] === "miesiac") {
        return { state: undefined, month: params[1] };
      }
    }

    return { state: undefined, month: undefined };
  }, [params]);

  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    refetch,
  } = useEventsQuery(
    {
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      sort_order: filters.sortOption?.id,
      state,
      month,
    },
    { enabled: router.isReady },
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, state, month]);

  const metadata = month
    ? getMonthMetadata(month as Month)
    : getStateMetadata(state as State);

  const cannonical = month
    ? `https://motozloty.pl/lista-wydarzen/miesiac/${month}`
    : `https://motozloty.pl/lista-wydarzen/${state ?? ""}`;

  const activeBreadcrumb: BreadcrumbProps = month
    ? {
        label: `${month as string} ${thisYear}`,
        to: `/lista-wydarzen/miesiac/${month}`,
        isActive: true,
      }
    : {
        label: state as string,
        to: `/lista-wydarzen/${state}`,
        isActive: true,
      };

  return (
    <>
      <Metadata
        title={metadata.title}
        description={metadata.description}
        canonical={cannonical}
      />
      <Page
        title={metadata.pageTitle}
        breadcrumbs={[
          {
            label: "Lista wydarzeń",
            to: "/lista-wydarzen",
            isActive: !state && !month,
          },
          ...(state || month ? [activeBreadcrumb] : []),
        ]}
      >
        <ListPageContent
          events={events}
          activeItem={state || month}
          isLoading={isLoading}
          filters={filters}
          setFilters={setFilters}
        />
      </Page>
    </>
  );
};

export { ListPage };
