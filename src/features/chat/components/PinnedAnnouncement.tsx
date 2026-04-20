import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import colors from "@/constants/colors";

interface PinnedAnnouncementProps {
  title: string;
  author: string;
  onView?: () => void;
}

const PinnedAnnouncement: React.FC<PinnedAnnouncementProps> = ({
  title,
  author,
  onView,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons
          name="pin"
          size={20}
          color={colors.teal.primary}
          style={styles.pinIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>
      </View>
      <Button
        label="View"
        variant="primary"
        size="small"
        onPress={onView}
        style={styles.viewButton}
        textStyle={styles.viewButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  content: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  pinIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: colors.text.muted,
  },
  viewButton: {
    marginLeft: 12,
    minWidth: 60,
  },
  viewButtonText: {
    fontSize: 13,
  },
});

export default PinnedAnnouncement;









