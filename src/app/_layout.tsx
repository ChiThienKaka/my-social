import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StackScreen } from "react-native-screens";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/features/auth";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {
  // const isAuthenticated = false;
  const { initialize, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  useEffect(() => {
    initialize();
  }, []);
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="announcements" options={{ headerShown: false }} />
        <Stack.Screen name="announcements/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="deadlines" options={{ headerShown: false }} />
        <Stack.Screen name="deadlines/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="events" options={{ headerShown: false }} />
        <Stack.Screen name="events/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="post/create" options={{ headerShown: false }} />
          <Stack.Screen name="post/details" options={{ headerShown: false }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
          <Stack.Screen name="profile/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="job/[id]"
            options={{
              headerShown: true,
              title: "Chi tiết công việc",
            }}
          />
          <Stack.Screen name="job/applications" options={{ headerShown: false }} />
          <Stack.Screen
            name="job/application/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="job/apply"
            options={{
              headerShown: true,
              title: "Ứng tuyển",
            }}
          />
        </Stack.Protected>
        <Stack.Screen name="not-found" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
