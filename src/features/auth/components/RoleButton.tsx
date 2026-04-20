import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import type { RoleType } from "../types";

interface RoleButtonProps {
  role: RoleType;
  selected?: boolean;
  onPress?: () => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  role,
  selected = false,
  onPress,
}) => {
  const getRoleConfig = () => {
    switch (role) {
      case "student":
        return {
          label: "Student",
          icon: "school-outline" as keyof typeof Ionicons.glyphMap,
        };
      case "lecturer":
        return {
          label: "Lecturer",
          icon: "mic-outline" as keyof typeof Ionicons.glyphMap,
        };
      case "admin":
        return {
          label: "Admin",
          icon: "shield-checkmark-outline" as keyof typeof Ionicons.glyphMap,
        };
      default:
        return {
          label: "",
          icon: "help-outline" as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const config = getRoleConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected ? styles.buttonSelected : styles.buttonUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={config.icon}
          size={28}
          color={selected ? colors.icon.primary : colors.icon.primary}
        />
      </View>
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  buttonSelected: {
    backgroundColor: colors.role.selected,
    borderColor: colors.role.selected,
  },
  buttonUnselected: {
    backgroundColor: colors.role.unselected,
    borderColor: colors.role.border,
  },
  iconContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  labelSelected: {
    color: colors.text.primary,
  },
  labelUnselected: {
    color: colors.text.primary,
  },
});

export default RoleButton;









