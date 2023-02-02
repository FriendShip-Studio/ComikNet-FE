export interface MirrorState {
  configured: boolean;
  api_url?: string;
  pic_url?: string;
}

export interface ApiMirrorStatus {
  url: string;
  time: number;
}

export interface PicMirrorStatus {
  url: string;
  time: number;
}

