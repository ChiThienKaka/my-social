import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ViewPager from "@/components/ui/ViewPager";
import Button from "@/components/ui/Button";
import colors from "@/constants/colors";
import { jobService } from "@/features/job/services/job.service";
import type { JobDetail } from "@/features/job/types/job";
import JobInfoTab from "@/features/job/components/JobInfoTab";
import CompanyTab from "@/features/job/components/CompanyTab";
import CompetitivenessTab from "@/features/job/components/CompetitivenessTab";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobDetail();
    }
  }, [id]);

  useEffect(() => {
    if (job?.title) {
      navigation.setOptions({ title: job.title });
    }
  }, [job?.title, navigation]);

  const loadJobDetail = async () => {
    try {
      setIsLoading(true);
      const jobDetail = await jobService.getJobDetail(id);
      setJob(jobDetail);
      setIsBookmarked(jobDetail.is_bookmarked ?? false);
    } catch (error: any) {
      console.error("Load job detail error:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin công việc.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark API
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    router.push(`/job/apply?id=${id}`);
  };

  if (isLoading || !job) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.teal.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const tabs = [
    { id: "info", label: "Thông tin" },
    { id: "company", label: "Công ty" },
    { id: "competitiveness", label: "Mức độ cạnh tranh" },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      edges={["top"]}
    >
      {/* ViewPager with Tabs */}
      <ViewPager tabs={tabs}>
        <JobInfoTab job={job} />
        <CompanyTab company={job.company} />
        <CompetitivenessTab jobId={job.id} />
      </ViewPager>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleBookmark}
          style={styles.bookmarkButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isBookmarked ? "heart" : "heart-outline"}
            size={24}
            color={isBookmarked ? colors.state.error : colors.text.primary}
          />
        </TouchableOpacity>
        <Button
          label="Ứng tuyển ngay"
          onPress={handleApply}
          variant="primary"
          style={styles.applyButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.white,
    gap: 12,
  },
  bookmarkButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.white,
  },
  applyButton: {
    flex: 1,
  },
});
