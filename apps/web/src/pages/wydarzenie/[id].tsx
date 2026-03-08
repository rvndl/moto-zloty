import { DetailsPage } from "@features/event";
import { EVENT_QUERY_KEY } from "@features/event/pages/details-page";
import { EVENT_ACTIONS_QUERY_KEY } from "@features/event/components/views/details-view/body/action-list/action-list";
import { RELATED_EVENTS_QUERY_KEY } from "@features/event/components/views/details-view/body/related-events";
import { getMonthNumberFromDateStr } from "@features/event/utils";
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
  const id = context?.params?.id as string;
  if (!id) {
    return { props: {} };
  }

  const queryClient = new QueryClient();

  const eventData = await queryClient.fetchQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: async () => (await api.events({ id }).get()).data,
  });

  const dateFrom = eventData?.dateFrom;
  const monthNum = getMonthNumberFromDateStr(dateFrom);

  const eventId = eventData?.id ?? id;
  const state = eventData?.fullAddress?.state ?? "";

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [EVENT_ACTIONS_QUERY_KEY, id],
      queryFn: async () => (await api.events({ id }).actions.get()).data,
    }),
    queryClient.prefetchQuery({
      queryKey: [RELATED_EVENTS_QUERY_KEY, eventId, monthNum, state],
      queryFn: async () =>
        (
          await api
            .events({ id: eventId })
            .listRelated({ month: monthNum.toString() })({ state })
            .get()
        ).data,
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
