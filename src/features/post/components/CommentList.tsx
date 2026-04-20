import React from "react";
import { StyleSheet, View, Text, ScrollView, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentItem, { Comment } from "./CommentItem";
import colors from "@/constants/colors";

interface CommentListProps {
  comments: Comment[];
  totalCount?: number;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  totalCount,
  onLike,
  onReply,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Comments {totalCount !== undefined ? `(${totalCount})` : ""}
        </Text>
        <View style={styles.headerLine} />
      </View>

      {/* Comments List */}
      <FlatList
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={({ item }) => (
          <CommentItem
            key={item.id}
            comment={item}
            onLike={onLike}
            onReply={onReply}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  headerLine: {
    height: 1,
    backgroundColor: colors.border.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
  },
});

export default CommentList;
