import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "ant-design-vue";
import { ApiRequest } from "@/models/requests";

const requests = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
  withCredentials: true,
  headers: {},
});

requests.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  // eslint-disable-next-line
  (error: any) => {
    console.log(error);
    return Promise.reject(error);
  }
);

requests.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  // eslint-disable-next-line
  (err: any) => {
    console.log(err);
    let warn;
    if (err.response) {
      warn = `${err.response.status}: ${err.response.statusText}`;
    } else {
      warn = `${err.code}: ${err.message}`;
    }
    message.error(warn);
    return Promise.reject(warn);
  }
);

const get = <T = unknown>(
  url: string,
  params?: object,
  config?: object
): Promise<ApiRequest<T>> => {
  return requests.get(url, { params, ...config });
};

const post = <T = unknown>(
  url: string,
  data?: object,
  config?: object
): Promise<ApiRequest<T>> => {
  return requests.post(url, data, { ...config });
};

export { get, post };
