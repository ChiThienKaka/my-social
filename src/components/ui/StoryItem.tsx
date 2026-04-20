import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "./Avatar";
import colors from "@/constants/colors";

interface StoryItemProps {
  type?: "my" | "user";
  name?: string;
  avatar?: { uri: string } | number;
  online?: boolean;
  hasNewStory?: boolean;
  onPress?: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({
  type = "user",
  name,
  avatar,
  online,
  hasNewStory = false,
  onPress,
}) => {
  if (type === "my") {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.myStoryCircle}>
          <Ionicons
            name="add"
            size={24}
            color={colors.teal.primary}
          />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          My Story
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar source={avatar} name={name} size={64} />
        {online && <View style={styles.onlineIndicator} />}
        {hasNewStory && <View style={styles.storyBorder} />}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  myStoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.white,
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 8,
  },
  storyBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.teal.primary,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  name: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: "center",
  },
});

export default StoryItem;












