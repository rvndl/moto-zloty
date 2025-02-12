import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventsResponse } from "../types/event";

const EVENT_CAROUSEL_QUERY = "EVENT_CAROUSEL_QUERY";

const getEventCarouselQuery = async () => {
  const response = await Api.get<EventsResponse>("/events/carousel");

  return response.data;
};

const useEventCarouselQuery = (
  options?: Partial<UseQueryOptions<EventsResponse, Error>>
) => {
  return useQuery({
    queryKey: [EVENT_CAROUSEL_QUERY],
    queryFn: () => getEventCarouselQuery(),
    ...options,
  });
};

export { useEventCarouselQuery, getEventCarouselQuery, EVENT_CAROUSEL_QUERY };
