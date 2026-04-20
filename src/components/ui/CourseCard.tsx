import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import colors from "@/constants/colors";

interface CourseCardProps {
  courseCode: string;
  courseName: string;
  schedule: string;
  professor: {
    name: string;
    avatar?: { uri: string } | number;
  };
  badgeColor?: string;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  courseCode,
  courseName,
  schedule,
  professor,
  badgeColor = colors.teal.primary,
  onPress,
  onMenuPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{courseCode}</Text>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.icon.primary}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.courseName} numberOfLines={2}>
        {courseName}
      </Text>
      <Text style={styles.schedule} numberOfLines={1}>
        {schedule}
      </Text>
      <View style={styles.professorRow}>
        <Avatar
          source={professor.avatar}
          name={professor.name}
          size={24}
        />
        <Text style={styles.professorName} numberOfLines={1}>
          {professor.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.white,
  },
  menuButton: {
    padding: 4,
  },
  courseName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 6,
    lineHeight: 20,
  },
  schedule: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 12,
  },
  professorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  professorName: {
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },
});

export default CourseCard;












