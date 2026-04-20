import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/constants/colors";

type Deadline = {
  id: string;
  tag: string;
  author: string;
  timestamp: string;
  title: string;
  description: string;
  month: string;
  day: string;
};

const DEADLINES: Deadline[] = [
  {
    id: "dl-1",
    tag: "DEADLINE",
    author: "Phòng Đào tạo",
    timestamp: "Hôm nay",
    title: "Hạn nộp học phí học kỳ II (2025-2026)",
    description:
      "Sinh viên hoàn thành nộp học phí trước ngày 15/04/2026 để tránh bị hủy đăng ký học phần.\n\nGợi ý: kiểm tra thông tin học phần trên Portal trước khi thanh toán.",
    month: "THG 4",
    day: "15",
  },
  {
    id: "dl-2",
    tag: "DEADLINE",
    author: "Phòng Khảo thí",
    timestamp: "Hôm nay",
    title: "Hạn nộp đơn xin phúc khảo điểm",
    description:
      "Thời hạn nộp đơn xin phúc khảo điểm kỳ học kỳ I (2025-2026) từ 20/04 đến 27/04/2026.\n\nNộp tại Portal và đính kèm minh chứng (nếu có).",
    month: "THG 4",
    day: "27",
  },
  {
    id: "dl-3",
    tag: "DEADLINE",
    author: "Trung tâm Hỗ trợ SV",
    timestamp: "07:00 hôm nay",
    title: "Hạn chót đăng ký tham gia Câu lạc bộ học thuật",
    description:
      "Đăng ký tham gia Câu lạc bộ học thuật khóa 2026.\n\nĐóng form trước 06/05/2026 để BTC kịp tổng hợp danh sách.",
    month: "THG 5",
    day: "06",
  },
];

export default function DeadlineDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const deadline = useMemo(
    () => DEADLINES.find((d) => d.id === params.id) ?? null,
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
        {!deadline ? (
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
            <View style={styles.pillRow}>
              <Text style={styles.tag}>{deadline.tag}</Text>
              <View style={styles.dateBox}>
                <Text style={styles.month}>{deadline.month}</Text>
                <Text style={styles.day}>{deadline.day}</Text>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.meta}>
                {deadline.author} • {deadline.timestamp}
              </Text>
              <Text style={styles.heading}>{deadline.title}</Text>
              <Text style={styles.description}>{deadline.description}</Text>

              <View style={styles.hintCard}>
                <Text style={styles.hintTitle}>Gợi ý thao tác</Text>
                <Text style={styles.hintText}>
                  Chuẩn bị đầy đủ thông tin, nộp sớm để tránh trễ hạn do lỗi hệ thống.
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
  pillRow: { paddingHorizontal: 16, paddingTop: 16 },
  tag: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    color: colors.text.white,
    fontWeight: "700",
    fontSize: 11,
  },
  dateBox: {
    marginTop: 12,
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  month: { fontSize: 12, fontWeight: "700", color: colors.text.white, textTransform: "uppercase" },
  day: { fontSize: 28, fontWeight: "800", color: colors.text.white, marginTop: 4 },
  body: { paddingHorizontal: 16, paddingTop: 14 },
  meta: { color: colors.text.muted, marginBottom: 8 },
  heading: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: colors.text.secondary,
    whiteSpace: "pre-wrap" as any,
  },
  hintCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.background.white,
  },
  hintTitle: { fontWeight: "700", color: colors.text.primary, marginBottom: 6 },
  hintText: { color: colors.text.secondary, fontSize: 13, lineHeight: 19 },
});

