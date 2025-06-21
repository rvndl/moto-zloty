import { MapPage } from "@features/event";
import { EVENTS_QUERY_KEY, getEventsQuery } from "@features/event/api";
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
  await queryClient.prefetchQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => getEventsQuery(),
  });

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
