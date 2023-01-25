export interface ApiRequest<T = any> {
    status_code: number;
    errorMsg?: string;
    data?: T;
}

export interface MirrorRequest {
    api_msg: string;
    pic_msg: string;
}

export interface ImageListRequest {
    status_code: number;
    errorMsg?: string;
    data?: Array<string>;
    scramble_id?: string;
}