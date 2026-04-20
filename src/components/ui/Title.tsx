import React from "react";
import { StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import colors from "@/constants/colors";

export type TitleVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "subtitle"
  | "caption"
  | "label";

export type TitleWeight = "normal" | "medium" | "semibold" | "bold";

interface TitleProps {
  children: React.ReactNode;
  variant?: TitleVariant;
  weight?: TitleWeight;
  color?: string;
  align?: "left" | "center" | "right";
  style?: TextStyle;
  numberOfLines?: number;
}

const Title: React.FC<TitleProps> = ({
  children,
  variant = "body",
  weight = "normal",
  color = colors.text.primary, // Dark grey
  align = "left",
  style,
  numberOfLines,
}) => {
  const textStyles = [
    styles.base,
    styles[variant],
    styles[`weight_${weight}`],
    { color, textAlign: align },
    style,
  ];

  return (
    <Text style={textStyles} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
  // Variants - Typography sizes
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  // Weights
  weight_normal: {
    fontWeight: "400",
  },
  weight_medium: {
    fontWeight: "500",
  },
  weight_semibold: {
    fontWeight: "600",
  },
  weight_bold: {
    fontWeight: "700",
  },
});

export default Title;

