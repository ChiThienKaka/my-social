import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface AnnouncementCardProps {
  tag?: string;
  author?: string;
  timestamp?: string;
  title?: string;
  description?: string;
  backgroundImage?: ImageSourcePropType | { uri: string };
  onPress?: () => void;
  onBookmarkPress?: () => void;
  isBookmarked?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  tag,
  author,
  timestamp,
  title,
  description,
  backgroundImage,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
}) => {
  const cardContent = (
    <View style={styles.container}>
      {backgroundImage && (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tag}</Text>
          </View>
          <TouchableOpacity
            onPress={onBookmarkPress}
            style={styles.bookmarkButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={colors.text.white}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.meta}>
          {author} • {timestamp}
        </Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <TouchableOpacity
          style={styles.viewDetailButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.viewDetailText}>View Detail</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.teal.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.background.dark,
    marginBottom: 16,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    padding: 20,
    minHeight: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tagContainer: {
    backgroundColor: "#3B82F6",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.white,
    textTransform: "uppercase",
  },
  bookmarkButton: {
    padding: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.white,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  viewDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.teal.primary,
    marginRight: 4,
  },
});

export default AnnouncementCard;
