import { get, post } from "@/apis/index";
import { message } from "ant-design-vue";
import type {
  AlbumInfo,
  ChapterImageData,
  ChapterInfo,
  ChapterResponse,
} from "@/models/albums";

import type {
  FavorResponse,
} from "@/models/requests";
import type { CommentsList } from "@/models/comments";

const getAlbumInfo = async (id: string): Promise<AlbumInfo> => {
  const res = await get<AlbumInfo>(`/album`, { id });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject({ res: res, errTip: "获取漫画信息失败" });
  }
  return res.data;
};

const getChapterInfo = async (id: string): Promise<Array<ChapterInfo>> => {
  const res = await get<ChapterResponse>(`/chapter`, { id });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject({ res: res, errTip: "获取章节信息失败" });
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

const setFavorStat = async (aid: string): Promise<boolean> => {

  const res = await post<FavorResponse>("/favorite", { aid });
  if (res.errorMsg || !res.data || res.data.status != "ok") {
    message.error(res.errorMsg);
    return Promise.reject({ res: res, errTip: "设置收藏状态失败" });
  }

  if (res.data.type === "add") {
    return true;
  } else {
    return false;
  }
};

const getChapterImgList = async (cid: string): Promise<ChapterImageData> => {
  const res = await get<ChapterImageData>("/img_list", { id: cid });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject({ res: res, errTip: "获取章节图片失败" });
  }

  return res.data;
};

const getAlbumComents = async (id: string, page = 1): Promise<CommentsList> => {
  const res = await get<CommentsList>("/comment/comic", { id, page });
  if (res.errorMsg || !res.data) {
    message.error(res.errorMsg);
    return Promise.reject({ res: res, errTip: "获取漫画评论失败" });
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
  setFavorStat,
};
