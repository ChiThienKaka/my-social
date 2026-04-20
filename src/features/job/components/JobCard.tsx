import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import colors from "@/constants/colors";
import type { Job } from "../types/job";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { formatJobSalary } from "../utils/salary";

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress, onBookmarkPress }) => {
  const salaryText = formatJobSalary(job.salary_min, job.salary_max);

  // Lấy location_province
  const province =
    job.location_province || job.location.split(",").pop()?.trim() || "";

  const logoUrl = resolveImageUrl(job.company.logo_url);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.row}>
          {/* Company Logo - Left */}
          <View style={styles.logoContainer}>
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={colors.text.muted}
                />
              </View>
            )}
          </View>

          {/* Content - Right */}
          <View style={styles.contentRight}>
            {/* Header: Job Title + Heart Icon */}
            <View style={styles.titleRow}>
              <Text style={styles.jobTitle} numberOfLines={1}>
                {job.title}
              </Text>
              <TouchableOpacity
                onPress={onBookmarkPress}
                style={styles.heartButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={job.is_bookmarked ? "heart" : "heart-outline"}
                  size={20}
                  color={
                    job.is_bookmarked ? colors.state.error : colors.text.muted
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Company Name */}
            <Text style={styles.companyName} numberOfLines={1}>
              {job.company.name}
            </Text>
          </View>
        </View>
        {/* Footer: Salary + Location Tags */}
        <View style={styles.footer}>
          <Chip label={salaryText} selected={false} variant="light" />
          {province && (
            <Chip label={province} selected={false} variant="light" />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderColor: colors.border.primary,
    borderWidth: 1,
    borderRadius: 12,
  },
  content: {
    backgroundColor: colors.background.white,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.background.grey,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.background.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  contentRight: {
    flex: 1,
    gap: 4,
    flexDirection: "column",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  jobTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginRight: 8,
    lineHeight: 22,
  },
  heartButton: {
    padding: 4,
    marginTop: -4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
});

export default JobCard;
