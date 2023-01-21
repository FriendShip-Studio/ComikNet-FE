import { apiGet, apiPost } from "@/api/index";
import { MyRes } from "@/models";
import type {
  LoginForm,
  LoginRes,
  RegisterForm,
  RegisterReq,
  RegisterRes,
} from "@/models/user";
import { message } from "ant-design-vue";

const login = async (loginForm: LoginForm): Promise<MyRes<LoginRes>> => {
  const res = await apiPost("/login", loginForm);
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res;
};

const register = async (registerReq: RegisterReq): Promise<boolean> => {
  const res = await apiPost("/register", registerReq);
  let flag = false;
  for (let msg of res.data) {
    if (msg["type"] == "error") {
      message.error(msg["msg"]);
    } else {
      message.success(msg["msg"]);
      flag = true;
    }
  }
  if (!flag) {
    return Promise.reject(false);
  }
  return flag;
};

const logout = async () => {
  const res = await apiGet("/logout");
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
}

const getHistory = async (page: number) => {
  const res = await apiGet("/history", { page });
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res;
}

export default {
  login,
  register,
  logout,
  getHistory
};
