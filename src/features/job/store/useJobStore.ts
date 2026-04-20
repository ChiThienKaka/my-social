import { create } from "zustand";
import type { Job } from "../types/job";
import { jobService } from "../services/job.service";

interface JobState {
  jobs: Job[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  searchQuery: string;
  selectedFilter: string; // "all" | "internships" | "part-time" | "remote"

  fetchJobs: (params?: {
    search?: string;
    type?: string;
    category?: string;
    page?: number;
    append?: boolean;
  }) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: string) => void;
}

const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  searchQuery: "",
  selectedFilter: "all",

  fetchJobs: async (params) => {
    const { searchQuery, selectedFilter } = get();
    const page = params?.page ?? 1;
    const append = params?.append === true;
    const isRefresh = page === 1 && !append;

    try {
      if (isRefresh) {
        set({ isLoading: true, error: null });
      } else if (append) {
        set({ isLoadingMore: true, error: null });
      }

      const search = params?.search ?? searchQuery;
      const type =
        selectedFilter !== "all" && selectedFilter !== "remote"
          ? selectedFilter
          : undefined;

      const result = await jobService.getJobs({
        search,
        type,
        page,
      });

      const nextJobs = append ? [...get().jobs, ...result.jobs] : result.jobs;

      set({
        jobs: nextJobs,
        currentPage: result.current_page,
        totalPages: result.total_pages,
        total: result.total,
        isLoading: false,
        isLoadingMore: false,
      });
    } catch (error: any) {
      console.error("Fetch jobs error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách công việc.";
      const state: Partial<JobState> = {
        error: message,
        isLoading: false,
        isLoadingMore: false,
      };
      // Khi load more (append) lỗi (vd 401): không thử load thêm nữa
      if (append) {
        state.totalPages = get().currentPage;
      }
      set(state);
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedFilter: (filter: string) => {
    set({ selectedFilter: filter });
  },
}));

export default useJobStore;
