import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";

const EVENT_LIST_BY_STATE_QUERY_KEY = "EVENT_LIST_BY_STATE_QUERY_KEY";

const getEventListByStateQuery = async () => {
  const response = await Api.get<EventsResponse>("/events/list_by_state");
  return response.data;
};

const useEventListByStateQuery = (
  options?: Partial<UseQueryOptions<EventsResponse, Error>>,
) => {
  return useQuery({
    queryKey: [EVENT_LIST_BY_STATE_QUERY_KEY],
    queryFn: () => getEventListByStateQuery(),
    ...options,
  });
};

export {
  useEventListByStateQuery,
  getEventListByStateQuery,
  EVENT_LIST_BY_STATE_QUERY_KEY,
};
