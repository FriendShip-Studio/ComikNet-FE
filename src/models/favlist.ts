export interface FavList {
  list: Array<FavItem>;
}

export interface FavItem {
  id: string;
  author?: string;
  description?: string;
  category?: any;
  category_sub?: any;
  image?: string;
  name?: string;
}
