import { useState, useCallback } from "react";
import type { Post } from "../types/post";
import type { Comment } from "../components/CommentItem";
import { commentService } from "../services/comment.service";
import { formatPostTime } from "../utils/formatTime";
import { useAuthStore } from "@/features/auth";
import usePostStore from "../store/usePostStore";

interface UsePostCommentsReturn {
  // State
  selectedPost: { post: Post | null; comments: Comment[] } | null;
  isCommentsVisible: boolean;
  comments: Comment[];
  commentsPage: number;
  hasMoreParents: boolean;

  // Actions
  openComments: (post: Post) => Promise<void>;
  closeComments: () => void;
  addComment: (text: string) => Promise<void>;
  loadMoreParents: () => Promise<void>;
  handleLikeComment: (commentId: string) => void;
  handleReply: (commentId: string, authorName: string) => void;

  // Computed
  totalComments: number;
}

export const usePostComments = (): UsePostCommentsReturn => {
  const { user } = useAuthStore();
  const incrementCommentCount = usePostStore((s) => s.incrementCommentCount);
  const [selectedPost, setSelectedPost] = useState<{
    post: Post | null;
    comments: Comment[];
  } | null>(null);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreParents, setHasMoreParents] = useState(false);

  const openComments = useCallback(async (post: Post) => {
    setSelectedPost({ post, comments: [] });
    setComments([]);
    setCommentsPage(1);
    setHasMoreParents(false);
    setIsCommentsVisible(true);

    try {
      const { comments: fetchedComments, hasMoreParents: more } =
        await commentService.getCommentsForPost(Number(post.id), 1, 20);
      setComments(fetchedComments);
      setSelectedPost((prev) =>
        prev ? { ...prev, comments: fetchedComments } : null,
      );
      setHasMoreParents(more);
    } catch (err) {
      console.error("Load comments error:", err);
    }
  }, []);

  const closeComments = useCallback(() => {
    setIsCommentsVisible(false);
  }, []);

  const addComment = useCallback(
    async (text: string) => {
      if (!selectedPost?.post) {
        return;
      }

      try {
        const created = await commentService.createComment({
          postId: Number(selectedPost.post.id),
          content: text,
          parentCommentId: null,
        });

        const newComment: Comment = {
          id: String(created.comment_id),
          author: {
            name: user?.name || "",
            avatar: user?.avatar_url ? { uri: user.avatar_url } : undefined,
          },
          timestamp: formatPostTime(created.created_at),
          content: created.content,
          likes: 0,
          isLiked: false,
        };

        setComments((prev) => [...prev, newComment]);
        incrementCommentCount(selectedPost.post.id);
      } catch (error) {
        console.error("Create comment error:", error);
      }
    },
    [selectedPost, user, incrementCommentCount],
  );

  const loadMoreParents = useCallback(async () => {
    if (!selectedPost?.post) return;
    try {
      const nextPage = commentsPage + 1;
      const { comments: moreComments, hasMoreParents: more } =
        await commentService.getCommentsForPost(
          Number(selectedPost.post.id),
          nextPage,
          5,
        );
      setComments((prev) => [...prev, ...moreComments]);
      setCommentsPage(nextPage);
      setHasMoreParents(more);
    } catch (err) {
      console.error("Load more comments error:", err);
    }
  }, [selectedPost, commentsPage]);

  const handleLikeComment = useCallback((commentId: string) => {
    // TODO: Implement like comment logic
    console.log("Like comment:", commentId);
  }, []);

  const handleReply = useCallback((commentId: string, authorName: string) => {
    // TODO: Implement reply logic
    console.log("Reply to", commentId, "by", authorName);
  }, []);

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length || 0),
    0,
  );

  return {
    // State
    selectedPost,
    isCommentsVisible,
    comments,
    commentsPage,
    hasMoreParents,

    // Actions
    openComments,
    closeComments,
    addComment,
    loadMoreParents,
    handleLikeComment,
    handleReply,

    // Computed
    totalComments,
  };
};
