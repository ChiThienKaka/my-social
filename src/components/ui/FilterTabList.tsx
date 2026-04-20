import React from "react";
import { StyleSheet, ScrollView, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FilterTab from "./FilterTab";
import colors from "@/constants/colors";

export interface FilterItem {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
}

interface FilterTabListProps {
  filters: FilterItem[];
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const FilterTabList: React.FC<FilterTabListProps> = ({
  filters,
  selectedFilter,
  onFilterChange,
  style,
  contentContainerStyle,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.filtersContainer, contentContainerStyle]}
      style={[styles.filtersScroll, style]}
    >
      {filters.map((filter) => (
        <FilterTab
          key={filter.id}
          label={filter.label}
          selected={selectedFilter === filter.id}
          onPress={() => onFilterChange(filter.id)}
          icon={filter.icon}
          iconPosition={filter.iconPosition || "left"}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersScroll: {
    maxHeight: 50,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export default FilterTabList;






