import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface FilterTabProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
}

const FilterTab: React.FC<FilterTabProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  iconPosition = "left",
}) => {
  const iconColor = selected ? colors.text.white : colors.text.primary;
  const iconSize = 18;

  return (
    <TouchableOpacity
      style={[styles.tab, selected ? styles.tabSelected : styles.tabUnselected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && iconPosition === "left" && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={styles.iconLeft}
        />
      )}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {icon && iconPosition === "right" && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    minHeight: 36,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  tabSelected: {
    backgroundColor: colors.teal.primary,
  },
  tabUnselected: {
    backgroundColor: colors.background.white,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  labelSelected: {
    color: colors.text.white,
  },
  labelUnselected: {
    color: colors.text.primary,
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});

export default FilterTab;











