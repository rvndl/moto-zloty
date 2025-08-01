import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";
import { getMonthNum, Month } from "@features/event/utils";

const EVENTS_QUERY_KEY = "EVENTS_QUERY_KEY";

interface Payload {
  date_from?: Date;
  date_to?: Date;
  sort_order?: string;
  state?: string | null;
  month?: string | null;
}

const getEventsQuery = async (payload?: Payload) => {
  const response = await Api.get<EventsResponse>("/events", {
    params: {
      ...payload,
      month: getMonthNum(payload?.month as Month),
    },
  });

  return response.data;
};

const useEventsQuery = (
  payload?: Payload,
  options?: Partial<UseQueryOptions<EventsResponse, Error>>,
) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY],
    queryFn: () => getEventsQuery(payload),
    ...options,
  });
};

export { useEventsQuery, getEventsQuery, EVENTS_QUERY_KEY };
