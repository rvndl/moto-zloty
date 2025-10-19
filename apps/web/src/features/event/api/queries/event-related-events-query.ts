import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { RelatedEventsResponse } from "../types/event";

const EVENT_RELATED_EVENTS = "EVENT_RELATED_EVENTS";

interface Payload {
  eventId: string;
  monthNum: number;
  state: string;
}

const getEventRelatedEventsQuery = async ({
  eventId,
  monthNum,
  state,
}: Payload) => {
  const response = await Api.get<RelatedEventsResponse>(
    `/events/${eventId}/list_related/${monthNum}/${state}`,
  );

  return response.data;
};

const useEventRelatedEventsQuery = (
  { eventId, monthNum, state }: Payload,
  options?: Partial<UseQueryOptions<RelatedEventsResponse, Error>>,
) => {
  return useQuery({
    queryKey: [EVENT_RELATED_EVENTS, eventId, monthNum, state],
    queryFn: () => getEventRelatedEventsQuery({ eventId, monthNum, state }),
    ...options,
  });
};

export {
  useEventRelatedEventsQuery,
  getEventRelatedEventsQuery,
  EVENT_RELATED_EVENTS,
};
