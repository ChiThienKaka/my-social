import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FilterTabList, SectionHeader, type FilterItem } from "@/components/ui";
import {
  NotificationItem,
  type NotificationType,
} from "@/features/notification";
import colors from "@/constants/colors";
import { useAuthStore } from "@/features/auth";
import useNotificationStore from "@/features/notification/store/useNotificationStore";

type FilterType = "all" | "social" | "academic" | "mentions";

export default function NotificationScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications(user?.name || "Sinh viên");
  }, [user?.name]);

  const onRefresh = useCallback(() => {
    fetchNotifications(user?.name || "Sinh viên");
  }, [user?.name]);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const filters: FilterItem[] = [
    { id: "all", label: "Tất cả", icon: "checkmark", iconPosition: "left" },
    {
      id: "social",
      label: "Xã hội",
      icon: "people-outline",
      iconPosition: "left",
    },
    {
      id: "academic",
      label: "Học vụ",
      icon: "school-outline",
      iconPosition: "left",
    },
    { id: "mentions", label: "@", icon: "at-outline", iconPosition: "left" },
  ];

  const filteredNotifications =
    selectedFilter === "all"
      ? notifications
      : notifications.filter((n) => {
          if (selectedFilter === "mentions") return n.type === "social";
          return n.type === selectedFilter;
        });

  const now = Date.now();
  const todayNotifications = filteredNotifications.filter(
    (n) => now - n.createdAt < 12 * 3600000,
  );
  const olderNotifications = filteredNotifications.filter(
    (n) => now - n.createdAt >= 12 * 3600000,
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity
          onPress={handleMarkAllRead}
          style={styles.markAllReadButton}
          activeOpacity={0.7}
        >
          <Text style={styles.markAllReadText}>Đánh dấu đã đọc</Text>
          <Ionicons
            name="checkmark"
            size={16}
            color={colors.teal.primary}
            style={styles.markAllReadIcon}
          />
        </TouchableOpacity>
      </View>

      <FilterTabList
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={(filterId) => setSelectedFilter(filterId as FilterType)}
      />

      <ScrollView
        style={styles.notificationsScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {todayNotifications.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Mới" style={styles.sectionHeader} />
            {todayNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                avatar={notification.avatar as any}
                message={notification.message}
                type={notification.type}
                timeAgo={notification.timeAgo}
                unread={notification.unread}
                boldText={notification.boldText}
                onPress={() => markAsRead(notification.id)}
              />
            ))}
          </View>
        )}

        {olderNotifications.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Trước đó" style={styles.sectionHeader} />
            {olderNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                avatar={notification.avatar as any}
                message={notification.message}
                type={notification.type}
                timeAgo={notification.timeAgo}
                unread={notification.unread}
                boldText={notification.boldText}
                onPress={() => markAsRead(notification.id)}
              />
            ))}
          </View>
        )}

        {filteredNotifications.length === 0 && (
          <View style={styles.caughtUpContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={colors.text.muted}
            />
            <Text style={styles.caughtUpText}>Không có thông báo nào!</Text>
          </View>
        )}

        {filteredNotifications.length > 0 && (
          <View style={styles.caughtUpContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={colors.text.muted}
            />
            <Text style={styles.caughtUpText}>Bạn đã xem hết thông báo!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: colors.text.primary },
  markAllReadButton: { flexDirection: "row", alignItems: "center" },
  markAllReadText: {
    fontSize: 14,
    color: colors.teal.primary,
    fontWeight: "500",
    marginRight: 4,
  },
  markAllReadIcon: { marginLeft: 2 },
  notificationsScroll: { flex: 1 },
  section: { paddingHorizontal: 0, marginBottom: 8 },
  sectionHeader: { marginHorizontal: 20 },
  caughtUpContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  caughtUpText: { fontSize: 16, color: colors.text.muted, marginTop: 16 },
});
