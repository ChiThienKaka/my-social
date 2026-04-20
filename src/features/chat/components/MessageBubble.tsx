import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";

interface MessageBubbleProps {
  message: string;
  isOwn?: boolean;
  timestamp: string;
  isRead?: boolean;
  senderName?: string;
  senderAvatar?: { uri: string } | number;
  fileAttachment?: {
    name: string;
    size: string;
    type: string;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn = false,
  timestamp,
  isRead,
  senderName,
  senderAvatar,
  fileAttachment,
}) => {
  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.containerOwn : styles.containerOther,
      ]}
    >
      {!isOwn && senderAvatar && (
        <Avatar source={senderAvatar} name={senderName} size={32} />
      )}
      <View
        style={[
          styles.bubbleContainer,
          isOwn && styles.bubbleContainerOwn,
        ]}
      >
        {!isOwn && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        {fileAttachment && (
          <View style={styles.fileContainer}>
            <View style={styles.fileIcon}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.text.primary}
              />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{fileAttachment.name}</Text>
              <Text style={styles.fileMeta}>
                {fileAttachment.size} • {fileAttachment.type}
              </Text>
            </View>
          </View>
        )}
        {message ? (
          <Text
            style={[
              styles.message,
              isOwn && styles.messageOwn,
            ]}
          >
            {message}
          </Text>
        ) : isOwn ? (
          <View style={styles.dotIndicator} />
        ) : null}
        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              isOwn && styles.timestampOwn,
            ]}
          >
            {timestamp}
          </Text>
          {isOwn && isRead !== undefined && (
            <Ionicons
              name={isRead ? "checkmark-done" : "checkmark"}
              size={14}
              color={isRead ? colors.teal.primary : colors.text.muted}
              style={styles.readIndicator}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  containerOwn: {
    justifyContent: "flex-end",
  },
  containerOther: {
    justifyContent: "flex-start",
  },
  bubbleContainer: {
    maxWidth: "75%",
    backgroundColor: colors.background.grey,
    borderRadius: 16,
    padding: 12,
    marginLeft: 8,
  },
  bubbleContainerOwn: {
    backgroundColor: colors.teal.primary,
    marginLeft: 0,
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.teal.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 20,
  },
  messageOwn: {
    color: colors.text.white,
  },
  fileContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: colors.text.muted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "flex-end",
  },
  timestamp: {
    fontSize: 11,
    color: colors.text.muted,
  },
  timestampOwn: {
    color: colors.text.white,
    opacity: 0.8,
  },
  readIndicator: {
    marginLeft: 4,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.white,
  },
});

export default MessageBubble;









