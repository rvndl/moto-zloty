import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { EventAction } from "../types/event-action";

const EVENT_ACTIONS_QUERY = "EVENT_ACTIONS_QUERY";

const eventActions = async (id: string) => {
  const response = await Api.get<EventAction[]>(`/events/${id}/actions`);

  return response.data;
};

const useEventActionsQuery = (
  id: string,
  options?: Partial<UseQueryOptions<EventAction[], Error>>
) => {
  return useQuery({
    queryKey: [EVENT_ACTIONS_QUERY, id],
    queryFn: () => eventActions(id),
    ...options,
  });
};

export { useEventActionsQuery, EVENT_ACTIONS_QUERY };
