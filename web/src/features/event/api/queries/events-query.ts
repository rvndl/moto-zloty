import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";

const EVENTS_QUERY_KEY = "EVENTS_QUERY_KEY";

interface Payload {
  date_from?: Date;
  date_to?: Date;
  sort_order?: string;
}

const events = async (payload?: Payload) => {
  const response = await Api.get<EventsResponse>("/events", {
    params: payload,
  });

  return response.data;
};

const useEventsQuery = (
  payload?: Payload,
  options?: Partial<UseQueryOptions<EventsResponse, Error>>
) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => events(payload),
    ...options,
  });
};

export { useEventsQuery, EVENTS_QUERY_KEY };
