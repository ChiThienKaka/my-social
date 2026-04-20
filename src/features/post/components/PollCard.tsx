import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/ui/Avatar";
import colors from "@/constants/colors";

interface PollOption {
  label: string;
  percentage: number;
  selected?: boolean;
}

interface PollCardProps {
  author: {
    name: string;
    avatar?: { uri: string } | number;
    role?: string;
  };
  timestamp: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
  onPress?: () => void;
  onMenuPress?: () => void;
  onOptionPress?: (index: number) => void;
  onSharePress?: () => void;
}

const PollCard: React.FC<PollCardProps> = ({
  author,
  timestamp,
  question,
  options,
  totalVotes,
  timeLeft,
  onPress,
  onMenuPress,
  onOptionPress,
  onSharePress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Avatar source={author.avatar} name={author.name} size={40} />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{author.name}</Text>
            <Text style={styles.authorRole}>
              Poll • {timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.question}>{question}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => onOptionPress?.(index)}
            activeOpacity={0.7}
          >
            <View style={styles.optionBarContainer}>
              <View
                style={[
                  styles.optionBar,
                  {
                    width: `${option.percentage}%`,
                    backgroundColor:
                      option.percentage > 0
                        ? colors.teal.light
                        : colors.background.grey,
                  },
                ]}
              />
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    option.percentage > 0 && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionPercentage,
                    option.percentage > 0 && styles.optionPercentageSelected,
                  ]}
                >
                  {option.percentage}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {totalVotes} votes • {timeLeft}
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={onSharePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    flex: 1,
  },
  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 12,
    color: colors.text.muted,
  },
  menuButton: {
    padding: 4,
  },
  question: {
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 12,
  },
  option: {
    marginBottom: 12,
  },
  optionBarContainer: {
    position: "relative",
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.background.grey,
  },
  optionBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 18,
  },
  optionContent: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  optionLabelSelected: {
    color: colors.teal.primary,
  },
  optionPercentage: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  optionPercentageSelected: {
    color: colors.teal.primary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.muted,
  },
  shareButton: {
    padding: 4,
  },
});

export default PollCard;









