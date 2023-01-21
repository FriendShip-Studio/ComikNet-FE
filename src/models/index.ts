export interface MyRes<T = any> {
  status_code: number;
  errorMsg?: string;
  data?: T;
}

export interface PicRes<T = any> {
  status_code: number;
  errorMsg?: string;
  data?: T;
  scramble_id: string;
}