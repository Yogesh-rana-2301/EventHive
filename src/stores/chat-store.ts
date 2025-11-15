import { create } from 'zustand'
import { DUMMY_CHAT_ROOMS, DUMMY_MESSAGES } from '@/lib/dummy-data'

export interface ChatMessage {
  id: string
  content: string
  userId: string
  username: string
  avatar?: string
  timestamp: string
  isAnonymous: boolean
  reactions: { emoji: string; count: number; users: string[] }[]
  replyTo?: string
  isReported: boolean
  isDeleted: boolean
}

export interface ChatRoom {
  id: string
  name: string
  type: 'event' | 'city' | 'state' | 'global'
  eventId?: string
  location?: {
    city?: string
    state?: string
  }
  participants: number
  isActive: boolean
  lastMessage?: ChatMessage
  unreadCount: number
}

interface ChatState {
  activeRoom: ChatRoom | null
  rooms: ChatRoom[]
  messages: { [roomId: string]: ChatMessage[] }
  isConnected: boolean
  isLoading: boolean
  typingUsers: { [roomId: string]: string[] }
  
  // Actions
  connectToSocket: () => void
  disconnectFromSocket: () => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  sendMessage: (roomId: string, content: string, isAnonymous?: boolean) => void
  editMessage: (messageId: string, newContent: string) => void
  deleteMessage: (messageId: string) => void
  reportMessage: (messageId: string, reason: string) => void
  blockUser: (userId: string) => void
  addReaction: (messageId: string, emoji: string) => void
  removeReaction: (messageId: string, emoji: string) => void
  setTyping: (roomId: string, isTyping: boolean) => void
  loadMessages: (roomId: string, page?: number) => Promise<void>
  clearUnreadCount: (roomId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeRoom: null,
  rooms: DUMMY_CHAT_ROOMS,
  messages: { 'chat-event-1': DUMMY_MESSAGES },
  isConnected: false,
  isLoading: false,
  typingUsers: {},

  connectToSocket: () => {
    // TODO: Initialize Socket.io connection
    console.log('Connecting to chat socket...')
    set({ isConnected: true })
  },

  disconnectFromSocket: () => {
    // TODO: Disconnect Socket.io
    console.log('Disconnecting from chat socket...')
    set({ isConnected: false })
  },

  joinRoom: (roomId) => {
    const { rooms } = get()
    const room = rooms.find(r => r.id === roomId) || DUMMY_CHAT_ROOMS.find(r => r.id === roomId)
    
    if (room) {
      set({ activeRoom: room })
      // TODO: Emit join room event to socket
      console.log(`Joining room: ${roomId}`)
    }
  },

  leaveRoom: (roomId) => {
    const { activeRoom } = get()
    
    if (activeRoom?.id === roomId) {
      set({ activeRoom: null })
    }
    
    // TODO: Emit leave room event to socket
    console.log(`Leaving room: ${roomId}`)
  },

  sendMessage: (roomId, content, isAnonymous = false) => {
    const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
      content,
      userId: 'current-user-id', // TODO: Get from auth store
      username: isAnonymous ? 'Anonymous' : 'Current User', // TODO: Get from auth store
      isAnonymous,
      reactions: [],
      isReported: false,
      isDeleted: false
    }

    // TODO: Emit message to socket
    console.log(`Sending message to ${roomId}:`, content)
    
    // Optimistically add message to local state
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [
          ...(state.messages[roomId] || []),
          {
            ...message,
            id: `temp-${Date.now()}`,
            timestamp: new Date().toISOString()
          }
        ]
      }
    }))
  },

  editMessage: (messageId, newContent) => {
    // TODO: Emit edit message event to socket
    console.log(`Editing message ${messageId}:`, newContent)
    
    set((state) => {
      const newMessages = { ...state.messages }
      
      Object.keys(newMessages).forEach(roomId => {
        newMessages[roomId] = newMessages[roomId].map(msg =>
          msg.id === messageId ? { ...msg, content: newContent } : msg
        )
      })
      
      return { messages: newMessages }
    })
  },

  deleteMessage: (messageId) => {
    // TODO: Emit delete message event to socket
    console.log(`Deleting message: ${messageId}`)
    
    set((state) => {
      const newMessages = { ...state.messages }
      
      Object.keys(newMessages).forEach(roomId => {
        newMessages[roomId] = newMessages[roomId].map(msg =>
          msg.id === messageId ? { ...msg, isDeleted: true, content: '[Message deleted]' } : msg
        )
      })
      
      return { messages: newMessages }
    })
  },

  reportMessage: async (messageId, reason) => {
    try {
      // TODO: Replace with actual API call
      await fetch('/api/moderation/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reason, type: 'message' })
      })
      
      console.log(`Reported message ${messageId}: ${reason}`)
    } catch (error) {
      console.error('Failed to report message:', error)
      throw error
    }
  },

  blockUser: async (userId) => {
    try {
      // TODO: Replace with actual API call
      await fetch('/api/moderation/block-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      console.log(`Blocked user: ${userId}`)
      
      // Remove all messages from blocked user
      set((state) => {
        const newMessages = { ...state.messages }
        
        Object.keys(newMessages).forEach(roomId => {
          newMessages[roomId] = newMessages[roomId].filter(msg => msg.userId !== userId)
        })
        
        return { messages: newMessages }
      })
    } catch (error) {
      console.error('Failed to block user:', error)
      throw error
    }
  },

  addReaction: (messageId, emoji) => {
    const currentUserId = 'current-user-id' // TODO: Get from auth store
    
    set((state) => {
      const newMessages = { ...state.messages }
      
      Object.keys(newMessages).forEach(roomId => {
        newMessages[roomId] = newMessages[roomId].map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions.find(r => r.emoji === emoji)
            
            if (existingReaction) {
              if (existingReaction.users.includes(currentUserId)) {
                // Remove reaction
                return {
                  ...msg,
                  reactions: msg.reactions.map(r =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter(u => u !== currentUserId)
                        }
                      : r
                  ).filter(r => r.count > 0)
                }
              } else {
                // Add reaction
                return {
                  ...msg,
                  reactions: msg.reactions.map(r =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          count: r.count + 1,
                          users: [...r.users, currentUserId]
                        }
                      : r
                  )
                }
              }
            } else {
              // New reaction
              return {
                ...msg,
                reactions: [
                  ...msg.reactions,
                  { emoji, count: 1, users: [currentUserId] }
                ]
              }
            }
          }
          return msg
        })
      })
      
      return { messages: newMessages }
    })
  },

  removeReaction: (messageId, emoji) => {
    const currentUserId = 'current-user-id' // TODO: Get from auth store
    
    set((state) => {
      const newMessages = { ...state.messages }
      
      Object.keys(newMessages).forEach(roomId => {
        newMessages[roomId] = newMessages[roomId].map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count - 1,
                      users: r.users.filter(u => u !== currentUserId)
                    }
                  : r
              ).filter(r => r.count > 0)
            }
          }
          return msg
        })
      })
      
      return { messages: newMessages }
    })
  },

  setTyping: (roomId, isTyping) => {
    const currentUserId = 'current-user-id' // TODO: Get from auth store
    
    set((state) => {
      const currentTyping = state.typingUsers[roomId] || []
      
      if (isTyping) {
        if (!currentTyping.includes(currentUserId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [roomId]: [...currentTyping, currentUserId]
            }
          }
        }
      } else {
        return {
          typingUsers: {
            ...state.typingUsers,
            [roomId]: currentTyping.filter(u => u !== currentUserId)
          }
        }
      }
      
      return state
    })
  },

  loadMessages: async (roomId, page = 1) => {
    set({ isLoading: true })
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/chat/rooms/${roomId}/messages?page=${page}&limit=50`)
      
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }
      
      const messages = await response.json()
      
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: page === 1 ? messages : [...messages, ...(state.messages[roomId] || [])]
        },
        isLoading: false
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  clearUnreadCount: (roomId) => {
    set((state) => ({
      rooms: state.rooms.map(room =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      )
    }))
  }
}))