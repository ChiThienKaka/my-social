import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import colors from "@/constants/colors";

export type TrendingType = "event" | "course" | "news";

interface TrendingCardProps {
  type: TrendingType;
  title: string;
  description?: string;
  timestamp?: string;
  author?: {
    name: string;
    avatar?: { uri: string } | number;
    icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    backgroundColor?: string;
    iconColor?: string;
  };
  courseInfo?: {
    instructor: string;
    studentCount: number;
  };
  onPress?: () => void;
  onMenuPress?: () => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  type,
  title,
  description,
  timestamp,
  author,
  courseInfo,
  onPress,
  onMenuPress,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case "event":
        return {
          label: "EVENT",
          color: "#9333EA",
          backgroundColor: "#E9D5FF",
        };
      case "course":
        return {
          label: "COURSE",
          color: "#F97316",
          backgroundColor: "#FED7AA",
        };
      case "news":
        return {
          label: "NEWS",
          color: "#EC4899",
          backgroundColor: "#FCE7F3",
        };
      default:
        return {
          label: "",
          color: colors.text.primary,
          backgroundColor: colors.background.grey,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        {config.label && (
          <View style={styles.typeContainer}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: config.backgroundColor },
              ]}
            >
              <Text style={[styles.typeLabel, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
            {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
          </View>
        )}
        {onMenuPress && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {type === "course" && (
        <View style={styles.courseIconContainer}>
          <View
            style={[
              styles.courseIcon,
              { backgroundColor: config.backgroundColor },
            ]}
          >
            <Text style={[styles.courseIconText, { color: config.color }]}>
              {"<>"}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {courseInfo && (
        <Text style={styles.courseInfo}>
          {courseInfo.instructor} • {courseInfo.studentCount} Students
        </Text>
      )}

      {author && (
        <View style={styles.authorContainer}>
          <Avatar
            source={author.avatar}
            name={author.name}
            size={24}
            icon={author.icon}
            backgroundColor={author.backgroundColor}
            iconColor={author.iconColor}
          />
          <Text style={styles.authorName}>{author.name}</Text>
        </View>
      )}

      {type === "course" && (
        <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.muted,
  },
  menuButton: {
    padding: 4,
  },
  courseIconContainer: {
    marginBottom: 12,
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  courseIconText: {
    fontSize: 20,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseInfo: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  authorName: {
    fontSize: 13,
    color: colors.text.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
  arrowButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});

export default TrendingCard;












