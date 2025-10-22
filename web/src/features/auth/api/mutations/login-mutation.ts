import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";
import { LoginResponse } from "../types/login";

interface Payload {
  username: string;
  password: string;
}

const login = async (payload: Payload) => {
  const response = await Api.post<LoginResponse>("/login", payload);

  return response.data;
};

const useLoginMutation = (
  options?: UseMutationOptions<LoginResponse, Error, Payload, unknown>
) => {
  return useMutation({
    mutationFn: login,
    ...options,
  });
};

export { useLoginMutation };
