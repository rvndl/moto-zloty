import { useUserStore } from "@features/auth";
import axios, { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

type GetUrl =
  | "/events"
  | `/profile/${string}`
  | `/place_search/${string}`
  | `/events/${string}`
  | `/events/${string}/actions`
  | "/mod/events";

type PostUrl = "/login" | "/file";
type PutUrl = "/register" | "/events" | `/events/${string}/update-status`;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  transformResponse: (response, headers, status) => {
    if (status === 500) {
      try {
        const message = JSON.parse(response).message;
        toast.error(message);
      } catch (error) {
        toast.error("Wystąpił nieznany błąd");
      }
    }

    if (headers["content-type"] === "application/json") {
      return JSON.parse(response);
    }

    return response;
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const get = <TResponse>(url: GetUrl, config?: AxiosRequestConfig) =>
  instance.get<TResponse>(url, config);

const post = <TResponse, TData = unknown>(
  url: PostUrl,
  data?: TData,
  config?: AxiosRequestConfig
) => instance.post<TResponse>(url, data, config);

const put = <TResponse, TData = unknown>(
  url: PutUrl,
  data?: TData,
  config?: AxiosRequestConfig
) => instance.put<TResponse>(url, data, config);

const Api = {
  get,
  post,
  put,
};

export { Api };
