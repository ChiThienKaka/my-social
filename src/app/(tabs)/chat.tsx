import { Avatar, Chip, SearchBar } from "@/components/ui";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import { ChatItem, type ChatType } from "@/features/chat";
import useChatStore from "@/features/chat/store/useChatStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatListItem {
  id: string;
  rawId: string;
  type: ChatType;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isGroup: boolean;
  isAI?: boolean;
  avatar?: { uri: string } | number;
  isOnline?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor?: string;
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const { conversations, groups, fetchConversations, fetchGroups } =
    useChatStore();
  const userAvatarUrl = user?.avatar_url
    ? resolveImageUrl(user.avatar_url)
    : undefined;

  useFocusEffect(
    useCallback(() => {
      void fetchConversations();
      void fetchGroups();
    }, [fetchConversations, fetchGroups]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchConversations(), fetchGroups()]);
    setRefreshing(false);
  }, [fetchConversations, fetchGroups]);

  const groupChats = groups.map((item) => ({
    id: `g_${item.group.group_id}`,
    rawId: String(item.group.group_id),
    type: "group" as ChatType,
    name: item.group.group_name,
    avatar: item.group.cover_image
      ? { uri: resolveImageUrl(item.group.cover_image) }
      : undefined,
    lastMessage: "Nhấn để xem tin nhắn",
    timestamp: "",
    unreadCount: 0,
    isGroup: true,
  })) as ChatListItem[];

  const directChats = conversations.map((c) => ({
    id: `d_${c.user_id}`,
    rawId: String(c.user_id),
    type: "direct" as ChatType,
    name: c.full_name,
    avatar: c.avatar_url
      ? { uri: resolveImageUrl(c.avatar_url) }
      : undefined,
    lastMessage: c.last_message || "Bắt đầu trò chuyện",
    timestamp: c.last_message_at ? formatTime(c.last_message_at) : "",
    unreadCount: c.unread_count || 0,
    isOnline: false,
    isGroup: false,
  })) as ChatListItem[];

  const aiChat: ChatListItem = {
    id: "ai_assistant",
    rawId: "ai",
    type: "ai",
    name: "Trợ lý AI",
    lastMessage: "Hỏi việc làm, kỹ năng hoặc CV...",
    timestamp: "",
    unreadCount: 0,
    isGroup: false,
    isAI: true,
    icon: "sparkles-outline",
    iconBackgroundColor: "#19a49c",
  };

  let allChats: ChatListItem[] = [aiChat, ...groupChats, ...directChats];

  if (selectedFilter === "groups") allChats = groupChats;
  else if (selectedFilter === "direct") allChats = directChats;
  else if (selectedFilter === "ai") allChats = [aiChat];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    allChats = allChats.filter((c) => c.name.toLowerCase().includes(q));
  }

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "ai", label: "AI" },
    { id: "groups", label: "Nhóm" },
    { id: "direct", label: "Cá nhân" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar
            source={userAvatarUrl ? { uri: userAvatarUrl } : undefined}
            name={user?.name || "U"}
            size={40}
          />
          <Text style={styles.headerTitle}>Tin nhắn</Text>
        </View>
        <TouchableOpacity style={styles.composeButton} activeOpacity={0.7}>
          <View style={styles.composeIconContainer}>
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.text.white}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Tìm kiếm bạn bè, lớp..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              variant="light"
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allChats.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="chatbubbles-outline"
              size={48}
              color={colors.text.muted}
            />
            <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
          </View>
        )}
        {allChats.map((chat) => (
          <ChatItem
            key={chat.id}
            type={chat.type}
            name={chat.name}
            lastMessage={chat.lastMessage}
            timestamp={chat.timestamp}
            unreadCount={chat.unreadCount}
            avatar={chat.avatar}
            isOnline={(chat as any).isOnline}
            onPress={() =>
              router.push(
                `/chat/${chat.rawId}?isGroup=${chat.isGroup}&isAi=${chat.isAI ? "true" : "false"}` as any,
              )
            }
            icon={chat.icon}
            iconBackgroundColor={chat.iconBackgroundColor}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin}ph`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  } catch {
    return "";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text.primary },
  composeButton: { padding: 4 },
  composeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  filtersContainer: {
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filtersRow: { paddingHorizontal: 20 },
  chatList: { flex: 1, backgroundColor: colors.background.white },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: { fontSize: 15, color: colors.text.muted, marginTop: 12 },
});
