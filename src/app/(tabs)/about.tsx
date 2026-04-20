import React, { useEffect, useCallback } from "react";
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
  Avatar,
  Title,
  StatCard,
  CourseCard,
  ActionButton,
  DetailRow,
  Button,
} from "@/components/ui";
import colors from "@/constants/colors";
import { router } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuthStore } from "@/features/auth";
import useProfileStore from "@/features/profile/store/useProfileStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = useCallback(() => {
    fetchProfile();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
      await useAuthStore.getState().clearAuth();
    }
    router.replace("/(auth)/login");
  };

  const displayName = profile?.full_name || user?.name || "Sinh viên";
  const displayEmail = profile?.email || user?.email || "";
  const avatarUri = profile?.avatar_url || user?.avatar_url;
  const faculty = profile?.faculty || "Khoa Công nghệ thông tin";
  const major = profile?.major || "Công nghệ thông tin";
  const studentCode = profile?.student_code || user?.student_code || "";
  const gpa = profile?.gpa != null ? String(profile.gpa) : "—";
  const creditsDisplay =
    profile?.credits_completed != null && profile?.credits_total != null
      ? `${profile.credits_completed}/${profile.credits_total}`
      : "—";
  const academicYear = profile?.academic_year || "—";
  const className = profile?.class_name || "—";
  const statusLabel = profile?.status === "active" ? "Đang học" : (profile?.status || "Đang học");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Title variant="h2" weight="bold" style={styles.headerTitle}>
          Hồ sơ
        </Title>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.icon.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Avatar
                source={avatarUri ? { uri: resolveImageUrl(avatarUri) } : undefined}
                name={displayName}
                size={120}
              />
              <TouchableOpacity
                style={styles.cameraButton}
                activeOpacity={0.7}
                onPress={() => router.push("/profile/edit" as any)}
              >
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={16} color={colors.text.white} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.gradientBackground} />
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.academicId}>
            {major.toUpperCase()}
            {studentCode ? ` • MSSV: ${studentCode}` : ""}
          </Text>

          <Button
            label="Chỉnh sửa hồ sơ"
            variant="outline"
            size="medium"
            onPress={() => router.push("/profile/edit" as any)}
            style={styles.editButton}
            textStyle={styles.editButtonText}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard label="GPA" value={gpa} />
          <StatCard label="TÍN CHỈ" value={creditsDisplay} />
          <StatCard label="KHÓA" value={academicYear} />
        </View>

        <View style={styles.section}>
          <Title variant="h3" weight="bold" style={styles.sectionTitle}>
            Thông tin học vụ
          </Title>
          <View style={styles.detailsCard}>
            <DetailRow label="Khoa" value={faculty} />
            <DetailRow label="Ngành" value={major} />
            <DetailRow label="Lớp" value={className} />
            {displayEmail ? (
              <DetailRow label="Email" value={displayEmail} />
            ) : null}
            <DetailRow
              label="Trạng thái"
              value=""
              badge={{ label: statusLabel, color: colors.state.success }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title variant="h3" weight="bold" style={styles.sectionTitle}>
              Học phần hiện tại
            </Title>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coursesContainer}
          >
            <CourseCard
              courseCode="IT 301"
              courseName="Cấu trúc dữ liệu & Giải thuật"
              schedule="Thứ 2, 4 • 7:30 SA"
              professor={{ name: "ThS. Nguyễn Văn A" }}
              badgeColor="#F59E0B"
            />
            <CourseCard
              courseCode="IT 405"
              courseName="Phát triển ứng dụng di động"
              schedule="Thứ 3, 5 • 13:00"
              professor={{ name: "ThS. Trần Thị B" }}
              badgeColor="#3B82F6"
            />
          </ScrollView>
        </View>

        <View style={styles.actionsSection}>
          <ActionButton
            icon="document-text-outline"
            label="Yêu cầu bảng điểm"
            iconColor="#3B82F6"
          />
          <ActionButton
            icon="school-outline"
            label="Thông tin học bổng"
            iconColor={colors.state.success}
          />
          <ActionButton
            icon="log-out-outline"
            label="Đăng xuất"
            iconColor={colors.state.error}
            onPress={signOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  headerTitle: { fontSize: 24 },
  settingsButton: { padding: 4 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: colors.background.white,
    marginBottom: 20,
    position: "relative",
  },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatarWrapper: { position: "relative", zIndex: 2 },
  cameraButton: { position: "absolute", bottom: 0, right: 0, zIndex: 3 },
  cameraIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background.white,
  },
  gradientBackground: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -100 }],
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E0F2F1",
    opacity: 0.5,
    zIndex: 1,
  },
  name: { fontSize: 28, fontWeight: "700", color: colors.text.primary, marginBottom: 8 },
  academicId: { fontSize: 14, fontWeight: "600", color: colors.teal.primary, marginBottom: 20 },
  editButton: {
    backgroundColor: colors.background.grey,
    borderWidth: 0,
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  editButtonText: { color: colors.text.primary, fontWeight: "600" },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, marginBottom: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 20,
  },
  coursesContainer: { paddingRight: 20 },
  actionsSection: { paddingHorizontal: 20, marginBottom: 20 },
});
