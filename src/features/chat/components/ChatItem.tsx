import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";
import type { ChatType } from "../types";

interface ChatItemProps {
  type: ChatType;
  name: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isRead?: boolean;
  isOnline?: boolean;
  avatar?: { uri: string } | number;
  icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  iconBackgroundColor?: string;
  iconColor?: string;
  groupIcon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  onPress?: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  type,
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isRead = true,
  isOnline,
  avatar,
  icon,
  iconBackgroundColor,
  iconColor,
  groupIcon,
  onPress,
}) => {
  const renderAvatar = () => {
    if (avatar && (type === "direct" || type === "group")) {
      return (
        <View style={styles.avatarContainer}>
          <Avatar source={avatar} name={name} size={56} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
      );
    }

    if (icon) {
      return (
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: iconBackgroundColor || colors.teal.primary },
            ]}
          >
            <Ionicons
              name={icon}
              size={24}
              color={iconColor || colors.text.white}
            />
          </View>
          {groupIcon && (
            <View style={styles.groupIconBadge}>
              <Ionicons
                name={groupIcon}
                size={12}
                color={colors.text.secondary}
              />
            </View>
          )}
        </View>
      );
    }

    return (
      <Avatar
        name={name}
        size={56}
        backgroundColor={iconBackgroundColor}
        icon={icon}
        iconColor={iconColor}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderAvatar()}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {timestamp && (
            <Text
              style={[
                styles.timestamp,
                unreadCount > 0 && styles.timestampUnread,
              ]}
            >
              {timestamp}
            </Text>
          )}
        </View>
        {lastMessage && (
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
            {isRead && unreadCount === 0 && type === "direct" && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color={colors.teal.primary}
                style={styles.readIndicator}
              />
            )}
            {!isRead && unreadCount === 0 && type === "direct" && (
              <View style={styles.unreadDot} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background.white,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  groupIconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.grey,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    color: colors.text.muted,
    marginLeft: 8,
  },
  timestampUnread: {
    color: colors.teal.primary,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.white,
  },
  readIndicator: {
    marginLeft: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.teal.primary,
    marginLeft: 4,
  },
});

export default ChatItem;

