import { DetailsPage } from "@features/event";
import {
  EVENT_ACTIONS_QUERY,
  EVENT_QUERY_KEY,
  getEventActionsQuery,
  getEventQuery,
} from "@features/event/api";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id as string;
  if (!id) {
    return { props: {} };
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [EVENT_QUERY_KEY, id],
      queryFn: async () => await getEventQuery(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [EVENT_ACTIONS_QUERY, id],
      queryFn: async () => await getEventActionsQuery(id),
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Event({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <DetailsPage />
    </HydrationBoundary>
  );
}
