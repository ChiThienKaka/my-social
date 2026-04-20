import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";
import type { NotificationType } from "../types";

interface NotificationItemProps {
  avatar?: {
    source?: { uri: string } | number;
    name?: string;
    badge?: {
      icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
      backgroundColor: string;
      iconColor: string;
    };
    backgroundColor?: string;
    icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    iconColor?: string;
  };
  title?: string;
  message: string;
  type: NotificationType;
  timeAgo: string;
  unread?: boolean;
  onPress?: () => void;
  boldText?: string[];
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  avatar,
  title,
  message,
  type,
  timeAgo,
  unread = false,
  onPress,
  boldText = [],
}) => {
  const getTypeColor = () => {
    switch (type) {
      case "academic":
        return colors.teal.primary;
      case "social":
        return colors.teal.primary;
      case "system":
        return "#F97316"; // Orange
      case "event":
        return "#9333EA"; // Purple
      default:
        return colors.text.secondary;
    }
  };

  const renderTextWithBold = (text: string, boldWords: string[]) => {
    if (boldWords.length === 0) return text;

    const parts = text.split(new RegExp(`(${boldWords.join("|")})`, "gi"));
    return parts.map((part, index) => {
      const isBold = boldWords.some(
        (word) => part.toLowerCase() === word.toLowerCase()
      );
      return isBold ? (
        <Text key={index} style={styles.boldText}>
          {part}
        </Text>
      ) : (
        part
      );
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, unread && styles.containerUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {avatar && (
            <Avatar
              source={avatar.source}
              name={avatar.name}
              size={48}
              badge={avatar.badge}
              backgroundColor={avatar.backgroundColor}
              icon={avatar.icon}
              iconColor={avatar.iconColor}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>
            {renderTextWithBold(message, boldText)}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.type, { color: getTypeColor() }]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
            <Text style={styles.separator}> • </Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
        </View>
        {unread && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background.white,
  },
  containerUnread: {
    backgroundColor: colors.background.light,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "600",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  type: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  separator: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal.primary,
    marginLeft: 8,
    marginTop: 4,
  },
});

export default NotificationItem;







