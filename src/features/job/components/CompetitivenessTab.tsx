import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import colors from "@/constants/colors";

interface CompetitivenessTabProps {
  jobId: number | string;
}

const CompetitivenessTab: React.FC<CompetitivenessTabProps> = ({ jobId }) => {
  // TODO: Implement competitiveness level logic
  // This could show statistics like:
  // - Number of applicants
  // - Average experience level
  // - Skill match percentage
  // etc.

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mức độ cạnh tranh</Text>
        <Text style={styles.text}>
          Thông tin về mức độ cạnh tranh của công việc này sẽ được hiển thị tại đây.
        </Text>
        <Text style={styles.text}>
          Tính năng này đang được phát triển và sẽ bao gồm các thống kê như số lượng ứng viên,
          mức độ phù hợp kỹ năng, và các chỉ số khác.
        </Text>
      </View>
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
    marginBottom: 12,
  },
});

export default CompetitivenessTab;
