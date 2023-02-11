export interface AlbumInfo {
  // 共有数据
  id: string;
  author: Array<string>;
  description: string;
  image: string;
  name: string;

  // 搜索与收藏数据
  category?: {
    id: string;
    title: string;
  };
  category_sub?: {
    id: string;
    title: string;
  };

  // 详情页数据
  total_views?: string;
  likes?: string;
  series?: Array<{
    id: number;
    name: string;
    sort: string;
  }>;
  series_id?: string;
  comment_total?: string;
  tags?: Array<string>;
  works?: Array<any>;
  actors?: Array<any>;
  related_list?: Array<{
    id: string;
    author: Array<string>;
    description: string;
    name: string;
    image: string;
  }>;
  liked?: boolean;
  is_favorite?: boolean;
}

export interface SearchResult {
  search_query: string;
  total: number;
  content: Array<AlbumInfo>;
}

export interface ChapterInfo {
  cid: string;
  id: string;
}

export interface ChapterResponse {
  id: number;
  name: string;
  tags: string;
  images: Array<string>;
  series_id: string;
  is_favorite: boolean;
  liked: boolean;
  series: Array<{
    id: string;
    name: string;
    sort: string;
  }>;
}
export interface ChapterImageData {
  img_list: string[];
  scramble_id: number;
}

export interface PageStatus {
  nowPage?: number;
}

export enum sortRules {
  time = "mr",
  click = "mv",
  images = "mp",
  favorites = "tf",
}

export const sortNames: Record<string, string> = {
  mr: "按更新时间排序",
  mv: "按浏览人数排序",
  mp: "按漫画页数排序",
  tf: "按收藏人数排序",
}
