import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Avatar, Icon } from "@/components/ui";
import colors from "@/constants/colors";

export interface CommentAuthor {
  name: string;
  avatar?: { uri: string } | number;
  isAuthor?: boolean;
  icon?: string;
  backgroundColor?: string;
  iconColor?: string;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  timestamp: string;
  content: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
  /** Số phản hồi còn lại chưa hiển thị → UI "Xem N phản hồi khác..." */
  moreRepliesCount?: number;
}

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isReply = false,
  onLike,
  onReply,
}) => {
  return (
    <View style={styles.container}>
      {/* Reply Indent Line */}
      {isReply && <View style={styles.replyLine} />}

      <View style={[styles.contentWrapper, isReply && styles.replyWrapper]}>
        {/* Avatar */}
        <Avatar
          source={comment.author.avatar}
          name={comment.author.name}
          size={isReply ? 32 : 40}
          icon={comment.author.icon as any}
          backgroundColor={comment.author.backgroundColor}
          iconColor={comment.author.iconColor}
        />

        {/* Comment Content */}
        <View style={styles.content}>
          {/* Header: Name, Author Tag, Timestamp */}
          <View style={styles.header}>
            <Text style={styles.authorName}>{comment.author.name}</Text>
            {comment.author.isAuthor && (
              <View style={styles.authorTag}>
                <Text style={styles.authorTagText}>Author</Text>
              </View>
            )}
            <Text style={styles.timestamp}>{comment.timestamp}</Text>
          </View>

          {/* Comment Text */}
          <Text style={styles.commentText}>{comment.content}</Text>

          {/* Actions: Like, Reply */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onLike?.(comment.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.actionText,
                  comment.isLiked && styles.actionTextLiked,
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onReply?.(comment.id, comment.author.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Like Count (Right Side) */}
        {comment.likes !== undefined && comment.likes > 0 && (
          <View style={styles.likeCountContainer}>
            <Icon
              set="ion"
              name={comment.isLiked ? "heart" : "heart-outline"}
              size={16}
              color={comment.isLiked ? "#EF4444" : colors.text.secondary}
            />
            <Text
              style={[
                styles.likeCount,
                comment.isLiked && styles.likeCountLiked,
              ]}
            >
              {comment.likes}
            </Text>
          </View>
        )}
      </View>

      {/* Render Replies: chỉ hiển thị reply đầu tiên + "Xem N phản hồi khác..." */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
          {comment.moreRepliesCount != null && comment.moreRepliesCount > 0 && (
            <Text style={styles.moreRepliesText}>
              Xem {comment.moreRepliesCount} phản hồi khác ...
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  replyLine: {
    width: 2,
    backgroundColor: colors.teal.primary,
    marginLeft: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  contentWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  replyWrapper: {
    marginLeft: 48,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginRight: 6,
  },
  authorTag: {
    backgroundColor: colors.teal.light,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  authorTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.teal.primary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.teal.primary,
  },
  commentText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    color: colors.teal.primary,
    fontWeight: "500",
  },
  actionTextLiked: {
    color: "#EF4444",
  },
  likeCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  likeCount: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  likeCountLiked: {
    color: "#EF4444",
  },
  repliesContainer: {
    marginTop: 8,
  },
  moreRepliesText: {
    marginTop: 4,
    marginLeft: 72,
    fontSize: 12,
    color: colors.teal.primary,
    fontWeight: "500",
  },
});

export default CommentItem;
