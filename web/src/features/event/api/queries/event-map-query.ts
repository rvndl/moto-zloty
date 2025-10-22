import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";

const EVENT_MAP_QUERY_KEY = "EVENT_MAP_QUERY_KEY";

interface Payload {
  date_from?: Date;
  date_to?: Date;
}

const getMapQuery = async (payload?: Payload) => {
  const response = await Api.get<EventsResponse>("/map", {
    params: payload,
  });

  return response.data;
};

const useMapQuery = (
  payload?: Payload,
  options?: Partial<UseQueryOptions<EventsResponse, Error>>,
) => {
  return useQuery({
    queryKey: [EVENT_MAP_QUERY_KEY],
    queryFn: () => getMapQuery(payload),
    ...options,
  });
};

export { useMapQuery, getMapQuery, EVENT_MAP_QUERY_KEY };
