import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/ui";
import { MessageBubble, MessageInput, DateSeparator } from "@/features/chat";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import useChatStore from "@/features/chat/store/useChatStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

export default function ChatDetailScreen() {
  const { chatId, isGroup: isGroupParam } = useLocalSearchParams<{
    chatId: string;
    isGroup?: string;
  }>();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuthStore();
  const {
    messages,
    isLoading,
    fetchMessages,
    sendMessage,
    sendGroupMessage,
    startPolling,
    stopPolling,
  } = useChatStore();

  const isGroup = isGroupParam === "true";
  const currentUserId = user?.id || 0;

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId, isGroup, currentUserId);
      startPolling(chatId, isGroup, currentUserId, 5000);
    }
    return () => stopPolling();
  }, [chatId, isGroup]);

  const handleSend = async () => {
    if (!message.trim() || !chatId) return;
    const text = message.trim();
    setMessage("");
    try {
      if (isGroup) {
        await sendGroupMessage(Number(chatId), text, currentUserId);
      } else {
        await sendMessage(Number(chatId), text, currentUserId);
      }
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    } catch {
      setMessage(text);
    }
  };

  const chatTitle = isGroup ? "Nhóm" : "Trò chuyện";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView
        style={[styles.container, { paddingBottom: insets.bottom }]}
        edges={["top"]}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.icon.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            {isGroup ? (
              <View style={styles.headerIconContainer}>
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={colors.text.white}
                />
              </View>
            ) : (
              <Avatar name={chatTitle} size={40} />
            )}
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerName} numberOfLines={1}>
                {chatTitle}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isGroup ? "Nhóm học tập" : "Đang hoạt động"}
              </Text>
            </View>
          </View>
          {!isGroup && (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons
                  name="videocam-outline"
                  size={24}
                  color={colors.teal.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <Ionicons
                  name="call-outline"
                  size={24}
                  color={colors.teal.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MessageBubble
              message={item.content}
              isOwn={item.isOwn}
              timestamp={item.timestamp}
              senderName={item.isOwn ? undefined : item.senderName}
              senderAvatar={
                !item.isOwn && item.senderAvatar
                  ? { uri: resolveImageUrl(item.senderAvatar) }
                  : undefined
              }
            />
          )}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color={colors.text.muted}
              />
              <Text style={styles.emptyText}>
                {isLoading ? "Đang tải..." : "Bắt đầu cuộc trò chuyện!"}
              </Text>
            </View>
          }
        />

        <MessageInput
          placeholder={
            isGroup ? "Nhắn tin cho nhóm..." : "Nhập tin nhắn..."
          }
          value={message}
          onChangeText={setMessage}
          onSend={handleSend}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: { padding: 4, marginRight: 12 },
  headerInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: { flex: 1 },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: { fontSize: 13, color: colors.text.muted },
  headerActions: { flexDirection: "row", gap: 12 },
  actionButton: { padding: 4 },
  messagesContent: { paddingVertical: 16, flexGrow: 1 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { fontSize: 15, color: colors.text.muted, marginTop: 12 },
});
