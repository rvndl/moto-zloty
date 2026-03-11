import {
  CAROUSEL_QUERY_KEY,
  MAP_QUERY_KEY,
} from "@features/event/components/views/home-view/home-view";
import { LIST_BY_STATE_QUERY_KEY } from "@features/event/components/state-list/state-overview";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { api } from "api/eden";
import { GetServerSideProps } from "next";
import { HomePage } from "@features/event";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [MAP_QUERY_KEY],
      queryFn: async () => (await api.map.get({ query: {} })).data,
    }),

    queryClient.prefetchQuery({
      queryKey: [LIST_BY_STATE_QUERY_KEY],
      queryFn: async () => (await api.events.listByState.get()).data,
    }),

    queryClient.prefetchQuery({
      queryKey: [CAROUSEL_QUERY_KEY],
      queryFn: async () => (await api.events.carousel.get()).data,
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
      <HomePage />
    </HydrationBoundary>
  );
}
