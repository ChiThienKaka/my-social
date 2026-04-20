import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Avatar, Button, Chip, Icon } from "@/components/ui";
import { Comment, PostCommentsModal } from "@/features/post";
import type { Post } from "@/features/post/types/post";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import usePostStore from "@/features/post/store/usePostStore";
import { commentService } from "@/features/post/services/comment.service";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { formatPostTime } from "@/features/post/utils/formatTime";

export default function PostDetailsScreen() {
  const { user } = useAuthStore();
  const { posts } = usePostStore();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ postId?: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.postId) {
      const found = posts.find((p) => String(p.id) === params.postId);
      if (found) setPost(found);
      loadComments(Number(params.postId));
    }
    setLoading(false);
  }, [params.postId, posts]);

  const loadComments = useCallback(async (postId: number) => {
    try {
      const { comments: fetched } = await commentService.getCommentsForPost(
        postId,
      );
      setComments(fetched);
    } catch (error) {
      console.warn("Load comments error:", error);
    }
  }, []);

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: (comment.likes || 0) + (comment.isLiked ? -1 : 1),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: (reply.likes || 0) + (reply.isLiked ? -1 : 1),
                  }
                : reply,
            ),
          };
        }
        return comment;
      }),
    );
  };

  const handleReply = (commentId: string, authorName: string) => {
    console.log("Reply to", commentId, "by", authorName);
  };

  const handleAddComment = async (text: string) => {
    if (!post) return;
    try {
      await commentService.createComment({
        postId: Number(post.id),
        content: text,
      });
      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: user?.name || "Bạn",
          avatar: user?.avatar_url ? { uri: resolveImageUrl(user.avatar_url) } : undefined,
        },
        timestamp: "Vừa xong",
        content: text,
        likes: 0,
        isLiked: false,
      };
      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.warn("Create comment error:", error);
    }
  };

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies?.length || 0),
    0,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ActivityIndicator
          color={colors.teal.primary}
          style={{ flex: 1 }}
          size="large"
        />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Icon set="ion" name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color={colors.text.muted} />
          <Text style={styles.emptyText}>Không tìm thấy bài viết</Text>
        </View>
      </SafeAreaView>
    );
  }

  const authorAvatar = post.author.avatar_url
    ? { uri: resolveImageUrl(post.author.avatar_url) }
    : undefined;
  const firstImage = post.media?.[0]?.url
    ? resolveImageUrl(post.media[0].url)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Icon set="ion" name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết</Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Icon set="ion" name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authorSection}>
          <Avatar
            source={authorAvatar}
            name={post.author.name}
            size={48}
          />
          <View style={styles.authorInfo}>
            <View style={styles.authorHeader}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.timestamp}>
                {" "}
                • {formatPostTime(post.created_at)}
              </Text>
            </View>
          </View>
          <Button
            label={isFollowing ? "Đang theo dõi" : "Theo dõi"}
            onPress={() => setIsFollowing(!isFollowing)}
            variant={isFollowing ? "outline" : "primary"}
            size="small"
            style={styles.followButton}
          />
        </View>

        <View style={styles.postContent}>
          <Text style={styles.postText}>{post.content}</Text>
        </View>

        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.statText}>{post.total_like || 0} lượt thích</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.statText}>{post.views || 0} lượt xem</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.commentsButton}
          onPress={() => setIsCommentsVisible(true)}
          activeOpacity={0.7}
        >
          <Icon
            set="ion"
            name="chatbubble-outline"
            size={20}
            color={colors.teal.primary}
          />
          <Text style={styles.commentsButtonText}>
            Xem bình luận ({totalComments})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <PostCommentsModal
        visible={isCommentsVisible}
        onClose={() => setIsCommentsVisible(false)}
        comments={comments}
        totalCount={totalComments}
        onLike={handleLikeComment}
        onReply={handleReply}
        onAddComment={handleAddComment}
      />
    </SafeAreaView>
  );
}

const Ionicons = require("@expo/vector-icons").Ionicons;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.text.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  authorInfo: { flex: 1, marginLeft: 12 },
  authorHeader: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  authorName: { fontSize: 16, fontWeight: "600", color: colors.text.primary },
  timestamp: { fontSize: 14, color: colors.text.secondary },
  followButton: { minWidth: 80 },
  postContent: { paddingHorizontal: 16, marginBottom: 16 },
  postText: { fontSize: 16, color: colors.text.primary, lineHeight: 24 },
  backgroundImage: { width: "100%", height: 300, marginBottom: 16 },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 20,
    marginBottom: 12,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontSize: 13, color: colors.text.secondary },
  commentsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  commentsButtonText: { fontSize: 16, fontWeight: "600", color: colors.teal.primary },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 100 },
  emptyText: { fontSize: 15, color: colors.text.muted, marginTop: 12 },
});
