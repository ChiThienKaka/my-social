import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "@/constants/colors";

interface DateSeparatorProps {
  label: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  label: {
    fontSize: 13,
    color: colors.text.muted,
    paddingHorizontal: 12,
    backgroundColor: colors.background.primary,
  },
});

export default DateSeparator;









