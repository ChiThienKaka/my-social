import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import colors from "@/constants/colors";

interface ViewPagerProps {
  tabs: Array<{ id: string; label: string }>;
  children: React.ReactNode[];
  onTabChange?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ViewPager: React.FC<ViewPagerProps> = ({
  tabs,
  children,
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
      onTabChange?.(index);
    }
  };

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    onTabChange?.(index);
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeIndex === index && styles.tabActive]}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabLabel,
                  activeIndex === index && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
              {activeIndex === index && <View style={styles.tabIndicator} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {children.map((child, index) => (
          <View key={index} style={styles.page}>
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
  },
  tabActive: {},
  tabContent: {
    alignItems: "center",
    position: "relative",
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text.muted,
  },
  tabLabelActive: {
    color: colors.teal.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -12,
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: colors.teal.primary,
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});

export default ViewPager;
