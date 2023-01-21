export interface FavList {
  list: Array<ComicItem>;
}

export interface ComicItem {
  id: string;
  author?: string;
  description?: string;
  category?: any;
  category_sub?: any;
  image?: string;
  name?: string;
}
