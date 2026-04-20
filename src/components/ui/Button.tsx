import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  fullWidth = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const iconColor =
    variant === "primary" ? colors.text.black : colors.teal.primary;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" ? colors.text.black : colors.teal.primary
          }
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={size === "small" ? 16 : size === "medium" ? 18 : 20}
              color={iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyles}>{label}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={size === "small" ? 16 : size === "medium" ? 18 : 20}
              color={iconColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  // Variants
  primary: {
    backgroundColor: colors.teal.primary,
  },
  secondary: {
    backgroundColor: colors.teal.light,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.teal.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  // Sizes
  size_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  size_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  size_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  // Text styles
  text: {
    fontWeight: "600",
  },
  text_primary: {
    color: colors.text.black,
  },
  text_secondary: {
    color: colors.teal.dark,
  },
  text_outline: {
    color: colors.teal.primary,
  },
  text_ghost: {
    color: colors.teal.primary,
  },
  textSize_small: {
    fontSize: 14,
  },
  textSize_medium: {
    fontSize: 16,
  },
  textSize_large: {
    fontSize: 18,
  },
  // Icons
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.7,
  },
  fullWidth: {
    width: "100%",
  },
});

export default Button;

