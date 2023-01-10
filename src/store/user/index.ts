import { defineStore } from "pinia";
import { UserState } from "@/models/user";
import { message } from "ant-design-vue";
import { apiPost } from "@/api";
import type {
  LoginForm,
  RegisterForm,
  LoginRes,
  RegisterRes,
} from "@/models/user";
import user from "@/api/user";

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
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async login(loginForm: LoginForm): Promise<boolean> {
      try {
        const res = await user.login(loginForm);
        this.setInfo(res.data as LoginRes);
        if (loginForm.remember) {
          localStorage.setItem("login_form", JSON.stringify(loginForm));
        }
        return true;
      } catch (err: any) {
        return false;
      }
    },
    async register(values: RegisterForm) {
      try {
        await user.register({
          username: values.username,
          password: values.password,
          email: values.email,
          captcha: values.captcha,
          sex: values.sex,
        });
        return true;
      } catch (err: any) {
        return false;
      }
    },
    logout() {
      this.resetInfo();
      localStorage.removeItem("login_form");
    },
    isLogin() {
      return this.uid !== undefined;
    },
  },
});

export default useUserStore;
