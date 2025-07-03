import { MapPage } from "@features/event";
import {
  EVENT_LIST_BY_STATE_QUERY_KEY,
  EVENTS_QUERY_KEY,
  getEventListByStateQuery,
  getEventsQuery,
} from "@features/event/api";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [EVENTS_QUERY_KEY],
      queryFn: () => getEventsQuery(),
    }),
    queryClient.prefetchQuery({
      queryKey: [EVENT_LIST_BY_STATE_QUERY_KEY],
      queryFn: () => getEventListByStateQuery(),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Index({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <MapPage />
    </HydrationBoundary>
  );
}
