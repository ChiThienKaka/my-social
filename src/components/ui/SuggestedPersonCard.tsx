import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import Button from "./Button";
import colors from "@/constants/colors";

interface SuggestedPersonCardProps {
  name: string;
  role: string;
  avatar?: { uri: string } | number;
  online?: boolean;
  onConnect?: () => void;
  onPress?: () => void;
}

const SuggestedPersonCard: React.FC<SuggestedPersonCardProps> = ({
  name,
  role,
  avatar,
  online,
  onConnect,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.avatarContainer}>
        <Avatar source={avatar} name={name} size={64} />
        {online && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.role} numberOfLines={1}>
        {role}
      </Text>
      <Button
        label="Connect"
        variant="primary"
        size="small"
        onPress={onConnect}
        style={styles.connectButton}
        textStyle={styles.connectButtonText}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
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
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  role: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 12,
    textAlign: "center",
  },
  connectButton: {
    width: "100%",
  },
  connectButtonText: {
    fontSize: 13,
  },
});

export default SuggestedPersonCard;












