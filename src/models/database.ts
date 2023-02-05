export interface HistoryRecord {
    aid: number;
    cid: number;
    update_time: string;
}

export interface Comment {
    aid: string;
    uid: string;
    comment: string;
    comment_time: string;
}