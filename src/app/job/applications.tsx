import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/constants/colors";
import { Chip, Avatar } from "@/components/ui";

type ApplicationStatus =
  | "Đang xét"
  | "Đã phỏng vấn"
  | "Không phù hợp"
  | "Đã trúng tuyển";

type Application = {
  applicationId: string;
  submittedAt: string; // ISO string
  jobId: number | string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  cvFileName: string;
  cvType: "PDF" | "DOC";
  score?: number; // mock
  lastUpdate: string;
};

const STATUS_META: Record<
  ApplicationStatus,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  "Đang xét": {
    icon: "hourglass-outline",
    color: colors.teal.primary,
    bg: "#ECFDF5",
  },
  "Đã phỏng vấn": {
    icon: "chatbubble-ellipses-outline",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  "Không phù hợp": {
    icon: "close-circle-outline",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  "Đã trúng tuyển": {
    icon: "checkmark-circle-outline",
    color: "#16A34A",
    bg: "#ECFDF5",
  },
};

function formatDateVi(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ApplicationsScreen() {
  const mockApplications: Application[] = useMemo(
    () => [
      {
        applicationId: "app-1001",
        submittedAt: "2026-03-12T09:10:00.000Z",
        jobId: 501,
        jobTitle: "Thực tập Frontend React (Mobile Web)",
        companyName: "Công ty CP Công nghệ Ares",
        location: "Bình Dương • Từ xa 50%",
        status: "Đang xét",
        cvFileName: "CV_DangHuuDanh_Frontend.pdf",
        cvType: "PDF",
        score: 68,
        lastUpdate: "Hệ thống đã nhận hồ sơ. Chờ phản hồi từ HR.",
      },
      {
        applicationId: "app-1002",
        submittedAt: "2026-03-18T14:25:00.000Z",
        jobId: 612,
        jobTitle: "Thực tập Backend Node.js (API)",
        companyName: "Startup Innovation Hub",
        location: "Thủ Dầu Một • Hybrid",
        status: "Đã phỏng vấn",
        cvFileName: "CV_DangHuuDanh_Backend.pdf",
        cvType: "PDF",
        score: 81,
        lastUpdate: "Đã xong vòng phỏng vấn kỹ thuật. Chờ vòng cuối.",
      },
      {
        applicationId: "app-1003",
        submittedAt: "2026-02-28T08:05:00.000Z",
        jobId: 430,
        jobTitle: "Part-time QA Manual (Testcase & Bug report)",
        companyName: "Doanh nghiệp DEF",
        location: "TP.HCM • Part-time",
        status: "Không phù hợp",
        cvFileName: "CV_DangHuuDanh_QA.doc",
        cvType: "DOC",
        score: 0,
        lastUpdate: "Hồ sơ chưa phù hợp tiêu chí. Bạn có thể thử lại vị trí khác.",
      },
    ],
    [],
  );

  const [filter, setFilter] = useState<
    "all" | "Đang xét" | "Đã phỏng vấn" | "Không phù hợp" | "Đã trúng tuyển"
  >("all");

  const filtered = useMemo(() => {
    if (filter === "all") return mockApplications;
    return mockApplications.filter((a) => a.status === filter);
  }, [filter, mockApplications]);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "Đang xét", label: "Đang xét" },
    { id: "Đã phỏng vấn", label: "Đã phỏng vấn" },
    { id: "Không phù hợp", label: "Không phù hợp" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kết quả ứng tuyển</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.icon.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            {filters.map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                selected={filter === (f.id as any)}
                onPress={() => setFilter(f.id as any)}
                variant="light"
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.applicationId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="document-text-outline"
              size={46}
              color={colors.text.muted}
            />
            <Text style={styles.emptyText}>Không có đơn nào phù hợp bộ lọc</Text>
          </View>
        }
        renderItem={({ item }) => {
          const meta = STATUS_META[item.status];
          return (
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/job/application/${item.applicationId}` as any,
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.statusPill,
                      { backgroundColor: meta.bg, borderColor: meta.bg },
                    ]}
                  >
                    <Ionicons name={meta.icon} size={16} color={meta.color} />
                    <Text style={[styles.statusText, { color: meta.color }]}>
                      {item.status}
                    </Text>
                  </View>

                  <Text style={styles.submittedAt}>{formatDateVi(item.submittedAt)}</Text>
                </View>

                <Text style={styles.jobTitle} numberOfLines={2}>
                  {item.jobTitle}
                </Text>
                <Text style={styles.companyText}>{item.companyName}</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>

                <View style={styles.cvRow}>
                  <Ionicons
                    name="file-tray-full-outline"
                    size={16}
                    color={colors.teal.primary}
                  />
                  <Text style={styles.cvText} numberOfLines={1}>
                    CV: {item.cvFileName} • {item.cvType}
                  </Text>
                </View>

                <Text style={styles.lastUpdate} numberOfLines={2}>
                  Cập nhật: {item.lastUpdate}
                </Text>

                <View style={styles.cardFooter}>
                  <Avatar name="You" size={28} />
                  <Text style={styles.moreText}>Xem chi tiết</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.icon.secondary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: colors.text.primary },
  iconButton: { padding: 4 },
  filtersWrap: {
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    paddingVertical: 10,
  },
  filtersRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16 },
  listContent: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.background.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  submittedAt: { fontSize: 12, color: colors.text.muted, fontWeight: "600" },
  jobTitle: { marginTop: 10, fontSize: 16, fontWeight: "700", color: colors.text.primary },
  companyText: { marginTop: 4, fontSize: 13, color: colors.text.secondary, fontWeight: "600" },
  locationText: { marginTop: 2, fontSize: 12, color: colors.text.muted },
  cvRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  cvText: { flex: 1, fontSize: 12, color: colors.text.secondary, fontWeight: "600" },
  lastUpdate: { marginTop: 10, fontSize: 12, color: colors.text.muted, lineHeight: 18 },
  cardFooter: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  moreText: { flex: 1, color: colors.teal.primary, fontSize: 13, fontWeight: "700" },
  empty: { paddingVertical: 60, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 14, color: colors.text.muted, textAlign: "center", paddingHorizontal: 20 },
});

