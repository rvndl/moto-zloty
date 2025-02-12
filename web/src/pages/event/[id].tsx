import { EventPage } from "@features/event";
import { EVENT_QUERY_KEY, getEventQuery } from "@features/event/api";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.id;
  if (!id) {
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: async () => await getEventQuery(id as string),
  });

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
      <EventPage />
    </HydrationBoundary>
  );
}
