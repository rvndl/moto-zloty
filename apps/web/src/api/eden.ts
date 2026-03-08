import { Treaty, treaty } from "@elysiajs/eden";
import {
  type QueryKey,
  type UseQueryOptions,
  useQuery as useTanstackQuery,
  type UseMutationOptions,
  useMutation as useTanstackMutation,
} from "@tanstack/react-query";
import { useUserStore } from "@features/auth";
import toast from "react-hot-toast";
import { App } from "api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferBody<T extends (...args: any[]) => any> =
  Parameters<T>[0] extends { body: infer B } ? B : Parameters<T>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferResponse<T extends (...args: any[]) => any> = Treaty.Data<
  Awaited<ReturnType<T>>
>;

const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL ?? "localhost:3000", {
  fetch: {
    credentials: "include",
    mode: "cors",
  },
  parseDate: false,
  headers: () => {
    const userStore = useUserStore.getState();
    const token = userStore.user.token;
    if (!token) {
      return {};
    }

    return { Authorization: `Bearer ${token}` };
  },
  onResponse: async (response) => {
    if (response.status === 401) {
      const userStore = useUserStore.getState();
      userStore.logout();

      toast.success("Twoja sesja wygasła. Zaloguj się ponownie.");
    }

    if (response.status === 500) {
      try {
        const data = await response.clone().json();
        if (data?.message) {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error parsing 500 response:", error);
        toast.error("Wystąpił nieznany błąd");
      }
    }
  },
});

function useQuery<T extends Record<number, unknown> = Record<number, unknown>>(
  queryKey: QueryKey,
  treatyFn: () => Promise<Treaty.TreatyResponse<T>>,
  options?: Omit<
    UseQueryOptions<
      Treaty.Data<Treaty.TreatyResponse<T>>,
      Treaty.Error<Treaty.TreatyResponse<T>>
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useTanstackQuery<
    Treaty.Data<Treaty.TreatyResponse<T>>,
    Treaty.Error<Treaty.TreatyResponse<T>>
  >({
    queryKey,
    queryFn: async () => {
      const response = await treatyFn();
      if (response.error) {
        throw response.error;
      }

      if (response.data !== undefined) {
        return response.data as Treaty.Data<Treaty.TreatyResponse<T>>;
      }

      throw new Error("No data returned from API");
    },
    ...options,
  });
}

function useMutation<
  TFn extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
  ) => Promise<Treaty.TreatyResponse<Record<number, unknown>>>,
>(
  treatyFn: TFn,
  options?: Omit<
    UseMutationOptions<
      Treaty.Data<Awaited<ReturnType<TFn>>>,
      Treaty.Error<Awaited<ReturnType<TFn>>>,
      Parameters<TFn>[0]
    >,
    "mutationFn"
  >,
) {
  return useTanstackMutation<
    Treaty.Data<Awaited<ReturnType<TFn>>>,
    Treaty.Error<Awaited<ReturnType<TFn>>>,
    Parameters<TFn>[0]
  >({
    mutationFn: async (variables) => {
      const response = await treatyFn(variables);

      if (response.error) {
        throw response.error;
      }

      if (response.data !== undefined) {
        return response.data as Treaty.Data<Awaited<ReturnType<TFn>>>;
      }

      throw new Error("No data returned from API");
    },
    ...options,
  });
}

export { api, useQuery, useMutation };
