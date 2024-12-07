import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";

interface Payload {
  name: string;
  email: string;
  content: string;
  recaptcha: string;
}

const contact = async (payload: Payload) => {
  const response = await Api.post<string>("/contact", payload);

  return response.data;
};

const useContactMutation = (
  options?: UseMutationOptions<string, Error, Payload, unknown>
) => {
  return useMutation({
    mutationFn: contact,
    ...options,
  });
};

export { useContactMutation };
