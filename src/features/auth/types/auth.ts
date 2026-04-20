// ============================
// FE models (đã normalize)
// ============================

export interface User {
  id: number;
  name: string; // đã normalize từ full_name
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role_id?: number | null;
  student_code?: string;
  status?: string;
}

export type RoleType = "student" | "lecturer" | "admin";
export type AuthProvider = "email" | "google";

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface GoogleAuthResponse {
  google_id: string;
  email: string;
  name: string;
  picture?: string;
  role_id?: number;
}

// ============================
// DTO từ API (raw)
// ============================

export interface ApiUser {
  user_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  role_id?: number | null;
  student_code?: string;
  status?: string;
}

export interface ApiAuthResponse {
  user: ApiUser;
  access_token: string;
}

// ============================
// Mapping helpers
// ============================

export const mapUserFromApi = (api: ApiUser): User => ({
  id: api.user_id,
  name: api.full_name,
  email: api.email,
  phone: api.phone ?? null,
  avatar_url: api.avatar_url ?? null,
  role_id: api.role_id ?? null,
  student_code: api.student_code,
  status: api.status,
});

export const mapAuthResponseFromApi = (api: ApiAuthResponse): AuthResponse => ({
  user: mapUserFromApi(api.user),
  access_token: api.access_token,
});
