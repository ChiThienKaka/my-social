# 🔐 Authentication Implementation Guide

Complete authentication system cho My Social App sử dụng Zustand + SecureStore + Auto Token Refresh.

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [API Integration](#api-integration)
5. [Files Structure](#files-structure)
6. [Usage Examples](#usage-examples)
7. [Security](#security)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### ✨ Features

- ✅ **Login/Logout** với email & password
- ✅ **Social Login** (Google, Apple, University SSO)
- ✅ **Auto Token Refresh** khi access token hết hạn
- ✅ **Persistent Session** - User không cần login lại khi mở app
- ✅ **Secure Storage** - Tokens lưu trong SecureStore (encrypted)
- ✅ **Request Queue** - Queue API requests khi đang refresh token
- ✅ **Protected Routes** - Auto redirect nếu chưa login
- ✅ **TypeScript** - Fully typed
- ✅ **Loading States** - Manage UI states properly

### 🛠 Tech Stack

- **State Management**: Zustand
- **Storage**: expo-secure-store (encrypted)
- **HTTP Client**: Axios với interceptors
- **Navigation**: expo-router
- **Types**: TypeScript

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App Layer                            │
│  (_layout.tsx - useAuthInitialize on mount)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      Auth Feature                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Store      │  │   Service    │  │    Hooks     │     │
│  │  (Zustand)   │  │   (API)      │  │  (React)     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Persistence Layer                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SecureStore (Encrypted)                  │  │
│  │  - accessToken                                        │  │
│  │  - refreshToken                                       │  │
│  │  - user (JSON)                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      HTTP Layer                              │
│  (axios with interceptors)                                   │
│                                                              │
│  Request Interceptor:  Add accessToken to headers           │
│  Response Interceptor: Auto refresh on 401                  │
│                                                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│  POST /auth/login                                           │
│  POST /auth/register                                        │
│  POST /auth/refresh                                         │
│  POST /auth/logout                                          │
│  GET  /auth/me                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Environment Setup

Tạo file `.env` với API URL:

```bash
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

### 2. Initialize Auth in Root Layout

File: `src/app/_layout.tsx`

```typescript
import { useAuthInitialize } from "@/features/auth";

export default function RootLayout() {
  const { isInitialized, isLoading } = useAuthInitialize();

  if (!isInitialized || isLoading) {
    return <SplashScreen />;
  }

  return <YourApp />;
}
```

### 3. Implement Login Screen

```typescript
import { useAuthStore, authService } from "@/features/auth";

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    try {
      const response = await authService.login({ email, password });
      await login(response);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return <YourLoginUI onLogin={handleLogin} isLoading={isLoading} />;
}
```

### 4. Protect Routes

```typescript
import { useAuthStore } from "@/features/auth";
import { Redirect } from "expo-router";

export default function ProtectedScreen() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <YourProtectedContent />;
}
```

---

## API Integration

### Required Backend Endpoints

#### 1. POST `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 2. POST `/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // Optional: new refresh token
}
```

#### 3. GET `/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  }
}
```

#### 4. POST `/auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Files Structure

```
src/
├── app/
│   ├── _layout.tsx              # ✅ Initialize auth here
│   ├── api/
│   │   └── http.ts              # ✅ Axios with token interceptors
│   └── (auth)/
│       ├── login.tsx            # Login screen
│       └── register.tsx         # Register screen
│
└── features/
    └── auth/
        ├── store/
        │   └── auth.store.ts    # 🔥 Zustand store (main logic)
        ├── services/
        │   └── auth.service.ts  # API calls
        ├── hooks/
        │   └── useAuthInitialize.ts  # Initialize hook
        ├── components/
        │   ├── RoleButton.tsx
        │   └── SocialButton.tsx
        ├── types/
        │   └── auth.ts          # TypeScript types
        ├── examples/            # 📖 Example implementations
        │   ├── LoginExample.tsx
        │   ├── ProtectedScreenExample.tsx
        │   └── README.md
        ├── index.ts             # Public exports
        ├── README.md            # Feature documentation
        └── FLOW.md              # Flow diagrams
```

---

## Usage Examples

### 📖 See Full Examples

Xem các file trong `src/features/auth/examples/`:
- `LoginExample.tsx` - Complete login implementation
- `ProtectedScreenExample.tsx` - Protected screen with auth guard

### Common Patterns

#### 1. Check if User is Logged In

```typescript
const { isAuthenticated, user } = useAuthStore();

if (isAuthenticated) {
  console.log("Logged in as:", user?.name);
}
```

#### 2. Show User Info

```typescript
const { user } = useAuthStore();

return (
  <View>
    <Text>{user?.name}</Text>
    <Text>{user?.email}</Text>
    <Text>Role: {user?.role}</Text>
  </View>
);
```

#### 3. Logout

```typescript
const { logout } = useAuthStore();

const handleLogout = async () => {
  await logout();
  router.replace("/(auth)/login");
};
```

#### 4. Refresh User Data

```typescript
const { getUserInfo, isLoading } = useAuthStore();

useEffect(() => {
  getUserInfo(); // Fetch latest user data from server
}, []);
```

#### 5. Social Login

```typescript
import { authService } from "@/features/auth";

const handleGoogleLogin = async (googleToken: string) => {
  const response = await authService.socialLogin({
    provider: "google",
    token: googleToken,
  });
  
  await login(response);
  router.replace("/(tabs)");
};
```

---

## Security

### ✅ Security Features

1. **Encrypted Storage**: Tokens lưu trong SecureStore (Keychain/Keystore)
2. **Auto Token Refresh**: Access token auto refresh khi hết hạn
3. **Request Queue**: Prevent multiple refresh calls
4. **HTTPS Only**: All API calls use HTTPS
5. **Token Expiry**: Short-lived access tokens (15-30 min)
6. **Logout on Failure**: Auto logout if refresh fails

### 🔒 Best Practices

#### DO ✅
- Store tokens in SecureStore
- Use short-lived access tokens (15-30 minutes)
- Use longer-lived refresh tokens (7-30 days)
- Clear all data on logout
- Validate tokens on app start
- Use HTTPS for all API calls
- Implement rate limiting on backend

#### DON'T ❌
- Store tokens in AsyncStorage (not encrypted)
- Store tokens in Redux/Zustand only (lost on close)
- Store sensitive data in plain text
- Make access tokens long-lived
- Trust client-side validation only
- Skip token validation

---

## Testing

### Manual Testing Checklist

- [ ] **Login Flow**
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials
  - [ ] Show loading state during login
  - [ ] Show error messages
  - [ ] Navigate to home after login

- [ ] **Logout Flow**
  - [ ] Logout clears all tokens
  - [ ] Navigate to login after logout
  - [ ] Can login again after logout

- [ ] **Auto-Login**
  - [ ] Open app → auto login with saved tokens
  - [ ] Works after closing and reopening app
  - [ ] Works after force close

- [ ] **Token Refresh**
  - [ ] Auto refresh when access token expires
  - [ ] Continue API calls after refresh
  - [ ] Logout when refresh token expires

- [ ] **Protected Routes**
  - [ ] Redirect to login if not authenticated
  - [ ] Allow access if authenticated

- [ ] **Network Errors**
  - [ ] Handle network errors gracefully
  - [ ] Show error messages
  - [ ] Allow retry

### Unit Testing Example

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import useAuthStore from "./auth.store";

describe("AuthStore", () => {
  it("should login successfully", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login({
        user: mockUser,
        accessToken: "token123",
        refreshToken: "refresh123",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("should logout successfully", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

---

## Troubleshooting

### Issue: User not auto-logged in on app start

**Solution:**
1. Check if `useAuthInitialize()` is called in `_layout.tsx`
2. Check if tokens exist in SecureStore:
   ```typescript
   const token = await SecureStore.getItemAsync("accessToken");
   console.log("Token:", token);
   ```
3. Check if `initialize()` is throwing errors
4. Check network connection

### Issue: Token refresh not working

**Solution:**
1. Check if refresh token exists
2. Check if backend `/auth/refresh` endpoint works
3. Check token expiry times
4. Check axios interceptor logs:
   ```typescript
   http.interceptors.response.use((res) => {
     console.log("Response:", res.status, res.config.url);
     return res;
   });
   ```

### Issue: Multiple refresh calls

**Solution:**
- This is handled automatically by the request queue
- Check if `isRefreshing` flag is working properly
- Check if `failedQueue` is being processed

### Issue: Tokens not saving to SecureStore

**Solution:**
1. Check SecureStore permissions
2. Check if running on physical device (SecureStore doesn't work on web)
3. Check error logs in `login()` function
4. Try clearing SecureStore:
   ```typescript
   await SecureStore.deleteItemAsync("accessToken");
   await SecureStore.deleteItemAsync("refreshToken");
   await SecureStore.deleteItemAsync("user");
   ```

### Issue: "401 Unauthorized" on every request

**Solution:**
1. Check if token is being added to headers (check interceptor)
2. Check token format (should be `Bearer {token}`)
3. Check if token is expired
4. Check backend authentication middleware
5. Verify API URL in `.env`

---

## 📞 Support

Nếu có vấn đề:
1. Check [FLOW.md](src/features/auth/FLOW.md) để hiểu flow
2. Check [examples/](src/features/auth/examples/) để xem implementation
3. Check [README.md](src/features/auth/README.md) để xem API docs
4. Check console logs để debug

---

## 📝 Notes

- **SecureStore Size Limit**: 2KB per item. Nếu user data lớn, cân nhắc lưu ID và fetch từ API
- **Expo Go Limitation**: SecureStore works on Expo Go, nhưng production app nên build native
- **Token Expiry**: Backend nên trả về expiry time. Client có thể proactively refresh trước khi hết hạn
- **Multiple Devices**: Implement device management nếu cần track devices
- **Biometric Auth**: Có thể thêm FaceID/TouchID bằng `expo-local-authentication`

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-21  
**Author:** AI Assistant
