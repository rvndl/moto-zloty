import axios, { AxiosRequestConfig } from "axios";

type GetUrl = "/events";
type PostUrl = "/login";
type PutUrl = "/register";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

instance.interceptors.response.use((res) => {
  return res;
});

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
