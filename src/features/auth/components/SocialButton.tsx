import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import type { SocialProvider } from "../types";

interface SocialButtonProps {
  provider: SocialProvider;
  onPress?: () => void;
  style?: ViewStyle;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  style,
}) => {
  const renderIcon = () => {
    switch (provider) {
      case "google":
        // Google icon - using a simple 'G' text for now
        return (
          <View style={styles.googleIcon}>
            <Text style={styles.googleText}>G</Text>
          </View>
        );
      case "ios":
        return <Text style={styles.iosText}>iOS</Text>;
      case "university":
        return (
          <Ionicons
            name="school-outline"
            size={24}
            color={colors.icon.teal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  iosText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.black,
  },
});

export default SocialButton;









