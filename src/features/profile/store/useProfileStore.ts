import { create } from "zustand";
import {
  profileService,
  type StudentProfile,
  type UpdateProfileData,
} from "../services/profile.service";

interface ProfileState {
  profile: StudentProfile | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  clearProfile: () => void;
}

const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getProfile();
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "Lỗi tải hồ sơ" });
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await profileService.updateProfile(data);
      set({ profile: updated, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || "Lỗi cập nhật hồ sơ" });
      throw error;
    }
  },

  clearProfile: () => set({ profile: null, error: null }),
}));

export default useProfileStore;
