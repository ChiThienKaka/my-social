import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface RecentSearchItemProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  onRemove?: () => void;
}

const RecentSearchItem: React.FC<RecentSearchItemProps> = ({
  text,
  icon = "time-outline",
  onPress,
  onRemove,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={colors.text.muted}
        style={styles.icon}
      />
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color={colors.text.muted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default RecentSearchItem;












