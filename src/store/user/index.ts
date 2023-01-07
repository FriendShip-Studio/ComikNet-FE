import { defineStore } from "pinia";
import { UserState } from "./type";
import { message } from "ant-design-vue";
import axios from "@/api";
import type { LoginForm } from "@/models/form";

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
    async login(values: LoginForm) {
      try {
        const resp = await axios.post("http://localhost:8000/login", values);
        if (resp.data.errorMsg) {
          message.error(resp.data.errorMsg);
          return false;
        } else {
          message.success("登录成功");
          this.setInfo(resp.data);
          return true;
        }
      } catch (err: any) {
        message.error(err.message);
        return false;
      }
    },
  },
});

export default useUserStore;
