export interface AlbumInfo {
    // 共有数据
    id: string;
    author: Array<string>;
    description: string;
    image: string;
    name: string;

    // 搜索与收藏数据
    category?: any;
    category_sub?: any;

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
    works?: Array<any>
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

export interface AlbumList {
    list: Array<AlbumInfo>;
}