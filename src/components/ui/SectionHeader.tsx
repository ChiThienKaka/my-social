import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface SectionHeaderProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  viewAllLabel?: string;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  iconColor = colors.text.primary,
  viewAllLabel,
  onViewAllPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <Text style={styles.header}>{title}</Text>
      </View>
      {viewAllLabel && onViewAllPress && (
        <TouchableOpacity onPress={onViewAllPress} activeOpacity={0.7}>
          <Text style={styles.viewAll}>{viewAllLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.teal.primary,
  },
});

export default SectionHeader;
