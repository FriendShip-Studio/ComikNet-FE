import { get, mirror } from "@/apis/index";
import { message } from "ant-design-vue";

const setMirror = async (api?: string, pic?: string) => {

    const resp = await mirror({ api, pic });
    message.info(resp.api_msg);
    message.info(resp.pic_msg);
}

const getApiSpeed = async () => {
    const resp = await get("/speed/api");
    if (resp.status_code !== 200) {
        message.error("镜像测速失败!");
        return Promise.reject(resp);
    }
    return resp.data;
}

const getPicSpeed = async () => {
    const resp = await get("/speed/pic");
    if (resp.status_code !== 200) {
        message.error("镜像测速失败!");
        return Promise.reject(resp);
    }
    return resp.data;
}

export default {
    setMirror,
    getApiSpeed,
    getPicSpeed
}