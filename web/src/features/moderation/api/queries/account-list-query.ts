import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { AccountWithoutPassword } from "types/account";

const ACCOUNT_LIST_QUERY = "ACCOUNT_LIST_QUERY";

const accountList = async () => {
  const response = await Api.get<AccountWithoutPassword[]>("/mod/accounts");

  return response.data;
};

const useAccountListQuery = (
  options?: Partial<UseQueryOptions<AccountWithoutPassword[], Error>>
) => {
  return useQuery({
    queryKey: [ACCOUNT_LIST_QUERY],
    queryFn: () => accountList(),
    ...options,
  });
};

export { useAccountListQuery, ACCOUNT_LIST_QUERY };
