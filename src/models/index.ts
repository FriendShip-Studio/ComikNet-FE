export interface MyRes<T = any> {
  status_code: number;
  errorMsg: string;
  data?: T;
}