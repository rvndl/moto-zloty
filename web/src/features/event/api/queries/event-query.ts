import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventResponse } from "../types/event";

const EVENT_QUERY_KEY = "EVENT_QUERY_KEY";

const getEventQuery = async (id: string) => {
  const response = await Api.get<EventResponse>(`/events/${id}`);

  return response.data;
};

const useEventQuery = (
  id: string,
  options?: Partial<UseQueryOptions<EventResponse, Error>>
) => {
  return useQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: () => getEventQuery(id),
    ...options,
  });
};

export { useEventQuery, getEventQuery, EVENT_QUERY_KEY };
