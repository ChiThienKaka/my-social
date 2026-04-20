import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBar, Chip } from "@/components/ui";
import { JobCard, useJobStore } from "@/features/job";
import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function RecruitScreen() {
  // Demo: số lượng đơn ứng tuyển (mock để app “sống” hơn)
  const demoAppliedCount = 3;

  const {
    jobs,
    isLoading,
    isLoadingMore,
    currentPage,
    totalPages,
    error,
    searchQuery,
    selectedFilter,
    fetchJobs,
    setSearchQuery,
    setSelectedFilter,
  } = useJobStore();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const loadMoreInProgressRef = useRef(false);

  const hasMore = currentPage < totalPages;

  const loadMore = useCallback(async () => {
    if (loadMoreInProgressRef.current || isLoading || isLoadingMore || !hasMore)
      return;
    loadMoreInProgressRef.current = true;
    try {
      await fetchJobs({ page: currentPage + 1, append: true });
    } finally {
      loadMoreInProgressRef.current = false;
    }
  }, [currentPage, totalPages, hasMore, isLoading, isLoadingMore, fetchJobs]);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "internship", label: "Thực tập" },
    { id: "part-time", label: "Bán thời gian" },
    { id: "remote", label: "Từ xa" },
  ];

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        setSearchQuery(localSearchQuery);
        fetchJobs({ search: localSearchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  useEffect(() => {
    // Refetch when filter changes
    fetchJobs();
  }, [selectedFilter]);

  const handleFilterPress = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleBookmarkPress = (jobId: number | string) => {
    // TODO: Implement bookmark toggle
    console.log("Toggle bookmark for job:", jobId);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cơ hội việc làm</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons
              name="options-outline"
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={colors.icon.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Tìm việc làm, công ty..."
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          onClear={() => {
            setLocalSearchQuery("");
            setSearchQuery("");
          }}
        />
        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
          style={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              selected={selectedFilter === filter.id}
              onPress={() => handleFilterPress(filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Applied summary (mock) */}
      <View style={styles.appliedSummary}>
        <View style={styles.appliedLeft}>
          <View style={styles.appliedIcon}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.text.white}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.appliedTitle}>CV đã ứng tuyển</Text>
            <Text style={styles.appliedSubtitle}>
              Bạn đã nộp {demoAppliedCount} đơn — xem kết quả & lịch sử.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.appliedButton}
          onPress={() => router.push("/job/applications" as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.appliedButtonText}>Xem kết quả</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.teal.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobs}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => {
              router.push(`/job/${item.id}`);
            }}
            onBookmarkPress={() => handleBookmarkPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => fetchJobs()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? "Đang tải..." : "Không tìm thấy công việc nào"}
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.teal.primary} />
              <Text style={styles.footerLoaderText}>Đang tải thêm...</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.white,
    gap: 16,
  },
  filtersScroll: {
    backgroundColor: colors.background.white,
  },
  filtersContainer: {
    gap: 8,
  },
  appliedSummary: {
    marginTop: 6,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 10,
  },
  appliedLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  appliedIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.teal.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  appliedTitle: { fontSize: 15, fontWeight: "900", color: colors.text.primary },
  appliedSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: "600",
  },
  appliedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#CFFBEA",
    gap: 10,
  },
  appliedButtonText: { fontSize: 13, fontWeight: "900", color: colors.teal.primary },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.muted,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 14,
    color: colors.text.muted,
  },
});
