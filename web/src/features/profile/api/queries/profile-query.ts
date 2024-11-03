import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { ProfileResponse } from "../types/profile";

const PROFILE_QUERY_KEY = "PROFILE_QUERY_KEY";

const profile = async (id: number) => {
  const response = await Api.get<ProfileResponse>(`/profile/${id}`);

  return response.data;
};

const useProfileQuery = (
  id: number,
  options?: Partial<UseQueryOptions<ProfileResponse, Error, number>>
) => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY, id],
    queryFn: () => profile(id),
    ...options,
  });
};

export { useProfileQuery, PROFILE_QUERY_KEY };
