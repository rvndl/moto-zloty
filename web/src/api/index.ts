import { useUserStore } from "@features/auth";
import axios, { AxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

type GetUrl =
  | "/map"
  | "/events"
  | "/events/carousel"
  | `/events/search/${string}`
  | `/account/${string}`
  | `/place_search/${string}`
  | `/events/${string}`
  | `/events/${string}/actions`
  | "/events/list_by_state"
  | "/sitemap_events"
  | "/mod/events"
  | "/mod/accounts"
  | `/mod/banner_scrap/${string}`;

type PostUrl = "/login" | "/file" | "/contact";
type PutUrl = "/register" | "/events" | `/events/${string}/update_status`;
type PatchUrl = "/account/change_password" | `/events/${string}/update_address`;

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  transformResponse: (response, headers, status) => {
    if (status === 401) {
      handleStatus401();
    }
    if (status === 500) {
      handleStatus500(response);
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
  (error) => Promise.reject(error),
);

const get = <TResponse>(url: GetUrl, config?: AxiosRequestConfig) =>
  instance.get<TResponse>(url, config);

const post = <TResponse, TData = unknown>(
  url: PostUrl,
  data?: TData,
  config?: AxiosRequestConfig,
) => instance.post<TResponse>(url, data, config);

const put = <TResponse, TData = unknown>(
  url: PutUrl,
  data?: TData,
  config?: AxiosRequestConfig,
) => instance.put<TResponse>(url, data, config);

const patch = <TResponse, TData = unknown>(
  url: PatchUrl,
  data?: TData,
  config?: AxiosRequestConfig,
) => instance.patch<TResponse>(url, data, config);

const Api = {
  get,
  post,
  put,
  patch,
};

const handleStatus500 = (response: string) => {
  try {
    const message = JSON.parse(response).message;
    toast.error(message);
  } catch (error) {
    toast.error("Wystąpił nieznany błąd");
  }
};

const handleStatus401 = () => {
  toast.success("Twoja sesja wygasła. Zaloguj się ponownie.");
  useUserStore.getState().logout();
};

export { Api };
