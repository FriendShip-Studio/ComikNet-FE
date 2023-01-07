export interface LoginRes {
  status_code: string;
  data?: {
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
    favorite_list: Array<any>,
    level_name: string;
    level: number;
    nextLevelExp: number,
    exp: string;
    expPercent: number,
    badges: Array<any>,
    album_favorites_max: number
  };
  errorMsg?: string;
}

export interface RegisterRes {
  data: Array<{
    type: string;
    msg: string;
  }>;
}