import { get, post } from "@/apis/index";
import { LoginForm, LoginRes, RegisterReq, RegisterTip } from "@/models/user";
import { ApiRequest } from "@/models/requests";
import { message } from "ant-design-vue";

const login = async (loginForm: LoginForm): Promise<ApiRequest<LoginRes>> => {
  const res = await post<LoginRes>("/login", loginForm);
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res;
};

const register = async (registerReq: RegisterReq): Promise<boolean> => {
  const res = await post<Array<RegisterTip>>("/register", registerReq);
  let flag = false;
  if (res.data) {
    for (const msg of res.data) {
      if (msg["type"] == "error") {
        message.error(msg["msg"]);
      } else {
        message.success(msg["msg"]);
        flag = true;
      }
    }
  } else {
    message.error(res.errorMsg);
  }
  if (!flag) {
    return Promise.reject(false);
  }
  return flag;
};

const logout = async () => {
  const res = await get("/logout");
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
};

const getFavor = async (page = 1) => {
  const res = await get("/favorite", { page });
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res;
};

export default {
  login,
  register,
  logout,
  getFavor,
};
