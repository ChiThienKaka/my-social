import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "@/constants/colors";

interface StatCardProps {
  label: string;
  value: string;
  backgroundColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  backgroundColor = colors.teal.light,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
    fontWeight: "500",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
});

export default StatCard;












