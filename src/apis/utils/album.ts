import { get, img_list } from "@/apis/index";
import { message } from "ant-design-vue";
import type { AlbumInfo, ChapterImageData, ChapterInfo } from "@/models/albums"

const getAlbumInfo = async (id: string): Promise<AlbumInfo | null> => {
    try {
        const resp = await get(`/album`, { id });
        if (resp.errorMsg) {
            console.log(resp.errorMsg);
            return null;
        }
        return resp.data;
    } catch (error: any) {
        message.error(error.message);
        return null;
    }
}

const getChapterInfo = async (id: string): Promise<Array<ChapterInfo> | null> => {
    try {
        const res = await get(`/chapter`, { id });
        if (res.errorMsg) {
            message.error(res.errorMsg);
            return null;
        }

        let chapterInfo: Array<ChapterInfo> = [];

        if (res.data.series.length === 0) {
            chapterInfo.push({
                cid: res.data.id,
                id: "1"
            })
            return chapterInfo;
        }

        for (let item of res.data.series) {
            chapterInfo.push({
                cid: item.id,
                id: item.sort
            })
        }

        return chapterInfo;

    } catch (error: any) {
        message.error(error.message);
        return null;
    }
}

const getChapterImgList = async (cid: string): Promise<ChapterImageData | null> => {
    try {
        const res = await img_list(cid);
        if (res.errorMsg || !res.data || !res.scramble_id) {
            message.error(res.errorMsg);
            return null;
        }

        return {
            images: res.data,
            scramble_id: res.scramble_id
        }

    } catch (error: any) {
        message.error(error.message);
        return null;
    }
}

export default {
    getAlbumInfo,
    getChapterInfo,
    getChapterImgList
}