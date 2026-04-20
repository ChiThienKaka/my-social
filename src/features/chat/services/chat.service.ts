import { http } from "@/app/api/http";

export interface ConversationItem {
  user_id: number;
  full_name: string;
  avatar_url: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count?: number;
}

export interface ChatMessage {
  message_id: number;
  sender_id: number;
  receiver_id?: number;
  group_id?: number;
  content: string;
  created_at: string;
  sender?: {
    user_id: number;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface GroupMessage {
  message_id: number;
  user_id: number;
  group_id: number;
  content: string;
  created_at: string;
  user?: {
    user_id: number;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface GroupMember {
  user_id: number;
  full_name: string;
  avatar_url: string | null;
  member_role: string;
}

function extractArray<T>(res: any): T[] {
  if (Array.isArray(res.data)) return res.data;
  if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
}

export const chatService = {
  getRecentConversations: async (): Promise<ConversationItem[]> => {
    try {
      const res = await http.get("/api/user-chat/recent-conversations");
      return extractArray<ConversationItem>(res);
    } catch (error) {
      console.warn("[chatService.getRecentConversations] error:", error);
      return [];
    }
  },

  getConversation: async (
    otherUserId: number,
    page = 1,
  ): Promise<ChatMessage[]> => {
    try {
      const res = await http.get(
        `/api/user-chat/conversation/${otherUserId}`,
        { params: { page } },
      );
      return extractArray<ChatMessage>(res);
    } catch (error) {
      console.warn("[chatService.getConversation] error:", error);
      return [];
    }
  },

  sendMessage: async (
    receiverId: number,
    content: string,
  ): Promise<ChatMessage | null> => {
    try {
      const res = await http.post("/api/user-chat/send-message", {
        receiver_id: receiverId,
        content,
      });
      return res.data?.data || res.data;
    } catch (error) {
      console.warn("[chatService.sendMessage] error:", error);
      throw error;
    }
  },

  deleteMessage: async (messageId: number): Promise<void> => {
    await http.delete(`/api/user-chat/delete-message/${messageId}`);
  },

  sendGroupMessage: async (
    groupId: number,
    content: string,
  ): Promise<GroupMessage | null> => {
    try {
      const res = await http.post(
        "/api/group-student/create-group-message",
        { group_id: groupId, content },
      );
      return res.data?.data || res.data;
    } catch (error) {
      console.warn("[chatService.sendGroupMessage] error:", error);
      throw error;
    }
  },

  getGroupMessages: async (
    groupId: number,
    page = 1,
  ): Promise<GroupMessage[]> => {
    try {
      const res = await http.get(
        "/api/group-student/list-message-group",
        { params: { group_id: groupId, page } },
      );
      return extractArray<GroupMessage>(res);
    } catch (error) {
      console.warn("[chatService.getGroupMessages] error:", error);
      return [];
    }
  },

  getGroupMembers: async (groupId: number): Promise<GroupMember[]> => {
    try {
      const res = await http.get(
        `/api/group-student/get-users-by-group/${groupId}`,
      );
      return extractArray<GroupMember>(res);
    } catch (error) {
      console.warn("[chatService.getGroupMembers] error:", error);
      return [];
    }
  },
};
