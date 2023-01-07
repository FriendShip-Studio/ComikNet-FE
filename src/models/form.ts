export interface LoginForm {
    username: string;
    password: string;
    isRemember: boolean;
}

export interface RegisterForm {
    username: string;
    password: string;
    confirm_password: string;
    email: string;
    sex: string;
    captcha: string;
}