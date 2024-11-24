import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { Api } from "api";

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await Api.patch<string>("/profile/change_password", payload);

  return response.data;
};

const useChangePasswordMutation = (
  options?: UseMutationOptions<string, Error, ChangePasswordPayload, unknown>
) => {
  return useMutation({
    mutationFn: changePassword,
    ...options,
  });
};

export { useChangePasswordMutation, type ChangePasswordPayload };
