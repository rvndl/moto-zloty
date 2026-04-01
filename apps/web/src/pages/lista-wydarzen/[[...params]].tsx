import { ListPage } from "@features/event";
import {
  EVENTS_QUERY_KEY,
  EVENTS_DEFAULT_SORT,
} from "@features/event/pages/list-page";
import { getMonthNum, Month } from "@features/event/utils";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { api } from "api/eden";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params?.params || [];

  let state: string | null = null;
  let month: string | null = null;
  let year: string | null = null;

  if (params.length === 1) {
    if (/^\d{4}$/.test(params[0])) {
      year = params[0];
    } else {
      state = params[0];
    }
  } else if (params.length === 2 && params[0] === "miesiac") {
    month = params[1];
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [
      EVENTS_QUERY_KEY,
      { dateFrom: null, dateTo: null, sortOrder: EVENTS_DEFAULT_SORT },
      state,
      month,
      year,
    ],
    queryFn: async () => {
      return (
        await api.events.get({
          query: {
            sortOrder: EVENTS_DEFAULT_SORT,
            state: state ?? undefined,
            month: getMonthNum(month as Month)?.toString(),
            year: year ?? undefined,
          },
        })
      ).data;
    },
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function List({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <ListPage />
    </HydrationBoundary>
  );
}
