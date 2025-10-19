import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";
import { RegisterResponse } from "../types/register";

interface Payload {
  username: string;
  password: string;
  email: string;
}

const register = async (payload: Payload) => {
  const response = await Api.put<RegisterResponse>("/register", payload);

  return response.data;
};

const useRegisterMutation = (
  options?: UseMutationOptions<RegisterResponse, Error, Payload, unknown>
) => {
  return useMutation({
    mutationFn: register,
    ...options,
  });
};

export { useRegisterMutation };
