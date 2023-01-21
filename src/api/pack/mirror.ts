import { apiGet } from "@/api/index";
import { message } from "ant-design-vue";

const setMirror = async (api?: string, pic?: string) => {
    
    const resp = await apiGet("/mirror");
    if (resp.status_code !== 200) {
        message.error("镜像设置失败!");
        return Promise.reject(resp);
    }
    message.info(resp.data.api_msg);
    message.info(resp.data.pic_msg);
}

const getApiSpeed = async () => {
    const resp = await apiGet("/speed/api");
    if (resp.status_code !== 200) {
        message.error("镜像测速失败!");
        return Promise.reject(resp);
    }
    return resp.data;
}

const getPicSpeed = async () => {
    const resp = await apiGet("/speed/pic");
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