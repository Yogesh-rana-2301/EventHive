// API Configuration and Helpers for EventHive
// This file contains the main API integration points

class ApiConfig {
  private static instance: ApiConfig
  
  public readonly baseUrl: string
  public readonly socketUrl: string
  public readonly supabaseUrl: string
  public readonly supabaseKey: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    this.socketUrl = process.env.SOCKET_IO_URL || 'http://localhost:3001'
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }

  static getInstance(): ApiConfig {
    if (!ApiConfig.instance) {
      ApiConfig.instance = new ApiConfig()
    }
    return ApiConfig.instance
  }
}

export const apiConfig = ApiConfig.getInstance()

// Generic API client with error handling
export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl: string = apiConfig.baseUrl) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    // Add authentication token if available
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

// =============================================================================
// SPECIFIC API SERVICES - REPLACE DUMMY DATA WITH THESE
// =============================================================================

// 1. Events API Service
export const eventsApi = {
  // Replace fetchEvents in events-store.ts
  async getEvents(filters?: any) {
    return apiClient.get('/events' + (filters ? `?${new URLSearchParams(filters)}` : ''))
  },

  // Replace createEvent in events-store.ts
  async createEvent(eventData: any) {
    return apiClient.post('/events', eventData)
  },

  // Replace joinEvent in events-store.ts
  async joinEvent(eventId: string) {
    return apiClient.post(`/events/${eventId}/join`, {})
  },

  async getEventById(eventId: string) {
    return apiClient.get(`/events/${eventId}`)
  },

  async updateEvent(eventId: string, eventData: any) {
    return apiClient.put(`/events/${eventId}`, eventData)
  },

  async deleteEvent(eventId: string) {
    return apiClient.delete(`/events/${eventId}`)
  }
}

// 2. Authentication API Service  
export const authApi = {
  // Replace login in auth-store.ts
  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post<{token?: string; user: any}>('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('auth-token', response.token)
    }
    return response
  },

  // Replace register in auth-store.ts
  async register(userData: any) {
    const response = await apiClient.post<{token?: string; user: any}>('/auth/register', userData)
    if (response.token) {
      localStorage.setItem('auth-token', response.token)
    }
    return response
  },

  // Replace checkAuth in auth-store.ts
  async getProfile() {
    return apiClient.get('/auth/profile')
  },

  async updateProfile(profileData: any) {
    return apiClient.put('/auth/profile', profileData)
  },

  async logout() {
    localStorage.removeItem('auth-token')
    return apiClient.post('/auth/logout', {})
  }
}

// 3. Gamification API Service
export const gamificationApi = {
  // Replace gamification store actions
  async getUserStats() {
    return apiClient.get('/gamification/stats')
  },

  async awardPoints(points: number, reason: string) {
    return apiClient.post('/gamification/award-points', { points, reason })
  },

  async getUserBadges() {
    return apiClient.get('/gamification/badges')
  },

  async unlockBadge(badgeId: string) {
    return apiClient.post('/gamification/unlock-badge', { badgeId })
  },

  async getLeaderboard(type: 'points' | 'level' | 'events' = 'points') {
    return apiClient.get(`/gamification/leaderboard?type=${type}`)
  }
}

// 4. Payment API Service (Razorpay)
export const paymentApi = {
  async createOrder(orderData: any) {
    return apiClient.post('/payments/create-order', orderData)
  },

  async verifyPayment(paymentData: any) {
    return apiClient.post('/payments/verify', paymentData)
  },

  async getPaymentHistory() {
    return apiClient.get('/payments/history')
  }
}

// 5. Chat API Service (Socket.io)
import { io, Socket } from 'socket.io-client'

export const chatApi = {
  // Initialize Socket.io connection
  initializeSocket(): Socket {
    // Replace dummy socket in chat-store.ts
    const socket = io(apiConfig.socketUrl, {
      auth: {
        token: localStorage.getItem('auth-token')
      }
    })
    return socket
  },

  async getChatHistory(roomId: string) {
    return apiClient.get(`/chat/history/${roomId}`)
  },

  async createChatRoom(roomData: any) {
    return apiClient.post('/chat/rooms', roomData)
  }
}

// =============================================================================
// INTEGRATION INSTRUCTIONS
// =============================================================================

/*
TO INTEGRATE THESE APIS:

1. In events-store.ts, replace:
   - fetchEvents() with eventsApi.getEvents()
   - createEvent() with eventsApi.createEvent()
   - joinEvent() with eventsApi.joinEvent()

2. In auth-store.ts, replace:
   - login() with authApi.login()
   - register() with authApi.register()  
   - checkAuth() with authApi.getProfile()

3. In gamification-store.ts, replace:
   - Point calculations with gamificationApi.awardPoints()
   - Badge checks with gamificationApi.unlockBadge()
   - Stats with gamificationApi.getUserStats()

4. In chat-store.ts, replace:
   - Dummy socket with chatApi.initializeSocket()
   - Message persistence with chat history API

5. Add environment variables from .env.template

6. Set up your FastAPI backend with matching endpoints

7. Configure Supabase database with appropriate tables

8. Set up Razorpay account and configure webhook endpoints
*/