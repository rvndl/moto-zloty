import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";
import { ChangeEventStatusReponse } from "../types/event";

interface Payload {
  id: string;
  status: string;
}

const changeEventStatus = async ({ id, status }: Payload) => {
  const response = await Api.put<ChangeEventStatusReponse>(
    `/events/${id}/update_status`,
    { status }
  );

  return response.data;
};

const useChangeEventStatusMutation = (
  options?: UseMutationOptions<
    ChangeEventStatusReponse,
    Error,
    Payload,
    unknown
  >
) => {
  return useMutation({
    mutationFn: changeEventStatus,
    ...options,
  });
};

export { useChangeEventStatusMutation };
