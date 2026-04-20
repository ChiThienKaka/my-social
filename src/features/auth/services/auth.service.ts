import { http } from "@/app/api/http";
import type {
  AuthResponse,
  User,
  RoleType,
  GoogleAuthResponse,
  AuthProvider,
  ApiAuthResponse,
  ApiUser,
} from "../types/auth";
import { mapAuthResponseFromApi, mapUserFromApi } from "../types/auth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: RoleType;
}

export interface GoogleLoginPayload {
  google_id : string,
  email : string,
  name : string,
  picture? : string
  role_id?: number
}
export interface OAuthLoginPayload {
  token: string;
}

export const authService = {
  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @returns AuthResponse with user and tokens
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await http.post<ApiAuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return mapAuthResponseFromApi(response.data);
  },

  /**
   * Register new user
   * @param name - User full name
   * @param email - User email
   * @param password - User password
   * @returns AuthResponse with user and tokens
   */
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await http.post<ApiAuthResponse>("/auth/register", {
      name,
      email,
      password,
    });
    return mapAuthResponseFromApi(response.data);
  },

  // ============================================
  // OAuth / Social Auth
  // ============================================

  /**
   * Login with Google OAuth
   * @param payload - Google auth data including idToken
   * @returns AuthResponse with user and tokens
   */
  loginWithGoogle: async (payload: GoogleLoginPayload): Promise<AuthResponse> => {
    const response = await http.post<ApiAuthResponse>(
      "/api/auth/login/google",
      payload,
    );
    console.log("Google login response:", response.data);
    return mapAuthResponseFromApi(response.data);
  },

  /**
   * Generic OAuth login for any provider
   * @param provider - OAuth provider (google, facebook, apple, etc.)
   * @param payload - OAuth payload with token
   * @returns AuthResponse with user and tokens
   */
  loginWithOAuth: async (
    provider: AuthProvider,
    payload: OAuthLoginPayload
  ): Promise<AuthResponse> => {
    const response = await http.post<ApiAuthResponse>(
      `/auth/${provider}`,
      payload,
    );
    return mapAuthResponseFromApi(response.data);
  },

  // ============================================
  // User Info
  // ============================================

  /**
   * Get current authenticated user info
   * @returns User object
   */
  getMe: async (): Promise<User> => {
    const response = await http.get<ApiUser>("/api/auth/user/info");
    return mapUserFromApi(response.data);
  },

  // ============================================
  // Session Management
  // ============================================

  /**
   * Logout current user
   * Invalidates token on server side
   */
  logout: async (): Promise<void> => {
    // await http.post("/auth/logout");
    console.log("logout");
  },

  /**
   * Refresh access token (if using refresh tokens)
   * @param refreshToken - Current refresh token
   * @returns New tokens
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await http.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  // ============================================
  // Password Management
  // ============================================

  /**
   * Request password reset email
   * @param email - User email
   */
  forgotPassword: async (email: string): Promise<void> => {
    await http.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token from email
   * @param token - Reset token from email
   * @param newPassword - New password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await http.post("/auth/reset-password", { token, password: newPassword });
  },

  /**
   * Change password for authenticated user
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await http.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
