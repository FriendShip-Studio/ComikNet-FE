export interface AlbumInfo {
  id: number;
  name: string;
  author: Array<string>;
  images: Array<string>;
  description: string;
  total_views: string;
  likes: string;
  series: Array<{
    id: number;
    name: string;
    sort: string;
  }>;
  series_id: string;
  comment_total: string;
  tags: Array<string>;
  works: Array<any>
  actors: Array<any>;
  related_list: Array<{
    id: string;
    author: string;
    description: string;
    name: string;
    image: string;
  }>;
  liked: boolean;
  is_favorite: boolean;
}