export interface ApiRequest<T = any> {
    status_code: number;
    errorMsg?: string;
    data?: T;
}

export interface MirrorRequest {
    api_msg: string;
    pic_msg: string;
}