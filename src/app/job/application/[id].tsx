import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/constants/colors";
import { Avatar } from "@/components/ui";
import { Chip } from "@/components/ui";

type ApplicationStatus =
  | "Đang xét"
  | "Đã phỏng vấn"
  | "Không phù hợp"
  | "Đã trúng tuyển";

type Application = {
  applicationId: string;
  submittedAt: string;
  jobId: number | string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  cvFileName: string;
  cvType: "PDF" | "DOC";
  score?: number;
  timeline: { label: string; time: string; status?: ApplicationStatus }[];
  introLetter: string;
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

export default function ApplicationDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const mockDetail: Application[] = useMemo(
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
        introLetter:
          "Em gửi CV/Portfolio theo vị trí Frontend React. Em có kinh nghiệm làm dự án trường: xây UI, tích hợp API, tối ưu hiệu năng và làm việc nhóm theo Agile. Em sẵn sàng học nhanh và đóng góp ngay từ tuần đầu.",
        timeline: [
          { label: "Gửi hồ sơ thành công", time: "12/03 • 09:12" },
          { label: "HR kiểm tra CV", time: "13/03 • 16:20" },
          { label: "Chờ phản hồi", time: "Hôm nay" },
        ],
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
        introLetter:
          "Em quan tâm đến vai trò Backend Node.js. Em đã làm các module API, thiết kế schema, tối ưu truy vấn và xây auth cơ bản. Em mong được trao đổi thêm về kiến trúc, scale và test/CI trong dự án.",
        timeline: [
          { label: "Gửi hồ sơ thành công", time: "18/03 • 14:30" },
          { label: "Được mời phỏng vấn", time: "20/03 • 08:10" },
          { label: "Đã phỏng vấn kỹ thuật", time: "22/03 • 09:00" },
        ],
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
        introLetter:
          "Em mong có cơ hội làm QA part-time. Em có kinh nghiệm viết testcase, theo dõi bug, và phối hợp dev để xác nhận fix. Em sẵn sàng làm demo ngắn nếu được yêu cầu.",
        timeline: [
          { label: "Gửi hồ sơ thành công", time: "28/02 • 08:07" },
          { label: "HR phản hồi", time: "02/03 • 11:45" },
          { label: "Không phù hợp tiêu chí", time: "02/03 • 11:45" },
        ],
      },
    ],
    [],
  );

  const app = mockDetail.find((a) => a.applicationId === id) ?? mockDetail[0];

  const [expandedLetter, setExpandedLetter] = useState(false);

  const chips = ["Thông tin CV", "Thư giới thiệu", "Lịch sử"].map((t) => t);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết ứng tuyển</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusBox}>
          <View style={styles.statusRow}>
            <Ionicons
              name={
                app.status === "Đang xét"
                  ? "hourglass-outline"
                  : app.status === "Đã phỏng vấn"
                    ? "chatbubble-ellipses-outline"
                    : app.status === "Đã trúng tuyển"
                      ? "checkmark-circle-outline"
                      : "close-circle-outline"
              }
              size={20}
              color={colors.teal.primary}
            />
            <Text style={styles.statusText}>{app.status}</Text>
          </View>
          <Text style={styles.subText}>
            Nộp lúc: {formatDateVi(app.submittedAt)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vị trí</Text>
          <Text style={styles.jobTitle}>{app.jobTitle}</Text>
          <View style={styles.companyRow}>
            <Avatar name="You" size={28} />
            <View style={{ flex: 1 }}>
              <Text style={styles.companyName}>{app.companyName}</Text>
              <Text style={styles.locationText}>{app.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CV đã gửi</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaLeft}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.teal.primary}
              />
              <Text style={styles.metaText}>
                {app.cvFileName} • {app.cvType}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => console.log("Mock open CV:", app.cvFileName)}
              style={styles.mockLink}
              activeOpacity={0.7}
            >
              <Text style={styles.mockLinkText}>Xem</Text>
            </TouchableOpacity>
          </View>
          {typeof app.score === "number" && (
            <Text style={styles.scoreText}>Điểm hồ sơ (demo): {app.score}/100</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch sử xét tuyển</Text>
          <View style={styles.timeline}>
            {app.timeline.map((t, idx) => (
              <View key={`${t.label}-${idx}`} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>{t.label}</Text>
                  <Text style={styles.timelineTime}>{t.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thư giới thiệu</Text>
          <Text style={styles.letterText}>
            {expandedLetter ? app.introLetter : `${app.introLetter.slice(0, 220)}...`}
          </Text>
          <TouchableOpacity
            onPress={() => setExpandedLetter((v) => !v)}
            style={styles.readMoreRow}
            activeOpacity={0.7}
          >
            <Text style={styles.readMoreText}>
              {expandedLetter ? "Thu gọn" : "Xem thêm"}
            </Text>
            <Ionicons
              name={expandedLetter ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.teal.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => router.push(`/job/${app.jobId}` as any)}
            activeOpacity={0.7}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryBtnText}>Xem lại tin tuyển dụng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("Mock message HR")}
            activeOpacity={0.7}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Liên hệ HR (demo)</Text>
          </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.text.primary },
  scroll: { flex: 1 },
  statusBox: {
    backgroundColor: colors.background.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { fontSize: 16, fontWeight: "800", color: colors.text.primary },
  subText: { marginTop: 6, fontSize: 13, color: colors.text.muted, fontWeight: "600" },
  section: {
    marginTop: 14,
    backgroundColor: colors.background.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sectionTitle: { fontSize: 14, color: colors.text.secondary, fontWeight: "800", marginBottom: 10 },
  jobTitle: { fontSize: 16, fontWeight: "800", color: colors.text.primary },
  companyRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  companyName: { fontSize: 13, fontWeight: "700", color: colors.text.primary },
  locationText: { marginTop: 2, fontSize: 12, color: colors.text.muted },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  metaLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  metaText: { flex: 1, fontSize: 13, color: colors.text.secondary, fontWeight: "700" },
  mockLink: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "#ECFDF5" },
  mockLinkText: { color: colors.teal.primary, fontWeight: "800" },
  scoreText: { marginTop: 10, fontSize: 12, color: colors.text.muted, fontWeight: "700" },
  timeline: { gap: 12 },
  timelineItem: { flexDirection: "row", gap: 10 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal.primary,
    marginTop: 5,
  },
  timelineContent: { flex: 1 },
  timelineLabel: { fontSize: 13, fontWeight: "800", color: colors.text.primary },
  timelineTime: { marginTop: 4, fontSize: 12, color: colors.text.muted, fontWeight: "700" },
  letterText: { fontSize: 13, color: colors.text.secondary, lineHeight: 20, fontWeight: "600" },
  readMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  readMoreText: { color: colors.teal.primary, fontWeight: "800" },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.white,
  },
  secondaryBtnText: { color: colors.text.primary, fontWeight: "800" },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.teal.primary,
  },
  primaryBtnText: { color: colors.text.white, fontWeight: "900" },
});

