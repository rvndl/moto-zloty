import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";
import { CreateEventResponse } from "../types/event";
import { Address } from "types/address";

interface Payload {
  name: string;
  description?: string;
  address: Address;
  lat: number;
  lon: number;
  date_from: string;
  date_to: string;
  account_id: string;
  banner_id?: string;
  banner_small_id?: string;
}

const createEvent = async (payload: Payload) => {
  const response = await Api.put<CreateEventResponse>("/events", payload);

  return response.data;
};

const useCreateEventMutation = (
  options?: UseMutationOptions<CreateEventResponse, Error, Payload, unknown>
) => {
  return useMutation({
    mutationFn: createEvent,
    ...options,
  });
};

export { useCreateEventMutation };
