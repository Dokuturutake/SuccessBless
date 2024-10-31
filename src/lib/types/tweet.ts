export interface Tweet {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Reply[];
  replyCount: number;
  imageBlob?: Blob;  // 圧縮済みの1つの画像データ
}

export interface Reply {
  id: string;
  tweetId: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  style?: string;
  hashtags?: string[];
}