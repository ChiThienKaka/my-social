import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@/components/ui";
import colors from "@/constants/colors";
import useNotificationStore from "@/features/notification/store/useNotificationStore";

export default function TabLayout() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.icon.teal,
        tabBarInactiveTintColor: colors.icon.secondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              state={focused ? "active" : "inactive"}
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Cộng đồng",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="courses"
              state={focused ? "active" : "inactive"}
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="chat"
              state={focused ? "active" : "inactive"}
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recruit"
        options={{
          title: "Việc làm",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="briefcase-outline"
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Thông báo",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="notification"
              state={focused ? "active" : "inactive"}
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="profile"
              state={focused ? "active" : "inactive"}
              size={24}
              color={focused ? colors.icon.teal : colors.icon.secondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
