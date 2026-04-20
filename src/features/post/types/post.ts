// Frontend-normalized types (FE model)
// Luôn dùng các tên field consistent trên FE, không phụ thuộc backend.

export interface PostAuthor {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
}

export type PostType = "normal" | string;
export type PostVisibility = "public" | "private" | string;

export interface PostMedia {
  id: number;
  type: "image" | "video" | string;
  url: string;
  order: number;
}

export interface Post {
  id: number | string;
  content: string;
  type: PostType;
  visibility: PostVisibility;
  status: string;
  views: number;
  created_at: string; // ISO string
  author: PostAuthor;
  media: PostMedia[];
  isPending?: boolean;
  /** Số bình luận (từ API total_comment) */
  total_comment?: number;
  /** Số lượt thích (từ API total_like) */
  total_like?: number;
}
