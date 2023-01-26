import { defineStore } from "pinia";
import type {
  UserState,
  LoginForm,
  LoginRes,
  RegisterForm,
} from "@/models/user";
import userControl from "@/apis/utils/userControl";

const useUserStore = defineStore("user", {
  state: (): UserState => ({
    uid: undefined,
    username: undefined,
    email: undefined,
    photo: undefined,
    gender: undefined,
    coin: undefined,
    album_favorites: undefined,
    level_name: undefined,
    level: undefined,
    nextLevelExp: undefined,
    exp: undefined,
    expPercent: undefined,
    album_favorites_max: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    async login(loginForm: LoginForm): Promise<boolean> {
      try {
        const res = await userControl.login(loginForm);
        this.setInfo(res.data as LoginRes);
        if (loginForm.remember) {
          localStorage.setItem("login_form", JSON.stringify(loginForm));
        }
        sessionStorage.setItem("login_form", JSON.stringify(loginForm));
        return true;
        // eslint-disable-next-line
      } catch (err: any) {
        return false;
      }
    },
    async register(values: RegisterForm): Promise<boolean> {
      try {
        return userControl.register({
          username: values.username,
          password: values.password,
          email: values.email,
          captcha: values.captcha,
          sex: values.sex,
        });
        // eslint-disable-next-line
      } catch (err: any) {
        return false;
      }
    },
    async logout() {
      await userControl.logout();
      this.$reset();
      localStorage.removeItem("login_form");
      sessionStorage.removeItem("login_form");
    },
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    isLogined(): boolean {
      return this.uid !== undefined;
    },
  },
});

export default useUserStore;
