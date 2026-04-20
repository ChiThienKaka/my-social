import React, { useState } from "react";
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

export type TextInputType = "text" | "password" | "email" | "number" | "phone";

interface TextInputProps extends Omit<RNTextInputProps, "secureTextEntry"> {
  label?: string | React.ReactNode;
  placeholder?: string;
  type?: TextInputType;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  value?: string;
  onChangeText?: (text: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  showPasswordToggle?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = "text",
  error,
  icon,
  iconPosition = "right",
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  showPasswordToggle = true,
  disabled = false,
  required = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const secureTextEntry = isPassword && !isPasswordVisible;

  const keyboardType =
    type === "email"
      ? "email-address"
      : type === "number"
      ? "numeric"
      : type === "phone"
      ? "phone-pad"
      : "default";

  const autoCapitalize =
    type === "email" ? "none" : type === "password" ? "none" : "sentences";

  const renderLabel = () => {
    if (!label) return null;

    if (typeof label === "string") {
      return (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      );
    }

    return <View>{label}</View>;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {icon && iconPosition === "left" && (
          <Ionicons
            name={icon}
            size={20}
            color={colors.icon.secondary}
            style={styles.iconLeft}
          />
        )}
        <RNTextInput
          style={[
            styles.input,
            icon && iconPosition === "left" && styles.inputWithLeftIcon,
            (icon && iconPosition === "right") ||
            (isPassword && showPasswordToggle) ||
            (isPassword && !showPasswordToggle)
              ? styles.inputWithRightIcon
              : null,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          {...props}
        />
        {isPassword && showPasswordToggle ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconRight}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>
        ) : (
          icon &&
          iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={20}
              color={colors.icon.secondary}
              style={styles.iconRight}
            />
          )
        )}
      </View>
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: colors.state.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderWidth: 1.5,
    borderColor: colors.border.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: colors.state.error,
  },
  inputContainerDisabled: {
    backgroundColor: colors.state.disabled,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  iconLeft: {
    marginRight: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
  error: {
    fontSize: 12,
    color: colors.state.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default TextInput;
