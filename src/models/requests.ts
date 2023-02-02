export interface ApiRequest<T = unknown> {
  status_code: number;
  errorMsg?: string;
  data?: T;
}

export interface MirrorResponse {
  api_msg: string;
  pic_msg: string;
}

