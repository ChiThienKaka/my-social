import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotificationType } from "../types";

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  timeAgo: string;
  unread: boolean;
  boldText: string[];
  avatar?: {
    source?: { uri: string };
    badge?: {
      icon: string;
      backgroundColor: string;
      iconColor: string;
    };
    backgroundColor?: string;
    icon?: string;
    iconColor?: string;
  };
  createdAt: number;
}

const STORAGE_KEY = "tdmu_notifications_read";

function generateNotifications(userName: string): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: "n1",
      message: `Phòng Đào tạo đã đăng thông báo mới: "Lịch đăng ký học phần HK2 2025-2026"`,
      type: "academic",
      timeAgo: "5 phút trước",
      unread: true,
      boldText: ["Phòng Đào tạo"],
      avatar: {
        backgroundColor: "#DBEAFE",
        icon: "school-outline",
        iconColor: "#2563EB",
      },
      createdAt: now - 5 * 60000,
    },
    {
      id: "n2",
      message: `Nguyễn Văn Minh đã thích bài viết của bạn trong Cộng đồng`,
      type: "social",
      timeAgo: "20 phút trước",
      unread: true,
      boldText: ["Nguyễn Văn Minh"],
      avatar: {
        badge: {
          icon: "heart",
          backgroundColor: "#EC4899",
          iconColor: "#FFFFFF",
        },
      },
      createdAt: now - 20 * 60000,
    },
    {
      id: "n3",
      message: `Nhóm "Lập trình Web" có tin nhắn mới từ Trần Thị Mai`,
      type: "social",
      timeAgo: "1 giờ trước",
      unread: true,
      boldText: ["Lập trình Web", "Trần Thị Mai"],
      avatar: {
        backgroundColor: "#E9D5FF",
        icon: "people-outline",
        iconColor: "#9333EA",
      },
      createdAt: now - 60 * 60000,
    },
    {
      id: "n4",
      message: `Thông báo trường: Thư viện mở cửa phục vụ đến 21h trong tuần thi`,
      type: "system",
      timeAgo: "2 giờ trước",
      unread: false,
      boldText: ["Thông báo trường"],
      avatar: {
        backgroundColor: "#FED7AA",
        icon: "megaphone-outline",
        iconColor: "#EA580C",
      },
      createdAt: now - 2 * 3600000,
    },
    {
      id: "n5",
      message: `Điểm môn "Cấu trúc dữ liệu" đã được công bố. Kiểm tra kết quả ngay.`,
      type: "academic",
      timeAgo: "Hôm qua",
      unread: false,
      boldText: ["Cấu trúc dữ liệu"],
      avatar: {
        backgroundColor: "#BBF7D0",
        icon: "checkmark-circle-outline",
        iconColor: "#16A34A",
      },
      createdAt: now - 24 * 3600000,
    },
    {
      id: "n6",
      message: `Hạn nộp học phí HK2 còn 3 ngày. Vui lòng hoàn thành trước 15/04/2026.`,
      type: "academic",
      timeAgo: "Hôm qua",
      unread: false,
      boldText: ["Hạn nộp học phí"],
      avatar: {
        backgroundColor: "#FEE2E2",
        icon: "alert-circle-outline",
        iconColor: "#DC2626",
      },
      createdAt: now - 26 * 3600000,
    },
    {
      id: "n7",
      message: `Ngày hội Việc làm TDMU 2026 diễn ra vào thứ 7 tuần này tại Hội trường A.`,
      type: "event",
      timeAgo: "2 ngày trước",
      unread: false,
      boldText: ["Ngày hội Việc làm TDMU 2026"],
      avatar: {
        backgroundColor: "#E9D5FF",
        icon: "calendar-outline",
        iconColor: "#9333EA",
      },
      createdAt: now - 48 * 3600000,
    },
    {
      id: "n8",
      message: `Lê Hoàng Anh đã nhắc đến bạn trong bình luận: "@${userName}, bạn có đi lab không?"`,
      type: "social",
      timeAgo: "2 ngày trước",
      unread: false,
      boldText: ["Lê Hoàng Anh"],
      avatar: {
        backgroundColor: "#E9D5FF",
        icon: "at-outline",
        iconColor: "#9333EA",
      },
      createdAt: now - 50 * 3600000,
    },
  ];
}

export const notificationService = {
  getNotifications: async (userName: string): Promise<AppNotification[]> => {
    const notifications = generateNotifications(userName);
    const readIds = await notificationService.getReadIds();
    return notifications.map((n) => ({
      ...n,
      unread: !readIds.includes(n.id) && n.unread,
    }));
  },

  getReadIds: async (): Promise<string[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    const ids = await notificationService.getReadIds();
    if (!ids.includes(id)) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]));
    }
  },

  markAllAsRead: async (allIds: string[]): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
  },
};
