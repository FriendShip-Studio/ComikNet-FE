import { get } from "@/apis/index";
import { message } from "ant-design-vue";
import type {
  AlbumInfo,
  ChapterImageData,
  ChapterInfo,
  ChapterResponse,
} from "@/models/albums";
import type { CommentsList } from "@/models/comments";
import { ImageListRequest } from "@/models/requests";

const getAlbumInfo = async (id: string): Promise<AlbumInfo> => {
  const res = await get<AlbumInfo>(`/album`, { id });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return res.data;
};

const getChapterInfo = async (id: string): Promise<Array<ChapterInfo>> => {
  const res = await get<ChapterResponse>(`/chapter`, { id });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }

  const chapterInfo: Array<ChapterInfo> = [];

  if (res.data.series.length === 0) {
    chapterInfo.push({
      cid: res.data.id,
      id: "1",
    });
    return chapterInfo;
  }

  for (const item of res.data.series) {
    chapterInfo.push({
      cid: item.id,
      id: item.sort,
    });
  }
  return chapterInfo;
};

const getChapterImgList = async (cid: string): Promise<ChapterImageData> => {
  const res = await get<ImageListRequest>("/img_list", { id: cid });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  // !!!类型层级不对
  return {
    images: res.data,
    scramble_id: res.scramble_id,
  };
};

const getAlbumComents = async (id: string, page = 1): Promise<CommentsList> => {
  const res = await get<CommentsList>("/comment/comic", { id, page });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject(res);
  }
  return {
    total: res.data.total,
    list: res.data.list,
  };
};

export default {
  getAlbumInfo,
  getAlbumComents,
  getChapterInfo,
  getChapterImgList,
};
