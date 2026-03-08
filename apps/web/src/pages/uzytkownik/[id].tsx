import { ACCOUNT_QUERY_KEY, AccountDetailsPage } from "@features/account";
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
  const id = context?.params?.id;
  if (!id) {
    return { props: {} };
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [ACCOUNT_QUERY_KEY, id],
    queryFn: async () => (await api.account({ id: id as string }).get()).data,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Account({
  dehydratedState,
}: {
  dehydratedState: DehydratedState;
}) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <AccountDetailsPage />
    </HydrationBoundary>
  );
}
