import { useMutation } from "@tanstack/react-query";
import { Api } from "api";
import { RegisterResponse } from "../types/register";

interface Payload {
  username: string;
  password: string;
  email: string;
}

const register = async ({ username, password, email }: Payload) => {
  const response = await Api.put<RegisterResponse>("/register", {
    username,
    password,
    email,
  });

  return response.data;
};

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  });
};

export { useRegisterMutation };
