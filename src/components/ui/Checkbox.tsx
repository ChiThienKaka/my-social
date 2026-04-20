import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface CheckboxProps {
  checked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons
          name="checkmark"
          size={16}
          color={colors.checkbox.checkmark}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    backgroundColor: colors.checkbox.unchecked,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.checkbox.checked,
    borderColor: colors.checkbox.border,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
});

export default Checkbox;












