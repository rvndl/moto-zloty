import { DetailsPage } from "@features/event";
import {
  EVENT_ACTIONS_QUERY,
  EVENT_QUERY_KEY,
  EVENT_RELATED_EVENTS,
  getEventActionsQuery,
  getEventQuery,
  getEventRelatedEventsQuery,
} from "@features/event/api";
import { getMonthNumberFromDateStr } from "@features/event/utils";
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

  const eventData = await queryClient.fetchQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: async () => await getEventQuery(id),
  });

  const monthNum = getMonthNumberFromDateStr(eventData?.date_from);
  const eventId = eventData.id;
  const state = eventData.full_address?.state ?? "";

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [EVENT_QUERY_KEY, id],
      queryFn: async () => await getEventQuery(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [EVENT_ACTIONS_QUERY, id],
      queryFn: async () => await getEventActionsQuery(id),
    }),
    queryClient.prefetchQuery({
      queryKey: [EVENT_RELATED_EVENTS, eventId, monthNum, state],
      queryFn: async () =>
        await getEventRelatedEventsQuery({
          eventId,
          monthNum,
          state,
        }),
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
