import { create } from "zustand";
import {
  notificationService,
  type AppNotification,
} from "../services/notification.service";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: (userName: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userName: string) => {
    set({ isLoading: true });
    try {
      const notifications =
        await notificationService.getNotifications(userName);
      const unreadCount = notifications.filter((n) => n.unread).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    await notificationService.markAsRead(id);
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n,
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => n.unread).length,
      };
    });
  },

  markAllAsRead: async () => {
    const allIds = get().notifications.map((n) => n.id);
    await notificationService.markAllAsRead(allIds);
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, unread: false })),
      unreadCount: 0,
    }));
  },
}));

export default useNotificationStore;
