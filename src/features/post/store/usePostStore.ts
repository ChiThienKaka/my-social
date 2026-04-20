import { create } from "zustand";
import type { Post, PostAuthor, PostMedia } from "../types/post";
import { postService } from "../services/post.service";

interface PostState {
  posts: Post[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  createError: string | null;

  fetchPosts: () => Promise<void>;
  /** Tăng số comment của post theo id (sau khi thêm comment mới) */
  incrementCommentCount: (postId: number | string) => void;
  createPost: (params: {
    content: string;
    media: { uri: string; type: string; name: string }[];
    author: PostAuthor;
  }) => Promise<void>;
}

const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isLoading: false,
  isCreating: false,
  error: null,
  createError: null,

  incrementCommentCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p.id) === String(postId)
          ? { ...p, total_comment: (p.total_comment ?? 0) + 1 }
          : p,
      ),
    }));
  },

  fetchPosts: async () => {
    try {
      set({ isLoading: true, error: null });
      const fetchedPosts = await postService.getPosts();

      // Merge với posts hiện tại: giữ lại posts pending/temp, merge với posts mới từ API
      const currentPosts = get().posts;
      const pendingPosts = currentPosts.filter(
        (p) => p.isPending || String(p.id).startsWith("temp-"),
      );

      // Loại bỏ duplicate: nếu post đã có trong fetchedPosts thì không giữ pending version
      const mergedPosts = [
        ...pendingPosts.filter(
          (pending) =>
            !fetchedPosts.some((fetched) => fetched.id === pending.id),
        ),
        ...fetchedPosts,
      ];

      set({ posts: mergedPosts, isLoading: false });
    } catch (error: any) {
      console.error("Fetch posts error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách bài viết.";
      set({ error: message, isLoading: false });
    }
  },

  createPost: async (params) => {
    try {
      set({ isCreating: true, createError: null });
      console.log("  - media data:", params.media);

      // Gửi request tạo post với content và media
      const created = await postService.createPost({
        content: params.content,
        media: params.media,
      });
      console.log("✅ [usePostStore] Created post response:", created);

      let finalMedia: PostMedia[] = [];

      // Nếu backend trả về media ngay → dùng luôn
      if (
        created.media &&
        Array.isArray(created.media) &&
        created.media.length > 0
      ) {
        finalMedia = created.media.map((item) => ({
          id: item.media_id,
          type: item.media_type,
          url: item.media_url,
          order: item.media_order,
        }));
        console.log("📸 Backend returned media immediately:", finalMedia);
      }
      // Nếu có upload media nhưng backend chưa trả về → đợi và fetch lại
      else if (params.media.length > 0) {
        console.log("⏳ Backend processing media, waiting 2s then fetching...");

        // Đợi 2 giây để backend xử lý media
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch lại danh sách posts để lấy post với media
        const allPosts = await postService.getPosts();
        const fetchedPost = allPosts.find((p) => p.id === created.post_id);

        if (fetchedPost && fetchedPost.media.length > 0) {
          finalMedia = fetchedPost.media;
          console.log("✅ Fetched media from backend:", finalMedia);
        } else {
          console.log("⚠️ Backend still hasn't processed media yet");
        }
      }

      // Tạo post mới từ response backend
      const newPost: Post = {
        id: created.post_id,
        content: created.content,
        type: "normal",
        visibility: "public",
        status: "pending",
        views: 0,
        created_at: new Date().toISOString(),
        total_comment: 0,
        total_like: 0,
        author: {
          id: params.author.id,
          email: params.author.email,
          name: params.author.name,
          avatar_url: params.author.avatar_url,
        },
        media: finalMedia,
      };

      console.log("📝 Final post to display:", newPost);

      // Thêm post mới vào đầu danh sách
      set((state) => ({
        posts: [newPost, ...state.posts],
        isCreating: false,
      }));
    } catch (error: any) {
      console.error("Create post error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tạo bài viết.";

      set({ createError: message, isCreating: false });
      throw error;
    }
  },
}));

export default usePostStore;
