export interface ApiRequest<T = unknown> {
  status_code: number;
  errorMsg?: string;
  data?: T;
}

export interface MirrorResponse {
  api_msg: string;
  pic_msg: string;
}

export interface ImageListRequest {
  status_code: number;
  errorMsg?: string;
  data?: Array<string>;
  scramble_id?: string;
}
