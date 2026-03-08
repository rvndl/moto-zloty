import { Page } from "@components/page";
import { api, useQuery } from "api/eden";
import { useEffect, useMemo, useState } from "react";
import {
  Filters,
  initialFiltersState,
} from "../components/shared/date-filters";
import { Metadata } from "@components/metadata";
import {
  getMonthMetadata,
  getStateMetadata,
  Month,
  State,
  getMonthNum,
} from "../utils";
import { useRouter } from "next/router";
import { BreadcrumbProps } from "@components/page/breadcrumbs";
import { ListView } from "../components";

const thisYear = new Date().getFullYear();
export const EVENTS_QUERY_KEY = "EVENTS_QUERY_KEY";

const ListPage = () => {
  const router = useRouter();
  const { params } = router.query;

  const { state, month } = useMemo(() => {
    if (!params) {
      return {};
    }

    if (Array.isArray(params)) {
      if (params.length === 1) {
        return { state: params[0] };
      } else if (params.length === 2 && params[0] === "miesiac") {
        return { month: params[1] };
      }
    }

    return {};
  }, [params]);

  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery(
    [EVENTS_QUERY_KEY, filters, state, month],
    () =>
      api.events.get({
        query: {
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
          sortOrder: filters.sortOption?.id as "Asc" | "Desc" | undefined,
          state,
          month: getMonthNum(month as Month)?.toString(),
        },
      }),
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
        <ListView
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
