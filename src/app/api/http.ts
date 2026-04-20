// http client using axios
import { STORAGE_KEYS } from "@/features/auth/store/useAuthStore";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // Tăng timeout để tránh Network Error khi upload file lớn
  timeout: 60000,
});

// Request interceptor: Add access token to headers
http.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Handle token refresh on 401
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: any) => void;
//   reject: (reason?: any) => void;
// }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401: Token expired - clear auth and redirect to login
    if (error.response?.status === 401) {
      try {
        const { default: useAuthStore } = await import(
          "@/features/auth/store/useAuthStore"
        );
        await useAuthStore.getState().clearAuth();
        const { router } = await import("expo-router");
        router.replace("/(auth)/login");
      } catch (e) {
        console.warn("401 handler error:", e);
      }
      return Promise.reject(error);
    }

    // --- TẠM THỜI COMMENT XỬ LÝ REFRESH TOKEN ---
    // // If error is 401 and we haven't tried to refresh yet
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   if (isRefreshing) {
    //     // If already refreshing, queue this request
    //     return new Promise((resolve, reject) => {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         originalRequest.headers.Authorization = `Bearer ${token}`;
    //         return http(originalRequest);
    //       })
    //       .catch((err) => {
    //         return Promise.reject(err);
    //       });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const refreshToken = await SecureStore.getItemAsync("refreshToken");

    //     if (!refreshToken) {
    //       throw new Error("No refresh token available");
    //     }

    //     // Call refresh token endpoint
    //     // const response = await axios.post(
    //     //   `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    //     //   { refreshToken },
    //     // );

    //     const { accessToken, refreshToken: newRefreshToken } = response.data;

    //     // Save new tokens
    //     await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    //     // if (newRefreshToken) {
    //     //   await SecureStore.setItemAsync("refreshToken", newRefreshToken);
    //     // }

    //     // Update authorization header
    //     http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    //     originalRequest.headers.Authorization = `Bearer ${accessToken}`;

    //     // Process queued requests
    //     processQueue(null, accessToken);

    //     isRefreshing = false;

    //     // Retry original request
    //     return http(originalRequest);
    //   } catch (refreshError) {
    //     processQueue(refreshError, null);
    //     isRefreshing = false;

    //     // Clear tokens and redirect to login
    //     await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    //     // await SecureStore.deleteItemAsync("refreshToken");
    //     await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);

    //     // Note: You might want to use a navigation service here to redirect to login
    //     // or dispatch a logout action to your auth store

    //     return Promise.reject(refreshError);
    //   }
    // }

    // Giảm noise log cho Network Error (nhất là khi upload file / mock API)
    if (__DEV__) {
      const message = error?.message || "";
      const url = error?.config?.url as string | undefined;

      // Bỏ qua log cho create-post Network Error (đã được mock xử lý trong service)
      const isCreatePost =
        url === "/api/post-context/create-post" && message === "Network Error";

      if (!isCreatePost) {
        console.error("API Error:", error.response?.data || message);
      }
    }

    return Promise.reject(error);
  },
);
