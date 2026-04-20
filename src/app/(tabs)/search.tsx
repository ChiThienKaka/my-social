import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SearchBar,
  Chip,
  RecentSearchItem,
  SuggestedPersonCard,
  TrendingCard,
  SectionHeader,
} from "@/components/ui";
import colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePostStore from "@/features/post/store/usePostStore";
import useJobStore from "@/features/job/store/useJobStore";
import { resolveImageUrl } from "@/utils/resolveImageUrl";
import { formatPostTime } from "@/features/post/utils/formatTime";

const RECENT_SEARCHES_KEY = "tdmu_recent_searches";

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recentSearches, setRecentSearches] = useState<
    { id: string; text: string }[]
  >([]);

  const { posts, fetchPosts, isLoading: postsLoading } = usePostStore();
  const { jobs, fetchJobs, isLoading: jobsLoading } = useJobStore();

  useEffect(() => {
    loadRecentSearches();
    if (posts.length === 0) fetchPosts();
    if (jobs.length === 0) fetchJobs();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {}
  };

  const saveSearch = async (text: string) => {
    if (!text.trim()) return;
    const updated = [
      { id: Date.now().toString(), text: text.trim() },
      ...recentSearches.filter(
        (s) => s.text.toLowerCase() !== text.trim().toLowerCase(),
      ),
    ].slice(0, 10);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleRemoveSearch = async (id: string) => {
    const updated = recentSearches.filter((s) => s.id !== id);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleClearAll = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) saveSearch(searchQuery);
  };

  const trendingPosts = posts.slice(0, 2);
  const trendingJobs = jobs.slice(0, 2);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khám phá</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Tìm bài viết, việc làm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            onSubmitEditing={handleSearch}
          />
        </View>

        <View style={styles.chipsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <Chip
              label="Tất cả"
              selected={selectedCategory === "all"}
              onPress={() => setSelectedCategory("all")}
              variant="light"
            />
            <Chip
              label="Bài viết"
              selected={selectedCategory === "posts"}
              onPress={() => setSelectedCategory("posts")}
            />
            <Chip
              label="Việc làm"
              selected={selectedCategory === "jobs"}
              onPress={() => setSelectedCategory("jobs")}
            />
          </ScrollView>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SectionHeader title="Tìm kiếm gần đây" />
              <TouchableOpacity
                onPress={handleClearAll}
                activeOpacity={0.7}
              >
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((search) => (
              <RecentSearchItem
                key={search.id}
                text={search.text}
                icon="time-outline"
                onRemove={() => handleRemoveSearch(search.id)}
              />
            ))}
          </View>
        )}

        {/* Trending Posts */}
        {(selectedCategory === "all" || selectedCategory === "posts") && (
          <View style={styles.section}>
            <SectionHeader title="Bài viết nổi bật" />
            {trendingPosts.map((post) => (
              <TrendingCard
                key={String(post.id)}
                type="news"
                title={
                  post.content.length > 80
                    ? post.content.slice(0, 80) + "..."
                    : post.content
                }
                description={post.content}
                timestamp={formatPostTime(post.created_at)}
                author={{
                  name: post.author.name,
                  avatar: post.author.avatar_url
                    ? { uri: resolveImageUrl(post.author.avatar_url) }
                    : undefined,
                }}
                onMenuPress={() =>
                  router.push(`/post/details?postId=${post.id}` as any)
                }
              />
            ))}
            {trendingPosts.length === 0 && !postsLoading && (
              <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
            )}
          </View>
        )}

        {/* Trending Jobs */}
        {(selectedCategory === "all" || selectedCategory === "jobs") && (
          <View style={styles.section}>
            <SectionHeader title="Việc làm mới nhất" />
            {trendingJobs.map((job) => (
              <TrendingCard
                key={String(job.id)}
                type="event"
                title={job.title}
                description={job.company?.name || ""}
                timestamp={job.location || ""}
                onMenuPress={() =>
                  router.push(`/job/${job.id}` as any)
                }
              />
            ))}
            {trendingJobs.length === 0 && !jobsLoading && (
              <Text style={styles.emptyText}>Chưa có việc làm nào</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text.primary },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.background.white,
  },
  chipsContainer: { paddingVertical: 8, backgroundColor: colors.background.white },
  chipsRow: { paddingHorizontal: 20 },
  section: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearAllText: { fontSize: 14, color: colors.teal.primary, fontWeight: "500" },
  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    paddingVertical: 16,
  },
});
