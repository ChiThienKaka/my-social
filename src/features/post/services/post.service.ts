import { http } from "@/app/api/http";
import type { Post, PostAuthor, PostMedia } from "../types/post";

// Raw types từ API (phản ánh đúng JSON backend trả về)
interface PostAuthorApi {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
}

interface PostMediaApi {
  media_id: number;
  media_type: "image" | "video" | string;
  media_url: string;
  media_order: number;
}

interface PostApi {
  id: number;
  content: string;
  type: string;
  visibility: string;
  status: string;
  views: number;
  created_at: string;
  author: PostAuthorApi;
  media: PostMediaApi[];
  total_comment?: number;
  total_like?: number;
}

// Response dạng pagination từ API getPosts
interface PostsListResponse {
  data: PostApi[];
  current_page: number;
  total: number;
}

// DTO cho create-post API
interface CreatePostApiResponse {
  post_id: number;
  content: string;
  major_id: number;
  faculty_id: number;
  user_id: number;
  media: PostMediaApi[] | [];
}

// Hàm map từ API DTO -> FE model
const mapAuthor = (author: PostAuthorApi): PostAuthor => ({
  id: author.id,
  email: author.email,
  name: author.name,
  avatar_url: author.avatar,
});

const mapMedia = (media: PostMediaApi[]): PostMedia[] =>
  media.map((item) => ({
    id: item.media_id,
    type: item.media_type,
    url: item.media_url,
    order: item.media_order,
  }));

export const postService = {
  /**
   * Get list of posts with media
   * Endpoint: GET /api/post-context/posts-media
   */
  getPosts: async (): Promise<Post[]> => {
    const response = await http.get<PostsListResponse>(
      "/api/post-context/posts-media",
    );

    const items = response.data?.data ?? [];

    return items.map<Post>((item) => ({
      id: item.id,
      content: item.content,
      type: item.type,
      visibility: item.visibility,
      status: item.status,
      views: item.views,
      created_at: item.created_at,
      author: mapAuthor(item.author),
      media: mapMedia(item.media || []),
      total_comment: item.total_comment ?? 0,
      total_like: item.total_like ?? 0,
    }));
  },

  /**
   * Create a new post with optional media attachments.
   * Endpoint: POST /api/post-context/create-post
   * Content-Type: multipart/form-data
   */
  createPost: async (params: {
    content: string;
    media: { uri: string; type: string; name: string }[];
  }): Promise<CreatePostApiResponse> => {
    console.log("📦 [post.service] Received params:");
    console.log("  - content:", params.content);
    console.log("  - media count:", params.media.length);
    console.log("  - media array:", params.media);

    const formData = new FormData();
    formData.append("content", params.content);

    // Append files với đúng format React Native FormData
    // Backend Laravel đang nhận field name là "images" (array), nên dùng "images[]"
    params.media.forEach((file, index) => {
      console.log(`  - Appending media[${index}]:`, file);
      formData.append("images[]", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
    });
    console.log("formData images[0]", formData.get("images[]"));

    const response = await http.post<CreatePostApiResponse>(
      "/api/post-context/create-post",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log("📩 [post.service] Response:", response.data);
    return response.data;
  },
};
