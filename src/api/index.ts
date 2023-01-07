import type { AxiosRequestConfig } from 'axios';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';


if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const apiGet = (path: string, params?: object, config?: object) => {
  return axios.get(path, { params, ...config });
};

export const apiPost = <T = unknown>(
  path: string,
  data?: object,
  config?: object
) => {
  return axios.post<T>(path, data, config);
};
