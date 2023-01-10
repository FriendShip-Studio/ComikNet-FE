export interface LoginRes {
  uid: string;
  username: string;
  email: string;
  emailverified: string;
  photo: string;
  fname: string;
  gender: string;
  message: string;
  coin: number;
  album_favorites: number;
  s: string;
  favorite_list: Array<any>;
  level_name: string;
  level: number;
  nextLevelExp: number;
  exp: string;
  expPercent: number;
  badges: Array<any>;
  album_favorites_max: number;
}

export interface RegisterRes {
  type: string;
  msg: string;
}

export interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  sex: string;
  captcha: string;
}

export interface RegisterReq {
  username: string;
  password: string;
  email: string;
  sex: string;
  captcha: string;
}

export interface UserState {
  uid?: string;
  username?: string;
  email?: string;
  photo?: string;
  gender?: string;
  coin?: number;
  album_favorites?: number;
  level_name?: string;
  level?: number;
  nextLevelExp?: number;
  exp?: string;
  expPercent?: number;
  album_favorites_max?: number;
}
