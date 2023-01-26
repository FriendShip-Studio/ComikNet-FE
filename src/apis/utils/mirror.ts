import { get, mirror } from "@/apis/index";
import { message } from "ant-design-vue";

const setMirror = async (api?: string, pic?: string) => {

    const resp = await mirror({ api, pic });
    message.info(resp.api_msg);
    message.info(resp.pic_msg);
}

const getApiSpeed = async () => {
    const resp = await get("/speed/api",{},{timeout: 60000});
    return resp.data;
}

const getPicSpeed = async () => {
    const resp = await get("/speed/pic",{},{timeout: 60000});
    return resp.data;
}

export default {
    setMirror,
    getApiSpeed,
    getPicSpeed
}