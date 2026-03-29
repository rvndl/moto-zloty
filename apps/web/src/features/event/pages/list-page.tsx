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

const getYearMetadata = (year?: string) => {
  if (!year) {
    return getStateMetadata();
  }

  return {
    title: `Zloty motocyklowe w Polsce – katalog ${year}`,
    pageTitle: `Lista wydarzeń ${year}`,
    description: `Archiwum zlotów motocyklowych z ${year} roku. Sprawdź terminy, lokalizacje i opisy wydarzeń z całej Polski.`,
  };
};

const ListPage = () => {
  const router = useRouter();
  const { params } = router.query;
  const yearFromQuery = Array.isArray(router.query.year)
    ? router.query.year[0]
    : router.query.year;

  const { state, month, year } = useMemo(() => {
    if (!params) {
      return { year: yearFromQuery };
    }

    if (Array.isArray(params)) {
      if (params.length === 1) {
        if (/^\d{4}$/.test(params[0])) {
          return { year: params[0] };
        }

        return { state: params[0], year: yearFromQuery };
      } else if (params.length === 2 && params[0] === "miesiac") {
        return { month: params[1], year: yearFromQuery };
      }
    }

    return { year: yearFromQuery };
  }, [params, yearFromQuery]);

  const [filters, setFilters] = useState<Filters>(initialFiltersState);
  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery(
    [EVENTS_QUERY_KEY, filters, state, month, year],
    () =>
      api.events.get({
        query: {
          dateFrom: filters.dateFrom?.toISOString(),
          dateTo: filters.dateTo?.toISOString(),
          sortOrder: filters.sortOption?.id as "Asc" | "Desc" | undefined,
          state,
          month: getMonthNum(month as Month)?.toString(),
          year,
        },
      }),
    { enabled: router.isReady },
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, state, month, year]);

  const metadata = month
    ? getMonthMetadata(month as Month)
    : year && !state
      ? getYearMetadata(year)
      : getStateMetadata(state as State);

  const cannonical = month
    ? `https://moto-zloty.pl/lista-wydarzen/miesiac/${month}`
    : year && !state
      ? `https://moto-zloty.pl/lista-wydarzen/${year}`
      : `https://moto-zloty.pl/lista-wydarzen/${state ?? ""}`;

  const activeBreadcrumb: BreadcrumbProps | null = month
    ? {
        label: `${month as string} ${thisYear}`,
        to: `/lista-wydarzen/miesiac/${month}`,
        isActive: true,
      }
    : year && !state
      ? {
          label: `Lista wydarzeń ${year}`,
          to: `/lista-wydarzen/${year}`,
          isActive: true,
        }
      : state
        ? {
            label: state,
            to: `/lista-wydarzen/${state}`,
            isActive: true,
          }
        : null;

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
            isActive: !state && !month && !year,
          },
          ...(activeBreadcrumb ? [activeBreadcrumb] : []),
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
