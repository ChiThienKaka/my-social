import { create } from "zustand";
import {
  chatService,
  type ConversationItem,
  type ChatMessage,
  type GroupMessage,
} from "../services/chat.service";
import { groupService, type GroupItem } from "../services/group.service";

export interface NormalizedMessage {
  id: number;
  content: string;
  isOwn: boolean;
  timestamp: string;
  senderName: string;
  senderAvatar: string | null;
  senderId: number;
}

interface ChatState {
  conversations: ConversationItem[];
  groups: GroupItem[];
  messages: NormalizedMessage[];
  isLoading: boolean;
  pollingId: ReturnType<typeof setInterval> | null;

  fetchConversations: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  fetchMessages: (chatId: string, isGroup: boolean, currentUserId: number) => Promise<void>;
  sendMessage: (receiverId: number, content: string, currentUserId: number) => Promise<void>;
  sendGroupMessage: (groupId: number, content: string, currentUserId: number) => Promise<void>;
  startPolling: (
    chatId: string,
    isGroup: boolean,
    currentUserId: number,
    interval?: number,
  ) => void;
  stopPolling: () => void;
}

function formatTimestamp(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin}ph trước`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h trước`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  } catch {
    return dateStr;
  }
}

function normalizeChat(msg: ChatMessage, currentUserId: number): NormalizedMessage {
  return {
    id: msg.message_id,
    content: msg.content,
    isOwn: msg.sender_id === currentUserId,
    timestamp: formatTimestamp(msg.created_at),
    senderName: msg.sender?.full_name || "User",
    senderAvatar: msg.sender?.avatar_url || null,
    senderId: msg.sender_id,
  };
}

function normalizeGroup(msg: GroupMessage, currentUserId: number): NormalizedMessage {
  return {
    id: msg.message_id,
    content: msg.content,
    isOwn: msg.user_id === currentUserId,
    timestamp: formatTimestamp(msg.created_at),
    senderName: msg.user?.full_name || "User",
    senderAvatar: msg.user?.avatar_url || null,
    senderId: msg.user_id,
  };
}

const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  groups: [],
  messages: [],
  isLoading: false,
  pollingId: null,

  fetchConversations: async () => {
    try {
      const conversations = await chatService.getRecentConversations();
      set({ conversations });
    } catch {
      /* silently fail */
    }
  },

  fetchGroups: async () => {
    try {
      const groups = await groupService.getGroupsByUser();
      set({ groups });
    } catch {
      /* silently fail */
    }
  },

  fetchMessages: async (chatId, isGroup, currentUserId) => {
    set({ isLoading: true });
    try {
      if (isGroup) {
        const raw = await chatService.getGroupMessages(Number(chatId));
        set({ messages: raw.map((m) => normalizeGroup(m, currentUserId)) });
      } else {
        const raw = await chatService.getConversation(Number(chatId));
        set({ messages: raw.map((m) => normalizeChat(m, currentUserId)) });
      }
    } catch {
      /* silently fail */
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (receiverId, content, currentUserId) => {
    const optimistic: NormalizedMessage = {
      id: Date.now(),
      content,
      isOwn: true,
      timestamp: "Vừa xong",
      senderName: "Bạn",
      senderAvatar: null,
      senderId: currentUserId,
    };
    set((s) => ({ messages: [...s.messages, optimistic] }));
    try {
      await chatService.sendMessage(receiverId, content);
    } catch {
      set((s) => ({ messages: s.messages.filter((m) => m.id !== optimistic.id) }));
    }
  },

  sendGroupMessage: async (groupId, content, currentUserId) => {
    const optimistic: NormalizedMessage = {
      id: Date.now(),
      content,
      isOwn: true,
      timestamp: "Vừa xong",
      senderName: "Bạn",
      senderAvatar: null,
      senderId: currentUserId,
    };
    set((s) => ({ messages: [...s.messages, optimistic] }));
    try {
      await chatService.sendGroupMessage(groupId, content);
    } catch {
      set((s) => ({ messages: s.messages.filter((m) => m.id !== optimistic.id) }));
    }
  },

  startPolling: (chatId, isGroup, currentUserId, interval = 5000) => {
    get().stopPolling();
    const id = setInterval(() => {
      get().fetchMessages(chatId, isGroup, currentUserId);
    }, interval);
    set({ pollingId: id });
  },

  stopPolling: () => {
    const { pollingId } = get();
    if (pollingId) {
      clearInterval(pollingId);
      set({ pollingId: null });
    }
  },
}));

export default useChatStore;
