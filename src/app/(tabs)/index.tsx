import React, { useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  SectionHeader,
  AnnouncementCard,
  DeadlineCard,
  EventCard,
  ConfessionCard,
} from "@/components/ui";
import { PostCard } from "@/features/post";
import colors from "@/constants/colors";
import usePostStore from "@/features/post/store/usePostStore";
import { router } from "expo-router";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { formatPostTime } from "@/features/post/utils/formatTime";

export default function CampusFeedScreen() {
  const { posts, fetchPosts, isLoading } = usePostStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleViewAllAnnouncements = () =>
    router.push("/announcements" as any);
  const handleViewAllDeadlines = () => router.push("/deadlines" as any);
  const handleViewAllEvents = () => router.push("/events" as any);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, []);

  const featuredPost = posts[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(tabs)/search" as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Thông báo chính thức */}
        <View style={styles.section}>
          <SectionHeader
            title="Thông báo chính thức"
            icon="megaphone-outline"
            iconColor="#EF4444"
            viewAllLabel="Xem tất cả"
            style={styles.sectionHeader}
            onViewAllPress={handleViewAllAnnouncements}
          />
          <AnnouncementCard
            tag="THÔNG BÁO"
            author="Phòng Đào tạo"
            timestamp="Hôm nay"
            title="Lịch đăng ký học phần học kỳ II năm học 2025-2026"
            description="Sinh viên Trường Đại học Thủ Dầu Một chú ý thời gian đăng ký học phần trực tuyến qua hệ thống Portal. Thời gian bắt đầu: 01/04/2026. Mọi thắc mắc liên hệ Phòng Đào tạo."
            backgroundImage={{
              uri: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/8/23/1084256/295497942_2922294937.jpg",
            }}
            onPress={() => router.push("/announcements/ann-1" as any)}
            onBookmarkPress={() => {}}
          />
        </View>

        {/* Hạn chót học vụ */}
        <View style={styles.section}>
          <SectionHeader
            title="Hạn chót học vụ"
            icon="calendar-outline"
            viewAllLabel="Xem tất cả"
            onViewAllPress={handleViewAllDeadlines}
            style={styles.sectionHeader}
          />
          <DeadlineCard
            tag="DEADLINE"
            author="Phòng Đào tạo"
            timestamp="Hôm nay"
            title="Hạn nộp học phí học kỳ II (2025-2026)"
            description="Sinh viên hoàn thành nộp học phí trước ngày 15/04/2026 để tránh bị hủy đăng ký học phần."
            month="THG 4"
            day="15"
            onPress={() => router.push("/deadlines/dl-1" as any)}
          />
        </View>

        {/* Sự kiện sắp tới */}
        <View style={styles.section}>
          <SectionHeader
            title="Sự kiện sắp tới"
            icon="ticket-outline"
            viewAllLabel="Xem tất cả"
            onViewAllPress={handleViewAllEvents}
            style={styles.sectionHeader}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScroll}
          >
            <EventCard
              tag="SỰ KIỆN"
              author="Đoàn Thanh niên"
              title="Ngày hội Việc làm TDMU 2026"
              time="Thứ 7, 05/04 • 8:00 SA"
              backgroundImage={{
                uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
              }}
              onPress={() => router.push("/events/ev-1" as any)}
            />
            <EventCard
              tag="THỂ THAO"
              author="CLB Thể thao"
              title="Giải Bóng đá Sinh viên TDMU"
              time="Chủ nhật, 06/04 • 15:00"
              onPress={() => router.push("/events/ev-2" as any)}
            />
          </ScrollView>
        </View>

        {/* Bài viết nổi bật - from real API */}
        <View style={styles.section}>
          <SectionHeader
            title="Bài viết nổi bật"
            icon="star"
            iconColor="#FBBF24"
            style={styles.sectionHeader}
          />
          {isLoading && !featuredPost ? (
            <ActivityIndicator
              color={colors.teal.primary}
              style={{ paddingVertical: 20 }}
            />
          ) : featuredPost ? (
            <View style={styles.postCardWrapper}>
              <PostCard
                author={{
                  name: featuredPost.author.name,
                  avatar_url:
                    (featuredPost.author.avatar_url &&
                      resolveImageUrl(featuredPost.author.avatar_url)) ||
                    "",
                  role: "Sinh viên TDMU",
                  icon: "person-outline",
                  backgroundColor: "#9333EA",
                  iconColor: colors.text.white,
                }}
                timestamp={formatPostTime(featuredPost.created_at)}
                content={featuredPost.content}
                image={
                  featuredPost.media?.[0]?.url
                    ? { uri: resolveImageUrl(featuredPost.media[0].url)! }
                    : undefined
                }
                likes={featuredPost.total_like}
                comments={featuredPost.total_comment}
                onPress={() =>
                  router.push(
                    `/post/details?postId=${featuredPost.id}` as any,
                  )
                }
              />
            </View>
          ) : (
            <View style={styles.emptyPost}>
              <Text style={styles.emptyPostText}>Chưa có bài viết nào</Text>
            </View>
          )}
        </View>

        {/* Confession */}
        <View style={styles.section}>
          <SectionHeader
            title="Confession TDMU"
            icon="chatbubble-ellipses-outline"
            iconColor="#FBBF24"
            style={styles.sectionHeader}
          />
          <ConfessionCard
            tag="CONFESSION"
            author="Ẩn danh"
            timestamp="30 phút trước"
            content="Thư viện trường mở cửa sớm hơn mùa thi rồi mọi người ơi, 6h30 đã có chỗ ngồi máy lạnh. Ai cần ôn thi thì tranh thủ nha! 📚"
            onPress={() => {}}
            onSavePress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text.primary },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerButton: { padding: 4 },
  scrollView: { flex: 1 },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: colors.background.white,
    marginBottom: 8,
  },
  sectionHeader: { marginBottom: 16 },
  eventsScroll: { paddingRight: 20 },
  postCardWrapper: { marginBottom: 8 },
  emptyPost: { paddingVertical: 20, alignItems: "center" },
  emptyPostText: { fontSize: 14, color: colors.text.muted },
});
