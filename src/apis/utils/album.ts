import { get } from "@/apis/index";
import { message } from "ant-design-vue";
import type { AlbumInfo } from "@/models/albums"

const getAlbumInfo = async (id: string): Promise<AlbumInfo | null> => {
    try {
        const resp = await get(`/album`, { id });
        return resp.data;
    } catch (error: any) {
        message.error(error.message);
        return null;
    }
}

export default {
    getAlbumInfo
}