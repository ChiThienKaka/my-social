import { http } from "@/app/api/http";

export interface StudentProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  student_code: string | null;
  faculty: string | null;
  major: string | null;
  class_name: string | null;
  academic_year: string | null;
  gpa: number | null;
  credits_completed: number | null;
  credits_total: number | null;
  bio: string | null;
  address: string | null;
  date_of_birth: string | null;
  status: string | null;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  bio?: string;
  address?: string;
  avatar?: { uri: string; type: string; name: string };
}

export const profileService = {
  getProfile: async (): Promise<StudentProfile> => {
    try {
      const res = await http.get<{ data: StudentProfile } | StudentProfile>(
        "/api/applicant-profile/info",
      );
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        return data.data;
      }
      return data as StudentProfile;
    } catch (error) {
      console.warn("[profileService.getProfile] error:", error);
      throw error;
    }
  },

  updateProfile: async (params: UpdateProfileData): Promise<StudentProfile> => {
    const formData = new FormData();
    if (params.full_name) formData.append("full_name", params.full_name);
    if (params.phone) formData.append("phone", params.phone);
    if (params.bio) formData.append("bio", params.bio);
    if (params.address) formData.append("address", params.address);
    if (params.avatar) {
      formData.append("avatar", {
        uri: params.avatar.uri,
        type: params.avatar.type,
        name: params.avatar.name,
      } as any);
    }

    const res = await http.post<{ data: StudentProfile } | StudentProfile>(
      "/api/applicant-profile/update",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const data = res.data;
    if (data && typeof data === "object" && "data" in data) {
      return data.data;
    }
    return data as StudentProfile;
  },
};
