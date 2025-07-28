import { ListPage } from "@features/event";
import { EVENTS_QUERY_KEY, getEventsQuery } from "@features/event/api";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params?.params || [];

  let state: string | null = null;
  let month: string | null = null;

  if (params.length === 1) {
    state = params[0];
  } else if (params.length === 2 && params[0] === "miesiac") {
    month = params[1];
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => getEventsQuery({ state, month }),
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
