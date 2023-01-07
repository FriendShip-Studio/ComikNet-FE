import { defineStore } from 'pinia';
import { UserState } from './type';
import { message } from 'ant-design-vue';
import { apiPost } from '@/api';
import type { LoginForm, RegisterForm } from '@/models/form';
import type { LoginRes, RegisterRes } from '@/api/user';

const useUserStore = defineStore('user', {
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
    album_favorites_max: undefined
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    }
  },
  actions: {
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async login(loginForm: LoginForm) {
      try {
        const resp = await apiPost<LoginRes>('http://localhost:8000/login', loginForm);
        if (resp.errorMsg) {
          message.error(resp.errorMsg);
          return false;
        }
        this.setInfo(resp.data);
        this.setInfo({ isLogin: true });
        if (loginForm.remember) {
          localStorage.setItem('login_form', JSON.stringify(loginForm));
        }
        return true;

      } catch (err: any) {
        message.error(err.message);
        return false;
      }
    },
    async register(values: RegisterForm) {
      try {
        const resp = await apiPost<RegisterRes>('http://localhost:8000/register', {
          username: values.username,
          password: values.password,
          email: values.email,
          captcha: values.captcha,
          sex: values.sex
        });
        for (let msg of resp.data) {
          if (msg['type'] == 'error') {
            message.error(msg['msg']);
          } else {
            message.success(msg['msg']);
          }
        }
      } catch (err: any) {
        message.error(err.message);
      }
    },
    logout() {
      this.resetInfo();
      localStorage.removeItem('login_form');
    },
    isLogin() {
      return this.uid !== undefined;
    }
  }
});

export default useUserStore;
