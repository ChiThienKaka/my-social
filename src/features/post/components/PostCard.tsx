import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Icon } from "@/components/ui";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import colors from "@/constants/colors";
import { formatPostTime } from "../utils/formatTime";
import { PostAuthor } from "../types/post";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

interface PostCardProps {
  author: {
    name: string;
    avatar_url: string;
    role?: string;
    online?: boolean;
    icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    backgroundColor?: string;
    iconColor?: string;
  };
  timestamp: string;
  content: string;
  image?: { uri: string } | number;
  likes?: number;
  comments?: number;
  pinned?: boolean;
  pinnedLabel?: string;
  onPress?: () => void;
  onMenuPress?: () => void;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  author,
  timestamp,
  content,
  image,
  likes = 0,
  comments = 0,
  pinned = false,
  pinnedLabel,
  onPress,
  onMenuPress,
  onLikePress,
  onCommentPress,
  onSharePress,
}) => {
  const resolvedAvatarUrl = resolveImageUrl(author.avatar_url);
  const resolvedImageSource =
    typeof image === "number"
      ? image
      : image?.uri
        ? { uri: resolveImageUrl(image.uri) as string }
        : undefined;

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={
                resolvedAvatarUrl ? { uri: resolvedAvatarUrl } : undefined
              }
              name={author.name}
              size={40}
              icon={author.icon}
              backgroundColor={author.backgroundColor}
              iconColor={author.iconColor}
            />
            {author.online && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{author.name}</Text>
            {author.role && (
              <Text style={styles.authorRole}>
                {author.role} • {formatPostTime(timestamp)}
              </Text>
            )}
            {!author.role && (
              <Text style={styles.authorRole}>{formatPostTime(timestamp)}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Icon name="more" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{content}</Text>

      {resolvedImageSource && (
        <Image
          source={resolvedImageSource}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLikePress}
          activeOpacity={0.7}
        >
          <Icon
            name="like"
            state={likes > 0 ? "active" : "inactive"}
            size={20}
            color={colors.icon.secondary}
          />
          <Text style={styles.actionCount}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onCommentPress}
          activeOpacity={0.7}
        >
          <Icon name="comment" size={20} color={colors.icon.secondary} />
          <Text style={styles.actionCount}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={onSharePress}
          activeOpacity={0.7}
        >
          <Icon name="share" size={20} color={colors.icon.secondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  pinnedBar: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pinnedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pinnedLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pinnedLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.teal.primary,
    textTransform: "uppercase",
  },
  pinnedTime: {
    fontSize: 11,
    color: colors.text.muted,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
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
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 12,
    color: colors.text.muted,
  },
  menuButton: {
    padding: 4,
  },
  pinnedAuthor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pinnedAuthorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  pinnedAuthorText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.white,
  },
  pinnedAuthorName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  postContent: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  shareButton: {
    marginLeft: "auto",
    marginRight: 0,
  },
  actionCount: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 6,
    fontWeight: "500",
  },
});

export default PostCard;
