import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Avatar from "./Avatar";
import colors from "@/constants/colors";

interface DetailRowProps {
  label: string;
  value: string;
  avatar?: { uri: string } | number;
  badge?: {
    label: string;
    color: string;
  };
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  avatar,
  badge,
  isLast = false,
}) => {
  return (
    <View style={[styles.container, isLast && styles.lastContainer]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        {avatar && (
          <Avatar source={avatar} name={value} size={24} />
        )}
        {badge ? (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastContainer: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: "500",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  value: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.white,
  },
});

export default DetailRow;

