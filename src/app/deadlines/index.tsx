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
import { router } from "expo-router";
import colors from "@/constants/colors";
import { DeadlineCard } from "@/components/ui";

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

export default function DeadlinesScreen() {
  const deadlines = useMemo<Deadline[]>(
    () => [
      {
        id: "dl-1",
        tag: "DEADLINE",
        author: "Phòng Đào tạo",
        timestamp: "Hôm nay",
        title: "Hạn nộp học phí học kỳ II (2025-2026)",
        description:
          "Sinh viên hoàn thành nộp học phí trước ngày 15/04/2026 để tránh bị hủy đăng ký học phần.",
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
          "Thời hạn nộp đơn xin phúc khảo điểm kỳ học kỳ I (2025-2026) từ 20/04 đến 27/04/2026. Nộp tại Portal.",
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
          "Đăng ký tham gia Câu lạc bộ học thuật khóa 2026. Đóng form trước 06/05/2026.",
        month: "THG 5",
        day: "06",
      },
    ],
    [],
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
        <Text style={styles.title}>Hạn chót học vụ</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {deadlines.map((d) => (
          <DeadlineCard
            key={d.id}
            tag={d.tag}
            author={d.author}
            timestamp={d.timestamp}
            title={d.title}
            description={d.description}
            month={d.month}
            day={d.day}
            onPress={() => router.push(`/deadlines/${d.id}` as any)}
          />
        ))}
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
  contentContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
});

