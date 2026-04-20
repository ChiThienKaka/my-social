import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: number;
  badge?: {
    icon: keyof typeof Ionicons.glyphMap;
    backgroundColor: string;
    iconColor: string;
  };
  backgroundColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 48,
  badge,
  backgroundColor,
  icon,
  iconColor = colors.text.primary,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[styles.image, { width: size, height: size }]}
        />
      );
    }
    if (icon) {
      return <Ionicons name={icon} size={size * 0.5} color={iconColor} />;
    }
    if (name) {
      return (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      );
    }
    return (
      <Ionicons name="person-outline" size={size * 0.5} color={iconColor} />
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: backgroundColor || colors.background.grey,
          },
        ]}
      >
        {renderContent()}
      </View>
      {badge && (
        <View
          style={[
            styles.badge,
            {
              width: size * 0.4,
              height: size * 0.4,
              borderRadius: size * 0.2,
              backgroundColor: badge.backgroundColor,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Ionicons
            name={badge.icon}
            size={size * 0.2}
            color={badge.iconColor}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    borderRadius: 999,
  },
  initials: {
    fontWeight: "600",
    color: colors.text.primary,
  },
  badge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background.white,
  },
});

export default Avatar;
