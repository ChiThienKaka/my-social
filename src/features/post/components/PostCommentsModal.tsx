import React from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { Icon } from "@/components/ui";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import type { Comment } from "./CommentItem";

interface PostCommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  totalCount: number;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, authorName: string) => void;
  onAddComment: (text: string) => void;
  hasMoreParents?: boolean;
  onLoadMoreParents?: () => void;
}

const PostCommentsModal: React.FC<PostCommentsModalProps> = ({
  visible,
  onClose,
  comments,
  totalCount,
  onLike,
  onReply,
  onAddComment,
  hasMoreParents,
  onLoadMoreParents,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      style={{ backgroundColor: "blue" }}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <SafeAreaView
          style={[styles.modalSafeArea, { paddingBottom: 10 }]}
          // edges={["top"]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalHeaderButton}
              activeOpacity={0.7}
            >
              <Icon
                set="ion"
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Comments</Text>
            <View style={styles.modalHeaderButton} />
          </View>

          {/* Comments List */}
          <CommentList
            comments={comments}
            totalCount={totalCount}
            onLike={onLike}
            onReply={onReply}
          />

          {/* Tạm ẩn: load more "Xem thêm" */}
          {/* {hasMoreParents && onLoadMoreParents && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={onLoadMoreParents}
              activeOpacity={0.7}
            >
              <Text style={styles.loadMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          )} */}

          {/* Comment Input */}
          <CommentInput
            placeholder="Thêm bình luận..."
            onSubmit={onAddComment}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalHeaderButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  loadMoreButton: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreText: {
    fontSize: 14,
    color: colors.teal.primary,
    fontWeight: "500",
  },
});

export default PostCommentsModal;
