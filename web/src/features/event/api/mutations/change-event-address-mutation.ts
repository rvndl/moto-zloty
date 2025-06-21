import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";
import { ChangeEventAddressResponse } from "../types/event";
import { Address } from "types/address";

interface Payload {
  id: string;
  address: Address;
  lat: number;
  lon: number;
}

const changeEventAddress = async ({ id, address, lat, lon }: Payload) => {
  const response = await Api.patch<ChangeEventAddressResponse>(
    `/events/${id}/update_address`,
    { address, lat, lon }
  );

  return response.data;
};

const useChangeEventAddressMutation = (
  options?: UseMutationOptions<
    ChangeEventAddressResponse,
    Error,
    Payload,
    unknown
  >
) => {
  return useMutation({
    mutationFn: changeEventAddress,
    ...options,
  });
};

export { useChangeEventAddressMutation };
