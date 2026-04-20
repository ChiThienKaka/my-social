import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Chip from "@/components/ui/Chip";
import colors from "@/constants/colors";
import type { JobDetail } from "../types/job";
import { formatJobSalary } from "../utils/salary";

interface JobInfoTabProps {
  job: JobDetail;
}

const JobInfoTab: React.FC<JobInfoTabProps> = ({ job }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Job Description */}
      {job.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả công việc</Text>
          <Text style={styles.text}>{job.description}</Text>
        </View>
      )}

      {/* Requirements */}
      {job.requirements && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yêu cầu ứng viên</Text>
          <Text style={styles.text}>{job.requirements}</Text>
        </View>
      )}

      {/* Benefits */}
      {job.benefits && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quyền lợi</Text>
          <Text style={styles.text}>{job.benefits}</Text>
        </View>
      )}

      {/* Work Location */}
      {(job.location_address || job.location_district || job.location_province) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa điểm làm việc</Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.text.primary}
            />
            <Text style={styles.text}>
              {[job.location_address, job.location_district, job.location_province]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
        </View>
      )}

      {/* General Info Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin chung</Text>
        <View style={styles.grid}>
          {/* Salary */}
          <View style={styles.gridItem}>
            <View style={styles.gridItemHeader}>
              <Ionicons
                name="cash-outline"
                size={18}
                color={colors.teal.primary}
              />
              <Text style={styles.gridLabel}>Mức lương</Text>
            </View>
            <Text style={styles.gridValue}>
              {formatJobSalary(job.salary_min, job.salary_max)}
            </Text>
          </View>

          {/* Location */}
          {job.location_province && (
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.teal.primary}
                />
                <Text style={styles.gridLabel}>Địa điểm</Text>
              </View>
              <Text style={styles.gridValue}>{job.location_province}</Text>
            </View>
          )}

          {/* Experience Level */}
          {job.experience_level && (
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Ionicons
                  name="star-outline"
                  size={18}
                  color={colors.teal.primary}
                />
                <Text style={styles.gridLabel}>Kinh nghiệm</Text>
              </View>
              <Text style={styles.gridValue}>{job.experience_level}</Text>
            </View>
          )}

          {/* Application Deadline */}
          {job.application_deadline && (
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={colors.teal.primary}
                />
                <Text style={styles.gridLabel}>Hạn ứng tuyển</Text>
              </View>
              <Text style={styles.gridValue}>
                {formatDate(job.application_deadline)}
              </Text>
            </View>
          )}

          {/* Job Type */}
          {job.job_type && (
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={colors.teal.primary}
                />
                <Text style={styles.gridLabel}>Cấp bậc</Text>
              </View>
              <Text style={styles.gridValue}>
                {job.job_type === "fulltime"
                  ? "Full-time"
                  : job.job_type === "parttime"
                    ? "Part-time"
                    : job.job_type === "internship"
                      ? "Internship"
                      : job.job_type}
              </Text>
            </View>
          )}

          {/* Work Mode */}
          {job.work_mode && (
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={colors.teal.primary}
                />
                <Text style={styles.gridLabel}>Hình thức làm việc</Text>
              </View>
              <Text style={styles.gridValue}>
                {job.work_mode === "onsite"
                  ? "Tại văn phòng"
                  : job.work_mode === "remote"
                    ? "Làm việc từ xa"
                    : job.work_mode === "hybrid"
                      ? "Kết hợp"
                      : job.work_mode}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kỹ năng yêu cầu</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill) => (
              <Chip
                key={skill.id}
                label={skill.name}
                selected={skill.is_required}
                variant="light"
                style={styles.skillChip}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  gridItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },
  gridValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginLeft: 24,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    marginBottom: 8,
  },
});

export default JobInfoTab;
