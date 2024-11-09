import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";

const EVENTS_QUERY_KEY = "EVENTS_QUERY_KEY";

const events = async () => {
  const response = await Api.get<EventsResponse>("/events");

  return response.data;
};

const useEventsQuery = (
  options?: Partial<UseQueryOptions<EventsResponse, Error>>
) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => events(),
    ...options,
  });
};

export { useEventsQuery, EVENTS_QUERY_KEY };
