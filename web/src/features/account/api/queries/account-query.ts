import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { AccountResponse } from "../types/account";

const ACCOUNT_QUERY_KEY = "ACCOUNT_QUERY_KEY";

const account = async (id: string) => {
  const response = await Api.get<AccountResponse>(`/account/${id}`);

  return response.data;
};

const useAccountQuery = (
  id: string,
  options?: Partial<UseQueryOptions<AccountResponse, Error>>
) => {
  return useQuery({
    queryKey: [ACCOUNT_QUERY_KEY, id],
    queryFn: () => account(id),
    ...options,
  });
};

export { useAccountQuery, ACCOUNT_QUERY_KEY };
