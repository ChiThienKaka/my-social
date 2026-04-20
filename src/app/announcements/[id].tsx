import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/constants/colors";

type Announcement = {
  id: string;
  tag: string;
  author: string;
  timestamp: string;
  title: string;
  description: string;
  backgroundImage?: { uri: string };
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    tag: "THÔNG BÁO",
    author: "Phòng Đào tạo",
    timestamp: "Hôm nay",
    title: "Lịch đăng ký học phần học kỳ II năm học 2025-2026",
    description:
      "Sinh viên Trường Đại học Thủ Dầu Một chú ý thời gian đăng ký học phần trực tuyến qua hệ thống Portal.\n\nThời gian bắt đầu: 01/04/2026.\nThời gian kết thúc: 10/04/2026.\n\nMọi thắc mắc liên hệ Phòng Đào tạo.",
    backgroundImage: {
      uri: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/8/23/1084256/295497942_2922294937.jpg",
    },
  },
  {
    id: "ann-2",
    tag: "THÔNG BÁO",
    author: "Trung tâm TT&TV Sinh viên",
    timestamp: "Hôm nay",
    title: "Hướng dẫn quy trình đăng ký học bổng học kỳ II",
    description:
      "Sinh viên có nhu cầu đăng ký học bổng năm học 2025-2026 vui lòng hoàn tất hồ sơ trước ngày 05/04/2026.\n\nNộp hồ sơ theo hướng dẫn tại Portal.",
    backgroundImage: {
      uri: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900",
    },
  },
  {
    id: "ann-3",
    tag: "THÔNG BÁO",
    author: "Phòng Công tác SV",
    timestamp: "07:30 hôm nay",
    title: "Cập nhật quy định xét học phần thay thế và miễn học phần",
    description:
      "Nhà trường cập nhật quy định xét học phần thay thế/miễn học phần đối với sinh viên đủ điều kiện.\n\nVui lòng đọc kỹ biểu mẫu trước khi nộp.\n\nThời gian nộp từ 08/04 đến 18/04/2026.",
    backgroundImage: {
      uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900",
    },
  },
];

export default function AnnouncementDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const announcement = useMemo(
    () => ANNOUNCEMENTS.find((a) => a.id === params.id) ?? null,
    [params.id],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.icon.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!announcement ? (
          <View style={styles.empty}>
            <Ionicons
              name="document-outline"
              size={48}
              color={colors.text.muted}
            />
            <Text style={styles.emptyText}>Không tìm thấy bài viết</Text>
          </View>
        ) : (
          <>
            {announcement.backgroundImage ? (
              <ImageBackground
                source={announcement.backgroundImage}
                style={styles.hero}
                resizeMode="cover"
              >
                <View style={styles.heroOverlay} />
                <View style={styles.heroTop}>
                  <Text style={styles.tag}>{announcement.tag}</Text>
                  <Text style={styles.meta}>
                    {announcement.author} • {announcement.timestamp}
                  </Text>
                </View>
              </ImageBackground>
            ) : null}

            <View style={styles.body}>
              <Text style={styles.heading}>{announcement.title}</Text>
              <Text style={styles.description}>{announcement.description}</Text>
            </View>

            <View style={styles.footerHint}>
              <Text style={styles.footerText}>Bạn có thể quay lại để xem các bài khác.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.background.white,
  },
  iconButton: { width: 40, height: 40, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  scroll: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
  empty: { padding: 24, alignItems: "center" },
  emptyText: { marginTop: 8, color: colors.text.muted },
  hero: { height: 160, justifyContent: "flex-end" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  heroTop: { padding: 16 },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: colors.text.white,
    fontWeight: "700",
    fontSize: 11,
  },
  meta: { marginTop: 8, color: colors.text.white, opacity: 0.95 },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heading: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
    whiteSpace: "pre-wrap" as any,
  },
  footerHint: { paddingHorizontal: 16, paddingTop: 16 },
  footerText: { color: colors.text.muted, fontSize: 13 },
});

