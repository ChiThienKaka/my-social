import React from "react";
import { StyleSheet, View, TouchableOpacity, ViewStyle } from "react-native";
import colors from "@/constants/colors";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const cardContent = (
    <View style={[styles.card, style]}>
      <View style={styles.content}>{children}</View>
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
  card: {
    backgroundColor: colors.background.white,
  },
  content: {
    padding: 16,
  },
});

export default Card;










