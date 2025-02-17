import { AccountPage } from "@features/account";
import { ACCOUNT_QUERY_KEY, getAccountQuery } from "@features/account/api";
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
    queryKey: [ACCOUNT_QUERY_KEY, id],
    queryFn: async () => await getAccountQuery(id as string),
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
      <AccountPage />
    </HydrationBoundary>
  );
}
