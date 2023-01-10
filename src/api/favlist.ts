import { apiGet, apiPost } from "@/api/index";
import { MyRes } from "@/models";
import { FavList } from "@/models/favlist";
import { message } from "ant-design-vue";

const get = async (): Promise<MyRes<FavList>> => {
  const res = await apiGet('/favorite');
  if (res.status_code !== 200) {
    message.error(res.errorMsg);
    Promise.reject(res.errorMsg);
  }
  return res
};

export default {
  get,
};
