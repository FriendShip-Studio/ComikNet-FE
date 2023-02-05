import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { message } from "ant-design-vue";
import { HistoryRecord, Comment } from "@/models/database";

const requests = axios.create({
    baseURL: "http://localhost:8080",
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

const recordHistory = (uid: string, aid: string, cid: string) => {
    return requests.post(`/record?uid=${uid}&aid=${aid}&cid=${cid}`);
};

const getAlbumHistory = (aid: string): Promise<HistoryRecord | null> => {
    return requests.get(`/history/album?aid=${aid}`);
}

const getUserHistory = (uid: string): Promise<HistoryRecord[]> => {
    return requests.get(`/history/user?uid=${uid}`);
}

const sendComment = (uid: string, aid: string, comment: string) => {
    return requests.post(`/comment?uid=${uid}&aid=${aid}&comment=${comment}`);
}

const getComments = (aid?: string, uid?: string): Promise<Comment[] | null> => {
    if (!aid) {
        return requests.get(`/comments?uid=${uid}`);
    } else {
        return requests.get(`/comments?aid=${aid}`);
    }
}

export default {
    recordHistory,
    getAlbumHistory,
    getUserHistory,
    sendComment,
    getComments
}
