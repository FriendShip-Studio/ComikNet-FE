export interface CommentsList {
  total: string;
  list: Array<CommentInfo>;
}

export interface CommentInfo {
  AID: string;
  BID: string;
  CID: string;
  UID: string;
  username: string;
  nickname: string;
  likes: string;
  gender: string;
  update_at: string;
  addtime: string;
  parent_CID: string;
  expinfo: {
    level_name: string;
    level: number;
    nextLevelExp: number;
    exp: number;
    expPercent: number;
    uid: number;
    badges: Array<{
      content: string;
      name: string;
      id: string;
    }>;
  };
  name: string;
  content: string;
  photo: string;
  spoiler: string;
}
