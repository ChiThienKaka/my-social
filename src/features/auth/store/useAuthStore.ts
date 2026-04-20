// ============================================
// useAuthStore.ts - OAuth Compatible
// ============================================
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AuthResponse,
  User,
  GoogleAuthResponse,
  AuthProvider,
} from "../types/auth";
import { authService, GoogleLoginPayload } from "../services/auth.service";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// ============================================
// Storage Keys
// ============================================
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
} as const;

// ============================================
// Store State Interface
// ============================================
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Traditional auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;

  // OAuth methods
  loginWithGoogle: (googleResponse: GoogleAuthResponse) => Promise<void>;
  loginWithOAuth: (provider: AuthProvider, token: string) => Promise<void>;

  // Common methods
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  initialize: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearAuth: () => Promise<void>;

  // Private helper (internal use only)
  _saveAuthData: (data: AuthResponse) => Promise<void>;
}

// ============================================
// Zustand Store
// ============================================
const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  // ============================================
  // Helper: Set Loading State
  // ============================================
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // ============================================
  // Helper: Save Auth Data to Storage
  // ============================================
  _saveAuthData: async (data: AuthResponse) => {
    console.log("data:", typeof data.access_token);
    await SecureStore.setItemAsync(
      STORAGE_KEYS.ACCESS_TOKEN,
      data.access_token,
    );
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

    set({
      user: data.user,
      accessToken: data.access_token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // ============================================
  // TRADITIONAL LOGIN (Email/Password)
  // ============================================
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      // Call API via service
      const data = await authService.login(email, password);

      // Save auth data
      await get()._saveAuthData(data);
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      set({ isLoading: true });

      // Call API via service
      const data = await authService.register(name, email, password);

      // Save auth data
      await get()._saveAuthData(data);
    } catch (error) {
      console.error("Register error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // ============================================
  // GOOGLE LOGIN (OAuth 2.0)
  // ============================================
  loginWithGoogle: async (googleResponse: GoogleAuthResponse) => {
    try {
      set({ isLoading: true });

      // Call API via service
      const data = await authService.loginWithGoogle({
        google_id: googleResponse.google_id,
        email: googleResponse.email,
        name: googleResponse.name,
        picture: googleResponse.picture,
      });

      // Save auth data
      await get()._saveAuthData(data);
    } catch (error) {
      console.log("Google login error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // ============================================
  // GENERIC OAuth LOGIN (Facebook, Apple, etc.)
  // ============================================
  loginWithOAuth: async (provider: AuthProvider, token: string) => {
    try {
      set({ isLoading: true });

      // Call API via service
      const data = await authService.loginWithOAuth(provider, { token });

      // Save auth data
      await get()._saveAuthData(data);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      set({ isLoading: false });
      throw error;
    }
  },

  // ============================================
  // COMMON METHODS (dùng chung cho tất cả auth types)
  // ============================================
  logout: async () => {
    try {
      set({ isLoading: true });

      // Try to logout on server (optional, continue even if fails)
      try {
        await authService.logout();
      } catch (apiError) {
        console.warn("Logout API call failed:", apiError);
      }

      // Clear local auth data
      await get().clearAuth();
      set({ isLoading: false });
    } catch (error) {
      console.error("Logout error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  getMe: async () => {
    try {
      set({ isLoading: true });

      // Call API via service
      const user = await authService.getMe();

      // Update local storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isLoading: false,
      });
    } catch (error) {
      console.error("Get user info error:", error);
      set({ isLoading: false });
      // 401 handled by http interceptor: clearAuth + redirect to login
      throw error;
    }
  },

  // ============================================
  // Helper: Clear Auth Data
  // ============================================
  clearAuth: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await GoogleSignin.signOut().catch((error) => {
      console.error("Google sign out error:", error);
    });

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  // ============================================
  // Initialize: Restore session on app start
  // ============================================
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Load saved auth data from storage
      const [accessToken, userString] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (accessToken && userString) {
        const user: User = JSON.parse(userString);

        // Restore state
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
        console.log("Initialize successful");
        console.log("User:", user);
        console.log("AccessToken:", accessToken);
        console.log("IsAuthenticated:", get().isAuthenticated);
        console.log("IsLoading:", get().isLoading);
        console.log("IsInitialized:", get().isInitialized);

        // Verify token is still valid
        try {
          await get().getMe();
        } catch (error) {
          console.log(
            "Token verification failed, will auto-refresh on next request",
          );
        }
      }

      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error("Initialize error:", error);
      set({ isInitialized: true, isLoading: false });
      await get().clearAuth();
    }
  },
}));

export default useAuthStore;

// Export storage keys for use in http interceptor
export { STORAGE_KEYS };
