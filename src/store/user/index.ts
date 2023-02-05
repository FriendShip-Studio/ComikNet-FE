import { defineStore } from "pinia";
import type {
  UserState,
  LoginForm,
  LoginRes,
  RegisterForm,
} from "@/models/user";
import userControl from "@/apis/utils/userControl";
import pinia from "@/store/index";

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
    badges: Array()
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
        console.log(res.data);
        console.log(this.userInfo)
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
    async update(): Promise<boolean> {
      if (!sessionStorage.login_form && !localStorage.login_form) {
        return false;
      }

      if (sessionStorage.login_form) {
        try {
          const loginForm = JSON.parse(sessionStorage.login_form);
          if (await this.login(loginForm)) {
            console.log("Login from sessionStorage success");
            return true;
          } else {
            return false;
          }
          // eslint-disable-next-line
        } catch (err: any) {
          return false;
        }
      }

      if (localStorage.login_form) {
        console.log("Login from localStorage");
        try {
          const loginForm = JSON.parse(localStorage.login_form);
          if (await this.login(loginForm)) {
            console.log("Login from localStorage success");
            return true;
          } else {
            return false;
          }
          // eslint-disable-next-line
        } catch (err: any) {
          return false;
        }
      }
      
      return false;
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
      sessionStorage.removeItem("user_store");
    },
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    isLogined(): boolean {
      return this.uid !== undefined;
    },
  },
});

const watchDog = useUserStore(pinia);

watchDog.$subscribe((_, state) => {
  sessionStorage.setItem("user_store", JSON.stringify(state));
});

if (sessionStorage.getItem("user_store") !== null) {
  try {
    watchDog.$state = JSON.parse(sessionStorage.getItem("user_store") as string);
  } catch (e) {
    console.error(e);
    sessionStorage.removeItem("user_store");
  }
}

export default useUserStore;
