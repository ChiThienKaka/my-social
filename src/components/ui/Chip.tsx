import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  variant?: "default" | "light";
}

const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  iconPosition = "right",
  variant = "default",
}) => {
  const getBackgroundColor = () => {
    if (selected) {
      return variant === "light"
        ? colors.background.grey
        : colors.teal.primary;
    }
    return colors.background.white;
  };

  const getTextColor = () => {
    if (selected) {
      return variant === "light" ? colors.text.primary : colors.text.white;
    }
    return colors.text.primary;
  };

  const iconColor = selected
    ? variant === "light"
      ? colors.text.primary
      : colors.text.white
    : colors.text.primary;

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: getBackgroundColor() },
        !selected && styles.chipUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && iconPosition === "left" && (
        <Ionicons
          name={icon}
          size={16}
          color={iconColor}
          style={styles.iconLeft}
        />
      )}
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
      {icon && iconPosition === "right" && (
        <Ionicons
          name={icon}
          size={16}
          color={iconColor}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 36,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  chipUnselected: {
    borderColor: colors.border.light,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});

export default Chip;












