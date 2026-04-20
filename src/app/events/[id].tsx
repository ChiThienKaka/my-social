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

type EventItem = {
  id: string;
  tag: string;
  author: string;
  title: string;
  time: string;
  backgroundImage?: { uri: string };
  description: string;
  location: string;
};

const EVENTS: EventItem[] = [
  {
    id: "ev-1",
    tag: "SỰ KIỆN",
    author: "Đoàn Thanh niên",
    title: "Ngày hội Việc làm TDMU 2026",
    time: "Thứ 7, 05/04 • 8:00 SA",
    backgroundImage: {
      uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200",
    },
    location: "Sảnh A - Trung tâm sự kiện",
    description:
      "Ngày hội việc làm dành cho sinh viên TDMU với nhiều doanh nghiệp tham gia.\n\nNội dung chính:\n• Kết nối trực tiếp với HR\n• Workshops ngắn về kỹ năng phỏng vấn\n• Gian tuyển dụng & tư vấn định hướng nghề nghiệp.\n\nĐăng ký tham dự tại Portal trước 03/04/2026.",
  },
  {
    id: "ev-2",
    tag: "THỂ THAO",
    author: "CLB Thể thao",
    title: "Giải Bóng đá Sinh viên TDMU",
    time: "Chủ nhật, 06/04 • 15:00",
    location: "Sân vận động Trường",
    description:
      "Giải đấu bóng đá dành cho các lớp sinh viên và CLB.\n\nLịch thi đấu sẽ được cập nhật sau khi xác nhận danh sách đội.\n\nĐến sớm để cổ vũ và nhận vé vào cổng.",
  },
  {
    id: "ev-3",
    tag: "WORKSHOP",
    author: "Khoa CNTT",
    title: "Workshop: Xây dựng CV nổi bật & phỏng vấn nhanh",
    time: "Thứ 4, 10/04 • 17:30",
    backgroundImage: {
      uri: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    },
    location: "Phòng LAB 2 - Nhà điều hành",
    description:
      "Workshop tập trung vào cách viết CV theo ATS, cách chuẩn bị cho vòng phỏng vấn kỹ thuật.\n\nBạn sẽ nhận:\n• Mẫu CV tham khảo\n• Checklist chuẩn bị phỏng vấn\n• Mini mock-interview theo nhóm.",
  },
];

export default function EventDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const event = useMemo(() => EVENTS.find((e) => e.id === params.id) ?? null, [params.id]);

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
        {!event ? (
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
            {event.backgroundImage ? (
              <ImageBackground
                source={event.backgroundImage}
                style={styles.hero}
                resizeMode="cover"
              >
                <View style={styles.heroOverlay} />
                <View style={styles.heroTop}>
                  <Text style={styles.tag}>{event.tag}</Text>
                  <Text style={styles.meta}>
                    {event.author} • {event.time}
                  </Text>
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.nonHeroTop}>
                <Text style={styles.tag}>{event.tag}</Text>
                <Text style={styles.meta}>
                  {event.author} • {event.time}
                </Text>
              </View>
            )}

            <View style={styles.body}>
              <Text style={styles.heading}>{event.title}</Text>
              <Text style={styles.locationLabel}>Địa điểm</Text>
              <Text style={styles.locationValue}>{event.location}</Text>
              <Text style={styles.description}>{event.description}</Text>

              <View style={styles.actionHint}>
                <Text style={styles.actionHintText}>
                  Nếu muốn, bạn có thể thêm tính năng “Đăng ký tham dự” ở vòng sau.
                </Text>
              </View>
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
  hero: { height: 170, justifyContent: "flex-end" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  heroTop: { padding: 16 },
  nonHeroTop: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: colors.text.white,
    fontWeight: "700",
    fontSize: 11,
  },
  meta: { marginTop: 8, color: colors.text.white, opacity: 0.95 },
  body: { paddingHorizontal: 16, paddingTop: 16 },
  heading: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  locationLabel: { marginTop: 12, color: colors.text.muted, fontSize: 13, fontWeight: "700" },
  locationValue: {
    marginTop: 6,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
    whiteSpace: "pre-wrap" as any,
  },
  actionHint: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.background.white,
  },
  actionHintText: { color: colors.text.secondary, fontSize: 13, lineHeight: 19 },
});

