import { get, picTestReq } from "@/apis/index";
import { message } from "ant-design-vue";
import { MirrorResponse } from "@/models/requests";
import { ApiMirrorStatus, PicMirrorStatus, WebSiteURL } from "@/models/mirror";

const setMirror = async (api?: string, pic?: string) => {
  const res = await get<MirrorResponse>("/mirror", { api, pic });
};

const getApiSpeed = async (): Promise<Array<ApiMirrorStatus>> => {
  const res = await get<Array<ApiMirrorStatus>>(
    "/speed/api", {},
    { timeout: 60000 }
  );
  if (!res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res.data;
};

const getPicSpeed = async (): Promise<Array<PicMirrorStatus>> => {
  const res = await get<Array<string>>("/speed/pic");

  if (!res.data) {
    message.error("尝试获取漫画图像镜像源列表时出错!");
    return Promise.reject(res);
  }

  let mirror_status = Array<PicMirrorStatus>()
  for (let url of res.data) {
    let start_time = Date.now()
    try {
      await picTestReq.get(`https://${url}/media/photos/403567/00002.webp`);
      mirror_status.push({
        url,
        time: Date.now() - start_time
      })
    } catch (err: any) {
      mirror_status.push({
        url,
        time: -1
      })
    }
  }

  return mirror_status;
};

const getSiteList = async () => {
  const res = await get<WebSiteURL[]>("/speed/web");
  if (!res.data) {
    message.error("尝试获取网站镜像源列表时出错!");
    return Promise.reject(res);
  }

  return res.data;
}

export default {
  setMirror,
  getApiSpeed,
  getPicSpeed,
  getSiteList
};
