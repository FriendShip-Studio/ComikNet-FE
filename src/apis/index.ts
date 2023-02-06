import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "ant-design-vue";
import { ApiRequest } from "@/models/requests";

const BE_URL = "/api"

const requests = axios.create({
  baseURL: BE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {},
});

const picTestReq = axios.create({
  timeout: 15000
});

const captchaReq = axios.create({
  baseURL: BE_URL,
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
    console.log(warn);
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

export { get, post, picTestReq, captchaReq };
