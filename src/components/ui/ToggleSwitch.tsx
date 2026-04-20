import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import colors from "@/constants/colors";

interface ToggleSwitchProps {
  options: [string, string];
  selected: 0 | 1;
  onToggle: (index: 0 | 1) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  selected,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.option,
          selected === 0 && styles.optionSelected,
        ]}
        onPress={() => onToggle(0)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            selected === 0 && styles.optionTextSelected,
          ]}
        >
          {options[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.option,
          selected === 1 && styles.optionSelected,
        ]}
        onPress={() => onToggle(1)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            selected === 1 && styles.optionTextSelected,
          ]}
        >
          {options[1]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.grey,
    borderRadius: 8,
    padding: 2,
  },
  option: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: colors.text.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.primary,
  },
  optionTextSelected: {
    color: colors.text.white,
  },
});

export default ToggleSwitch;












