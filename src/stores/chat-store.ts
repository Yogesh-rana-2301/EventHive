import { create } from "zustand";
import { DUMMY_CHAT_ROOMS, DUMMY_MESSAGES } from "@/lib/dummy-data";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar?: string;
  timestamp: string;
  isAnonymous: boolean;
  reactions: { emoji: string; count: number; users: string[] }[];
  replyTo?: string;
  isReported: boolean;
  isDeleted: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "event" | "city" | "state" | "global";
  eventId?: string;
  location?: {
    city?: string;
    state?: string;
  };
  participants: number;
  isActive: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatState {
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  messages: { [roomId: string]: ChatMessage[] };
  isConnected: boolean;
  isLoading: boolean;
  typingUsers: { [roomId: string]: string[] };
  realtimeChannel: RealtimeChannel | null;

  // Actions
  connectToSocket: () => void;
  disconnectFromSocket: () => void;
  fetchRooms: () => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => void;
  sendMessage: (
    roomId: string,
    content: string,
    isAnonymous?: boolean
  ) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  reportMessage: (messageId: string, reason: string) => void;
  blockUser: (userId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  setTyping: (roomId: string, isTyping: boolean) => void;
  loadMessages: (roomId: string, page?: number) => Promise<void>;
  clearUnreadCount: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeRoom: null,
  rooms: [],
  messages: {},
  isConnected: false,
  isLoading: false,
  typingUsers: {},
  realtimeChannel: null,

  connectToSocket: () => {
    console.log("Connecting to Supabase Realtime...");
    set({ isConnected: true });
  },

  disconnectFromSocket: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
    console.log("Disconnecting from Supabase Realtime...");
    set({ isConnected: false, realtimeChannel: null });
  },

  fetchRooms: async () => {
    try {
      set({ isLoading: true });

      // Fetch chat rooms with event details
      const { data: roomsData, error } = await supabase
        .from("chat_rooms")
        .select(
          `
          *,
          event:events!event_id (
            id,
            title,
            city,
            state
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching rooms:", error);
        set({ rooms: DUMMY_CHAT_ROOMS, isLoading: false });
        return;
      }

      const rooms: ChatRoom[] = (roomsData || []).map((room: any) => ({
        id: room.id,
        name: room.name,
        type: room.type,
        eventId: room.event_id,
        location: room.event
          ? {
              city: room.event.city,
              state: room.event.state,
            }
          : undefined,
        participants: 0, // TODO: Count from separate query
        isActive: true,
        unreadCount: 0,
      }));

      set({ rooms, isLoading: false });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ rooms: DUMMY_CHAT_ROOMS, isLoading: false });
    }
  },

  joinRoom: async (roomId) => {
    const { realtimeChannel: oldChannel } = get();

    // Unsubscribe from old channel if exists
    if (oldChannel) {
      supabase.removeChannel(oldChannel);
    }

    try {
      // Fetch room details from database
      const { data: roomData, error: roomError } = await supabase
        .from("chat_rooms")
        .select(
          `
          *,
          event:events!event_id (
            id,
            title,
            city,
            state
          )
        `
        )
        .eq("id", roomId)
        .single();

      if (roomError) {
        console.error("Error fetching room:", roomError);
        throw roomError;
      }

      if (!roomData) {
        throw new Error("Room not found");
      }

      const room: ChatRoom = {
        id: (roomData as any).id,
        name: (roomData as any).name,
        type: (roomData as any).type,
        eventId: (roomData as any).event_id,
        location: (roomData as any).event
          ? {
              city: (roomData as any).event.city,
              state: (roomData as any).event.state,
            }
          : undefined,
        participants: 0,
        isActive: true,
        unreadCount: 0,
      };

      set({ activeRoom: room });

      // Load existing messages
      await get().loadMessages(roomId);

      // Subscribe to new messages in this room
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            console.log("New message received:", payload);

            // Fetch user details for the message
            const { data: userData } = await supabase
              .from("profiles")
              .select("name, avatar_url")
              .eq("id", payload.new.user_id)
              .single();

            const newMessage: ChatMessage = {
              id: payload.new.id,
              content: payload.new.content,
              userId: payload.new.user_id,
              username: (userData as any)?.name || "Unknown User",
              avatar: (userData as any)?.avatar_url,
              timestamp: payload.new.created_at,
              isAnonymous: false,
              reactions: [],
              isReported: false,
              isDeleted: false,
            };

            set((state) => ({
              messages: {
                ...state.messages,
                [roomId]: [...(state.messages[roomId] || []), newMessage],
              },
            }));
          }
        )
        .subscribe();

      set({ realtimeChannel: channel, isConnected: true });
      console.log(`Joined room: ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  },

  leaveRoom: (roomId) => {
    const { activeRoom, realtimeChannel } = get();

    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }

    if (activeRoom?.id === roomId) {
      set({ activeRoom: null, realtimeChannel: null });
    }

    console.log(`Leaving room: ${roomId}`);
  },

  sendMessage: async (roomId, content, isAnonymous = false) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Insert message into database
      const { data, error } = await (supabase as any)
        .from("messages")
        .insert([
          {
            room_id: roomId,
            user_id: user.id,
            content: content.trim(),
            type: "text",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("Message sent successfully:", data);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  editMessage: (messageId, newContent) => {
    // TODO: Emit edit message event to socket
    console.log(`Editing message ${messageId}:`, newContent);

    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((roomId) => {
        newMessages[roomId] = newMessages[roomId].map((msg) =>
          msg.id === messageId ? { ...msg, content: newContent } : msg
        );
      });

      return { messages: newMessages };
    });
  },

  deleteMessage: (messageId) => {
    // TODO: Emit delete message event to socket
    console.log(`Deleting message: ${messageId}`);

    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((roomId) => {
        newMessages[roomId] = newMessages[roomId].map((msg) =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, content: "[Message deleted]" }
            : msg
        );
      });

      return { messages: newMessages };
    });
  },

  reportMessage: async (messageId, reason) => {
    try {
      // TODO: Replace with actual API call
      await fetch("/api/moderation/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, reason, type: "message" }),
      });

      console.log(`Reported message ${messageId}: ${reason}`);
    } catch (error) {
      console.error("Failed to report message:", error);
      throw error;
    }
  },

  blockUser: async (userId) => {
    try {
      // TODO: Replace with actual API call
      await fetch("/api/moderation/block-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      console.log(`Blocked user: ${userId}`);

      // Remove all messages from blocked user
      set((state) => {
        const newMessages = { ...state.messages };

        Object.keys(newMessages).forEach((roomId) => {
          newMessages[roomId] = newMessages[roomId].filter(
            (msg) => msg.userId !== userId
          );
        });

        return { messages: newMessages };
      });
    } catch (error) {
      console.error("Failed to block user:", error);
      throw error;
    }
  },

  addReaction: (messageId, emoji) => {
    const currentUserId = "current-user-id"; // TODO: Get from auth store

    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((roomId) => {
        newMessages[roomId] = newMessages[roomId].map((msg) => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions.find(
              (r) => r.emoji === emoji
            );

            if (existingReaction) {
              if (existingReaction.users.includes(currentUserId)) {
                // Remove reaction
                return {
                  ...msg,
                  reactions: msg.reactions
                    .map((r) =>
                      r.emoji === emoji
                        ? {
                            ...r,
                            count: r.count - 1,
                            users: r.users.filter((u) => u !== currentUserId),
                          }
                        : r
                    )
                    .filter((r) => r.count > 0),
                };
              } else {
                // Add reaction
                return {
                  ...msg,
                  reactions: msg.reactions.map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count + 1,
                          users: [...r.users, currentUserId],
                        }
                      : r
                  ),
                };
              }
            } else {
              // New reaction
              return {
                ...msg,
                reactions: [
                  ...msg.reactions,
                  { emoji, count: 1, users: [currentUserId] },
                ],
              };
            }
          }
          return msg;
        });
      });

      return { messages: newMessages };
    });
  },

  removeReaction: (messageId, emoji) => {
    const currentUserId = "current-user-id"; // TODO: Get from auth store

    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((roomId) => {
        newMessages[roomId] = newMessages[roomId].map((msg) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count - 1,
                        users: r.users.filter((u) => u !== currentUserId),
                      }
                    : r
                )
                .filter((r) => r.count > 0),
            };
          }
          return msg;
        });
      });

      return { messages: newMessages };
    });
  },

  setTyping: (roomId, isTyping) => {
    const currentUserId = "current-user-id"; // TODO: Get from auth store

    set((state) => {
      const currentTyping = state.typingUsers[roomId] || [];

      if (isTyping) {
        if (!currentTyping.includes(currentUserId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [roomId]: [...currentTyping, currentUserId],
            },
          };
        }
      } else {
        return {
          typingUsers: {
            ...state.typingUsers,
            [roomId]: currentTyping.filter((u) => u !== currentUserId),
          },
        };
      }

      return state;
    });
  },

  loadMessages: async (roomId, page = 1) => {
    set({ isLoading: true });

    try {
      const limit = 50;
      const offset = (page - 1) * limit;

      // Fetch messages from Supabase
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user:profiles!user_id (
            id,
            name,
            avatar_url
          )
        `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error loading messages:", error);
        throw error;
      }

      // Transform to ChatMessage format
      const messages: ChatMessage[] = (messagesData || []).map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        userId: msg.user_id,
        username: msg.user?.name || "Unknown User",
        avatar: msg.user?.avatar_url,
        timestamp: msg.created_at,
        isAnonymous: false,
        reactions: [],
        isReported: false,
        isDeleted: false,
      }));

      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]:
            page === 1
              ? messages
              : [...messages, ...(state.messages[roomId] || [])],
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to load messages:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  clearUnreadCount: (roomId) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      ),
    }));
  },
}));
