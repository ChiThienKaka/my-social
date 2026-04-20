import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface DeadlineCardProps {
  tag: string;
  author: string;
  timestamp: string;
  title: string;
  description: string;
  month: string;
  day: string;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
  onViewGuidelinesPress?: () => void;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({
  tag,
  author,
  timestamp,
  title,
  description,
  month,
  day,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
  onViewGuidelinesPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.header}>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>{tag}</Text>
            </View>
            <TouchableOpacity
              onPress={onBookmarkPress}
              style={styles.bookmarkButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.meta}>
            {author} • {timestamp}
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {onViewGuidelinesPress && (
            <TouchableOpacity
              onPress={onViewGuidelinesPress}
              style={styles.viewGuidelinesButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewGuidelinesText}>View Guidelines</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: colors.background.white,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  content: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tagContainer: {
    backgroundColor: "#EF4444",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.white,
    textTransform: "uppercase",
  },
  bookmarkButton: {
    padding: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  viewGuidelinesButton: {
    alignSelf: "flex-start",
  },
  viewGuidelinesText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.teal.primary,
  },
  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  month: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.white,
    textTransform: "uppercase",
  },
  day: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.white,
  },
});

export default DeadlineCard;







