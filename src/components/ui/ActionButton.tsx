import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import IconComponent from "./IconComponent";

interface ActionButtonProps {
  icon: string;
  label: string;
  iconColor?: string;
  onPress?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  iconColor = colors.icon.primary,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconComponent family="Ionicons" name={icon} size={24} />
      <Text style={styles.label}>{label}</Text>
      <IconComponent family="Ionicons" name="chevron-forward" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.text.primary,
  },
});

export default ActionButton;










