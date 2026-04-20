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

interface EventCardProps {
  tag: string;
  author: string;
  title: string;
  time: string;
  backgroundImage?: ImageSourcePropType | { uri: string };
  onPress?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  tag,
  author,
  title,
  time,
  backgroundImage,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.content}>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>{tag}</Text>
            </View>
            <Text style={styles.author}>{author}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.time}>{time}</Text>
            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailText}>View Detail</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.content, styles.contentNoImage]}>
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tag}</Text>
          </View>
          <Text style={[styles.author, styles.authorNoImage]}>{author}</Text>
          <Text style={[styles.title, styles.titleNoImage]}>{title}</Text>
          <Text style={[styles.time, styles.timeNoImage]}>{time}</Text>
          <TouchableOpacity
            style={styles.viewDetailButton}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailText}>View Detail</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: colors.background.dark,
  },
  backgroundImage: {
    width: "100%",
    minHeight: 200,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    padding: 16,
    minHeight: 200,
    justifyContent: "space-between",
  },
  contentNoImage: {
    backgroundColor: colors.background.dark,
  },
  tagContainer: {
    alignSelf: "flex-start",
    backgroundColor: colors.text.muted,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.text.white,
    textTransform: "uppercase",
  },
  author: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 8,
  },
  authorNoImage: {
    color: colors.text.muted,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.white,
    marginBottom: 8,
  },
  titleNoImage: {
    color: colors.text.white,
  },
  time: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 12,
  },
  timeNoImage: {
    color: colors.text.muted,
  },
  viewDetailButton: {
    alignSelf: "flex-start",
  },
  viewDetailText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.teal.primary,
  },
});

export default EventCard;

