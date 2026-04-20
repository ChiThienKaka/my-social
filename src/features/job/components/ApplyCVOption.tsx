import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";

interface ApplyCVOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ApplyCVOption: React.FC<ApplyCVOptionProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && (
          <Ionicons name="checkmark" size={14} color={colors.text.white} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.background.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: 12,
  },
  containerSelected: {
    borderColor: colors.teal.primary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.border.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: {
    backgroundColor: colors.teal.primary,
    borderColor: colors.teal.primary,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.text.primary,
  },
});

export default ApplyCVOption;
