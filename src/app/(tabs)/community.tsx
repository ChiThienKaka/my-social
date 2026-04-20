import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, FloatingActionButton, Icon } from "@/components/ui";
import {
  PostCard,
  usePostStore,
  Post,
  PostCommentsModal,
  usePostComments,
} from "@/features/post";
import colors from "@/constants/colors";
import { icons } from "@/constants/icon";
import { router } from "expo-router";
import { useAuthStore } from "@/features/auth";

export default function CommunityScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [feedSort, setFeedSort] = useState<0 | 1>(0);
  const { user } = useAuthStore();
  const { posts, isLoading, error, fetchPosts } = usePostStore();

  // Comments logic được tách ra hook riêng
  const {
    isCommentsVisible,
    comments,
    hasMoreParents,
    totalComments,
    openComments,
    closeComments,
    addComment,
    loadMoreParents,
    handleLikeComment,
    handleReply,
  } = usePostComments();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "official", label: "Chính thức" },
    { id: "clubs", label: "Câu lạc bộ" },
    { id: "events", label: "Sự kiện" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={{ uri: user?.avatar_url || "" }}
              name={user?.name || ""}
              size={48}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{user?.name || ""}</Text>
            <Text style={styles.userInfo}>Khoa Công nghệ thông tin</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Icon
              name={icons.search.inactive.name}
              set={icons.search.inactive.set}
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.badgeContainer}>
              <Icon
                name={icons.notification.inactive.name}
                set={icons.notification.inactive.set}
                size={24}
                color={colors.icon.primary}
              />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Content */}
      <FlatList
        style={styles.feedScroll}
        contentContainerStyle={styles.feedContent}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={isLoading}
        renderItem={({ item: post }) => {
          const firstMedia = post.media?.[0];
          const imageSource =
            firstMedia && firstMedia.type === "image"
              ? { uri: firstMedia.url }
              : undefined;

          return (
            <>
              <PostCard
                author={{
                  name: post.author.name,
                  avatar_url: post.author.avatar_url
                    ? post.author.avatar_url
                    : "",
                }}
                timestamp={post.created_at}
                content={post.content}
                image={imageSource}
                likes={post.total_like ?? post.views}
                comments={post.total_comment ?? 0}
                onCommentPress={() => openComments(post)}
              />
              <View style={styles.divider} />
            </>
          );
        }}
      />

      {/* Sau thay thành chatbot */}
      <View style={styles.fabContainer}>
        <FloatingActionButton
          onPress={() => router.push("/post/create")}
          icon="add"
        />
      </View>

      <PostCommentsModal
        visible={isCommentsVisible}
        onClose={closeComments}
        comments={comments}
        totalCount={totalComments}
        hasMoreParents={hasMoreParents}
        onLoadMoreParents={loadMoreParents}
        onLike={handleLikeComment}
        onReply={handleReply}
        onAddComment={addComment}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.border.muted,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.state.success,
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  userInfo: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "400",
    fontStyle: "italic",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  badgeContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.state.error,
  },
  filtersScroll: {
    maxHeight: 50,
    backgroundColor: colors.background.white,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  feedScroll: {
    flex: 1,
  },
  feedContent: {
    // padding: 16,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  feedTitle: {
    fontSize: 24,
  },
  divider: {
    height: 5,
    backgroundColor: colors.background.grey,
  },
  fabContainer: {
    position: "absolute",
    bottom: 16,
    right: 20,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: colors.state.error,
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.teal.primary,
  },
  retryText: {
    color: colors.text.white,
    fontWeight: "600",
  },
});
