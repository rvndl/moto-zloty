import { EventsResponse } from "@features/event/api/types/event";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";

const EVENT_LIST_QUERY = "EVENT_LIST_QUERY";

const eventList = async () => {
  const response = await Api.get<EventsResponse>("/mod/events");

  return response.data;
};

const useEventListQuery = (
  options?: Partial<UseQueryOptions<EventsResponse, Error>>
) => {
  return useQuery({
    queryKey: [EVENT_LIST_QUERY],
    queryFn: () => eventList(),
    ...options,
  });
};

export { useEventListQuery, EVENT_LIST_QUERY };
