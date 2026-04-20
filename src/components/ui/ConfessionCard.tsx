import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface ConfessionCardProps {
  tag: string;
  author: string;
  timestamp: string;
  content: string;
  onPress?: () => void;
  onSavePress?: () => void;
  isSaved?: boolean;
}

const ConfessionCard: React.FC<ConfessionCardProps> = ({
  tag,
  author,
  timestamp,
  content,
  onPress,
  onSavePress,
  isSaved = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tag}</Text>
          </View>
          <Text style={styles.meta}>
            {author} • {timestamp}
          </Text>
        </View>
        <Text style={styles.contentText}>{content}</Text>
        <View style={styles.footer}>
          <View style={styles.warningContainer}>
            <Ionicons
              name="warning-outline"
              size={16}
              color={colors.state.warning}
            />
            <Text style={styles.warningText}>Not an official channel</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onPress}
              style={styles.viewDetailButton}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailText}>View Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSavePress}
              style={styles.saveButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: colors.text.muted,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.white,
    textTransform: "uppercase",
  },
  meta: {
    fontSize: 12,
    color: colors.text.muted,
  },
  contentText: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    fontSize: 12,
    color: colors.state.warning,
    marginLeft: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailButton: {
    marginRight: 12,
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.teal.primary,
  },
  saveButton: {
    padding: 4,
  },
});

export default ConfessionCard;
