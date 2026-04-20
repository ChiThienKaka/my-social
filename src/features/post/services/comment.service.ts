import { http } from "@/app/api/http";
import { formatPostTime } from "../utils/formatTime";
import type { Comment } from "../components/CommentItem";

interface CommentUserApi {
  user_id: number;
  full_name: string;
  avatar_url: string | null;
  email: string;
}

interface CommentApi {
  comment_id: number;
  content: string;
  parent_comment_id: number | null;
  status: string;
  created_at: string;
  user: CommentUserApi;
  /** Số lượng phản hồi (theo response như comment.ts) */
  replies_count?: number;
  /** Mảng reply, có thể chỉ trả về reply đầu hoặc nhiều (theo comment.ts) */
  replies?: CommentApi[];
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
}

const mapComment = (api: CommentApi): Comment => ({
  id: String(api.comment_id),
  author: {
    name: api.user.full_name,
    avatar: api.user.avatar_url ? { uri: api.user.avatar_url } : undefined,
  },
  timestamp: formatPostTime(api.created_at),
  content: api.content,
  likes: 0,
  isLiked: false,
});

export const commentService = {
  /**
   * Lấy danh sách comment cho 1 bài viết.
   * Chỉ gọi 1 API: GET /api/post-comment/parents-comment?post_id={postId}
   * Response theo dạng comment.ts: data[].replies_count, data[].replies[].
   * - replies_count > 0 và có replies[0]: hiển thị comment cha + reply đầu + "Xem N phản hồi khác..."
   * - replies_count === 0: chỉ hiển thị comment cha (1 bậc, giống Facebook).
   */
  getCommentsForPost: async (
    postId: number,
    page = 1,
    pageSize = 20,
  ): Promise<{ comments: Comment[]; hasMoreParents: boolean }> => {
    const res = await http.get<PaginatedResponse<CommentApi>>(
      "/api/post-comment/parents-comment",
      {
        params: {
          post_id: postId,
          page,
          per_page: pageSize,
        },
      },
    );

    const data = res.data.data ?? [];
    const total = res.data.total ?? 0;
    const hasMoreParents = page * pageSize < total;

    // Chỉ lấy comment gốc (parent_comment_id === null)
    const parents = data.filter((item) => item.parent_comment_id == null);

    const comments: Comment[] = parents.map((item) => {
      const parentComment = mapComment(item);
      const repliesCount = item.replies_count ?? 0;
      const firstReplyApi = item.replies?.[0];

      if (repliesCount > 0 && firstReplyApi) {
        return {
          ...parentComment,
          replies: [mapComment(firstReplyApi)],
          moreRepliesCount: repliesCount - 1,
        };
      }
      return parentComment;
    });

    return { comments, hasMoreParents };
  },

  /**
   * Tạo comment mới (mock API create-comment)
   * Hiện tại chỉ xử lý comment cha (parent_comment_id = null)
   */
  createComment: async (params: {
    postId: number;
    content: string;
    parentCommentId?: number | null;
  }): Promise<{ comment_id: number; created_at: string; content: string }> => {
    const body = {
      post_id: params.postId,
      content: params.content,
      parent_comment_id: params.parentCommentId ?? null,
    };

    // API trả về mảng, lấy phần tử đầu tiên
    const response = await http.post<
      {
        post_id: number;
        user_id: number;
        content: string;
        parent_comment_id: number | null;
        updated_at: string;
        created_at: string;
        comment_id: number;
      }[]
    >("/api/post-comment/create-comment", body);

    const created = response.data[0];

    return {
      comment_id: created.comment_id,
      created_at: created.created_at,
      content: created.content,
    };
  },
};
