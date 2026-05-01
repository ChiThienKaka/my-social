import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar, Chip } from "@/components/ui";
import { JobCard, useJobStore } from "@/features/job";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { http } from "@/app/api/http";

interface AIJobItem {
  job_id: number;
  job_title: string;
  company_id: number;
  salary_max?: string;
  salary_min?: string;
  location_province?: string;
  application_deadline?: string;
}

interface AIChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  jobs?: AIJobItem[];
  created_at: string;
}

export default function RecruitScreen() {
  // Demo: số lượng đơn ứng tuyển (mock để app “sống” hơn)
  const demoAppliedCount = 3;
  const insets = useSafeAreaInsets();

  const {
    jobs,
    isLoading,
    isLoadingMore,
    currentPage,
    totalPages,
    error,
    searchQuery,
    selectedFilter,
    fetchJobs,
    setSearchQuery,
    setSelectedFilter,
  } = useJobStore();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const loadMoreInProgressRef = useRef(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const chatListRef = useRef<FlatList<AIChatMessage>>(null);

  const hasMore = currentPage < totalPages;

  const loadMore = useCallback(async () => {
    if (loadMoreInProgressRef.current || isLoading || isLoadingMore || !hasMore)
      return;
    loadMoreInProgressRef.current = true;
    try {
      await fetchJobs({ page: currentPage + 1, append: true });
    } finally {
      loadMoreInProgressRef.current = false;
    }
  }, [currentPage, totalPages, hasMore, isLoading, isLoadingMore, fetchJobs]);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "internship", label: "Thực tập" },
    { id: "part-time", label: "Bán thời gian" },
    { id: "remote", label: "Từ xa" },
  ];

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        setSearchQuery(localSearchQuery);
        fetchJobs({ search: localSearchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  useEffect(() => {
    // Refetch when filter changes
    fetchJobs();
  }, [selectedFilter]);

  const handleFilterPress = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleBookmarkPress = (jobId: number | string) => {
    // TODO: Implement bookmark toggle
    console.log("Toggle bookmark for job:", jobId);
  };

  const loadRecentAIMessages = useCallback(async () => {
    try {
      setIsChatLoading(true);
      const response = await http.get<AIChatMessage[]>("/api/chat-box/recent-messages");
      const payload = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as any)?.data)
          ? (response.data as any).data
          : [];
      setChatMessages(payload);
    } catch (error) {
      console.warn("[RecruitScreen.loadRecentAIMessages] error:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      loadRecentAIMessages();
    }
  }, [isChatOpen, loadRecentAIMessages]);

  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(
        () => chatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [chatMessages, isAIThinking, isChatOpen]);

  const handleSendAIQuestion = async () => {
    const question = chatQuestion.trim();
    if (!question || isAIThinking) return;

    const optimisticUserMessage: AIChatMessage = {
      id: Date.now(),
      role: "user",
      content: question,
      jobs: [],
      created_at: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, optimisticUserMessage]);
    setChatQuestion("");
    setIsAIThinking(true);

    try {
      const response = await http.post<{
        answer?: string;
        jobs?: AIJobItem[];
      }>("/api/chat-box/search", { question });

      const thinkingDelay = 1000 + Math.floor(Math.random() * 1000);
      await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

      const assistantMessage: AIChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          response.data?.answer || "Hệ thống đang gặp sự cố, vui lòng thử lại sau.",
        jobs: response.data?.jobs || [],
        created_at: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.warn("[RecruitScreen.handleSendAIQuestion] error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Không thể kết nối AI lúc này. Vui lòng thử lại.",
          jobs: [],
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const chatDisplayMessages: AIChatMessage[] = isAIThinking
    ? [
        ...chatMessages,
        {
          id: -Date.now(),
          role: "assistant",
          content: "AI đang suy nghĩ...",
          jobs: [],
          created_at: new Date().toISOString(),
        },
      ]
    : chatMessages;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cơ hội việc làm</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons
              name="options-outline"
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Tìm việc làm, công ty..."
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          onClear={() => {
            setLocalSearchQuery("");
            setSearchQuery("");
          }}
        />
        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              selected={selectedFilter === filter.id}
              onPress={() => handleFilterPress(filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Applied summary (mock) */}
      <View style={styles.appliedSummary}>
        <View style={styles.appliedLeft}>
          <View style={styles.appliedIcon}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.text.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.appliedTitle}>CV đã ứng tuyển</Text>
            <Text style={styles.appliedSubtitle}>
              Bạn đã nộp {demoAppliedCount} đơn — xem kết quả & lịch sử.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.appliedButton}
          onPress={() => router.push("/job/applications" as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.appliedButtonText}>Xem kết quả</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.teal.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => {
              router.push(`/job/${item.id}`);
            }}
            onBookmarkPress={() => handleBookmarkPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => fetchJobs()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? "Đang tải..." : "Không tìm thấy công việc nào"}
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.teal.primary} />
              <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
            </View>
          ) : null
        }
      />

      {isChatOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.chatOverlay}
        >
          <View style={[styles.chatContainer, { paddingTop: Math.max(insets.top, 12) }]}>
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <Ionicons name="sparkles" size={18} color={colors.text.white} />
                <Text style={styles.chatHeaderTitle}>Trợ lý AI tuyển dụng</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsChatOpen(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color={colors.text.white} />
              </TouchableOpacity>
            </View>

            <FlatList
              ref={chatListRef}
              data={chatDisplayMessages}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.chatListContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.chatEmpty}>
                  {isChatLoading ? (
                    <ActivityIndicator size="small" color={colors.teal.primary} />
                  ) : (
                    <Text style={styles.chatEmptyText}>
                      Hỏi AI để nhận gợi ý việc làm phù hợp.
                    </Text>
                  )}
                </View>
              }
              renderItem={({ item }) => {
                const isAssistant = item.role === "assistant";
                const isLoadingBubble = isAIThinking && item.id < 0;
                return (
                  <View
                    style={[
                      styles.chatBubble,
                      isAssistant ? styles.chatBubbleAssistant : styles.chatBubbleUser,
                    ]}
                  >
                    {isLoadingBubble ? (
                      <View style={styles.loadingRow}>
                        <ActivityIndicator
                          size="small"
                          color={colors.teal.primary}
                        />
                        <Text style={styles.chatBubbleTextAssistant}>{item.content}</Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.chatBubbleText,
                          isAssistant
                            ? styles.chatBubbleTextAssistant
                            : styles.chatBubbleTextUser,
                        ]}
                      >
                        {item.content}
                      </Text>
                    )}

                    {isAssistant &&
                      Array.isArray(item.jobs) &&
                      item.jobs.length > 0 &&
                      !isLoadingBubble && (
                        <View style={styles.jobsWrap}>
                          {item.jobs.map((job) => (
                            <TouchableOpacity
                              key={job.job_id}
                              style={styles.jobItem}
                              activeOpacity={0.8}
                              onPress={() => router.push(`/job/${job.job_id}` as any)}
                            >
                              <Text style={styles.jobTitle} numberOfLines={2}>
                                {job.job_title}
                              </Text>
                              <Text style={styles.jobMeta} numberOfLines={1}>
                                {job.location_province || "Không rõ địa điểm"}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                  </View>
                );
              }}
            />

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Nhập nhu cầu việc làm..."
                placeholderTextColor={colors.text.muted}
                value={chatQuestion}
                onChangeText={setChatQuestion}
                multiline
                maxLength={400}
              />
              <TouchableOpacity
                style={[
                  styles.chatSendButton,
                  !chatQuestion.trim() && styles.chatSendButtonDisabled,
                ]}
                onPress={handleSendAIQuestion}
                activeOpacity={0.8}
                disabled={!chatQuestion.trim() || isAIThinking}
              >
                <Ionicons name="send" size={18} color={colors.text.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <TouchableOpacity
        style={[styles.chatFab, isChatOpen && styles.chatFabHidden]}
        activeOpacity={0.85}
        onPress={() => setIsChatOpen((prev) => !prev)}
      >
        <Ionicons
          name={isChatOpen ? "close" : "sparkles-outline"}
          size={22}
          color={colors.text.white}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    gap: 16,
  },
  filtersScroll: {
    backgroundColor: colors.background.white,
  },
  filtersContainer: {
    gap: 8,
  },
  appliedSummary: {
    marginTop: 6,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 10,
  },
  appliedLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  appliedIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  appliedTitle: { fontSize: 15, fontWeight: "900", color: colors.text.primary },
  appliedSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: "600",
  },
  appliedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#CFFBEA",
    gap: 10,
  },
  appliedButtonText: { fontSize: 13, fontWeight: "900", color: colors.teal.primary },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.muted,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 14,
    color: colors.text.muted,
  },
  chatFab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  chatOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background.white,
    overflow: "hidden",
  },
  chatHeader: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatHeaderTitle: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: "700",
  },
  chatListContent: {
    padding: 12,
    gap: 8,
  },
  chatEmpty: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  chatEmptyText: {
    color: colors.text.muted,
    fontSize: 13,
  },
  chatBubble: {
    maxWidth: "90%",
    borderRadius: 12,
    padding: 10,
  },
  chatBubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: colors.teal.primary,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatBubbleTextAssistant: {
    color: colors.text.primary,
  },
  chatBubbleTextUser: {
    color: colors.text.white,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  jobsWrap: {
    marginTop: 8,
    gap: 8,
  },
  jobItem: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },
  jobMeta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text.muted,
  },
  chatInputRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  chatInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 96,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text.primary,
    fontSize: 14,
    backgroundColor: colors.background.grey,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
  },
  chatSendButtonDisabled: {
    opacity: 0.5,
  },
  chatFabHidden: {
    display: "none",
  },
});
