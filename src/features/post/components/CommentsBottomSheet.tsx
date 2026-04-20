import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@/components/ui";
import CommentItem from "./CommentItem";
import colors from "@/constants/colors";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: { uri: string } | number;
    isAuthor?: boolean;
    icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    backgroundColor?: string;
    iconColor?: string;
  };
  timestamp: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface PostInfo {
  author: {
    name: string;
    avatar?: { uri: string } | number;
    icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    backgroundColor?: string;
    iconColor?: string;
  };
  content: string;
  image?: { uri: string } | number;
  hashtags?: string[];
}

interface CommentsBottomSheetProps {
  post: PostInfo;
  comments: Comment[];
  totalComments: number;
  onClose?: () => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, replyText: string) => void;
  onSendComment?: (text: string) => void;
}

const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  post,
  comments,
  totalComments,
  onClose,
  onLikeComment,
  onReplyComment,
  onSendComment,
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  React.useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1 && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  const handleReply = (commentId: string, authorName: string) => {
    setReplyingTo(commentId);
  };

  const handleSendReply = () => {
    if (replyText.trim() && replyingTo && onReplyComment) {
      onReplyComment(replyingTo, replyText);
      setReplyText("");
      setReplyingTo(null);
    } else if (replyText.trim() && onSendComment) {
      onSendComment(replyText);
      setReplyText("");
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <View key={comment.id}>
      <CommentItem
        author={comment.author}
        timestamp={comment.timestamp}
        content={comment.content}
        likes={comment.likes}
        isLiked={comment.isLiked}
        isReply={isReply}
        onLike={() => onLikeComment?.(comment.id)}
        onReply={() => handleReply(comment.id, comment.author.name)}
      />
      {comment.replies?.map((reply) => renderComment(reply, true))}
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.close()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.icon.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
            <Ionicons
              name="share-social-outline"
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postSection}>
          <View style={styles.postHeader}>
            <View style={styles.postAuthorInfo}>
              {post.author.avatar ? (
                <Avatar
                  source={post.author.avatar}
                  name={post.author.name}
                  size={40}
                />
              ) : (
                <View
                  style={[
                    styles.postAuthorIcon,
                    { backgroundColor: post.author.backgroundColor || colors.teal.primary },
                  ]}
                >
                  <Ionicons
                    name={post.author.icon || "person-outline"}
                    size={20}
                    color={post.author.iconColor || colors.text.white}
                  />
                </View>
              )}
              <View style={styles.postAuthorDetails}>
                <Text style={styles.postAuthorName}>{post.author.name}</Text>
                <View style={styles.postAuthorBadge}>
                  <View style={styles.onlineDot} />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton} activeOpacity={0.7}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>
          {post.hashtags && post.hashtags.length > 0 && (
            <View style={styles.hashtagsContainer}>
              {post.hashtags.map((tag, index) => (
                <Text key={index} style={styles.hashtag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
          {post.image && (
            <View style={styles.postImageContainer}>
              <Text style={styles.postImagePlaceholder}>[Post Image]</Text>
            </View>
          )}
        </View>

        {/* Comments Header */}
        <View style={styles.commentsHeader}>
          <View style={styles.commentsHeaderLine} />
          <Text style={styles.commentsTitle}>Comments ({totalComments})</Text>
        </View>

        {/* Comments List */}
        <View style={styles.commentsList}>
          {comments.map((comment) => renderComment(comment))}
        </View>
      </BottomSheetScrollView>

      {/* Reply Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>
                Replying to{" "}
                {comments.find((c) => c.id === replyingTo)?.author.name ||
                  "comment"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                style={styles.closeReplyButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={colors.text.muted} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <Avatar
              name="User"
              size={36}
            />
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
                placeholderTextColor={colors.text.muted}
                value={replyText}
                onChangeText={setReplyText}
                multiline
              />
            </View>
            <TouchableOpacity
              onPress={handleSendReply}
              style={[
                styles.sendButton,
                replyText.trim() && styles.sendButtonActive,
              ]}
              activeOpacity={0.7}
              disabled={!replyText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={colors.text.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.background.white,
  },
  handleIndicator: {
    backgroundColor: colors.border.light,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  shareButton: {
    padding: 4,
  },
  postSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  postAuthorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  postAuthorDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginRight: 8,
  },
  postAuthorBadge: {
    marginRight: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal.primary,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.teal.primary,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.white,
  },
  postContent: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  hashtag: {
    fontSize: 14,
    color: colors.teal.primary,
    marginRight: 8,
    marginBottom: 4,
  },
  postImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.background.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  postImagePlaceholder: {
    fontSize: 14,
    color: colors.text.muted,
  },
  commentsHeader: {
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  commentsHeaderLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.light,
    marginBottom: 12,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  commentsList: {
    paddingTop: 16,
  },
  inputContainer: {
    backgroundColor: colors.background.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingBottom: 20,
  },
  replyingToContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background.light,
  },
  replyingToText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  closeReplyButton: {
    padding: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.background.grey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: colors.text.primary,
    padding: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: colors.teal.primary,
  },
});

export default CommentsBottomSheet;









