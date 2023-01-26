import { get } from "@/apis/index";
import { message } from "ant-design-vue";
import { MirrorResponse } from "@/models/requests";
import { ApiMirrorStatus, PicMirrorStatus } from "@/models/mirror";

const setMirror = async (api?: string, pic?: string) => {
  const res = await get<MirrorResponse>("/mirror", { api, pic });
  if (!res.data) {
    message.error(res.errorMsg);
  } else {
    message.info(res.data?.api_msg);
    message.info(res.data?.pic_msg);
  }
};

const getApiSpeed = async (): Promise<Array<ApiMirrorStatus>> => {
  const res = await get<Array<ApiMirrorStatus>>(
    "/speed/api",
    {},
    { timeout: 60000 }
  );
  if (!res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res.data;
};

const getPicSpeed = async (): Promise<Array<PicMirrorStatus>> => {
  const res = await get<Array<PicMirrorStatus>>(
    "/speed/pic",
    {},
    { timeout: 60000 }
  );
  if (!res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res.data;
};

export default {
  setMirror,
  getApiSpeed,
  getPicSpeed,
};
