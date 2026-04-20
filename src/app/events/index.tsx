import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/constants/colors";
import { EventCard } from "@/components/ui";

type EventItem = {
  id: string;
  tag: string;
  author: string;
  title: string;
  time: string;
  backgroundImage?: { uri: string };
};

export default function EventsScreen() {
  const events = useMemo<EventItem[]>(
    () => [
      {
        id: "ev-1",
        tag: "SỰ KIỆN",
        author: "Đoàn Thanh niên",
        title: "Ngày hội Việc làm TDMU 2026",
        time: "Thứ 7, 05/04 • 8:00 SA",
        backgroundImage: {
          uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200",
        },
      },
      {
        id: "ev-2",
        tag: "THỂ THAO",
        author: "CLB Thể thao",
        title: "Giải Bóng đá Sinh viên TDMU",
        time: "Chủ nhật, 06/04 • 15:00",
      },
      {
        id: "ev-3",
        tag: "WORKSHOP",
        author: "Khoa CNTT",
        title: "Workshop: Xây dựng CV nổi bật & phỏng vấn nhanh",
        time: "Thứ 4, 10/04 • 17:30",
        backgroundImage: {
          uri: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
        },
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.icon.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Sự kiện sắp tới</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.map((ev) => (
          <View key={ev.id} style={styles.cardWrap}>
            <EventCard
              tag={ev.tag}
              author={ev.author}
              title={ev.title}
              time={ev.time}
              backgroundImage={ev.backgroundImage}
              onPress={() => router.push(`/events/${ev.id}` as any)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.background.white,
  },
  iconButton: { width: 40, height: 40, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: colors.text.primary },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
  cardWrap: { marginBottom: 16, alignItems: "flex-start" },
});

