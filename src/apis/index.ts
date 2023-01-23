import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "ant-design-vue";
import { ApiRequest, MirrorRequest } from "@/models/requests";


const requests = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 30000,
    withCredentials: true,
    headers: {}
});

requests.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: any) => {
        console.log(error);
        return Promise.reject(error);
    }
);

requests.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (error: any) => {
        const warn = `${error.response.status} ${error.response.statusText}`;
        message.error(warn);
        return Promise.reject(warn);
    }
);

const get = (
    url: string,
    params?: any,
    config?: any
): Promise<ApiRequest> => {
    return requests.get(url, { params, ...config });
}

const post = (
    url: string,
    data?: any,
    config?: any
): Promise<ApiRequest> => {
    return requests.post(url, data, { ...config });
}

const mirror = (
    params?: any
): Promise<MirrorRequest> => {
    return requests.get("/mirror", { params });
}

export { get, post, mirror };
