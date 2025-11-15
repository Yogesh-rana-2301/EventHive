import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Badge, Achievement, UserStats, AVAILABLE_BADGES, calculateLevel, checkBadgeEligibility, POINT_VALUES } from '@/lib/gamification'

interface GamificationState {
  userStats: UserStats
  badges: Badge[]
  achievements: Achievement[]
  notifications: Array<{
    id: string
    type: 'badge' | 'achievement' | 'level_up' | 'points'
    title: string
    message: string
    timestamp: number
    read: boolean
    metadata?: any
  }>
  
  // Actions
  addPoints: (points: number, reason: string) => void
  updateStats: (statUpdate: Partial<UserStats>) => void
  checkAndAwardBadges: () => Badge[]
  addNotification: (notification: Omit<GamificationState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  markNotificationAsRead: (notificationId: string) => void
  clearNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  incrementEventAttended: (cityName: string) => void
  incrementEventCreated: () => void
  incrementMessagesSent: (count?: number) => void
  incrementFriends: () => void
}

const DEFAULT_USER_STATS: UserStats = {
  eventsAttended: 0,
  eventsCreated: 0,
  messagesPosted: 0,
  friendsMade: 0,
  citiesVisited: [],
  totalPoints: 0,
  level: 1,
  joinDate: new Date().toISOString()
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      userStats: DEFAULT_USER_STATS,
      badges: [],
      achievements: [],
      notifications: [],

      addPoints: (points: number, reason: string) => {
        set((state) => {
          const newTotalPoints = state.userStats.totalPoints + points
          const oldLevel = state.userStats.level
          const newLevel = calculateLevel(newTotalPoints)
          
          const notifications = [...state.notifications]
          
          // Add level up notification if level changed
          if (newLevel > oldLevel) {
            notifications.push({
              id: `level-${Date.now()}`,
              type: 'level_up',
              title: `Level Up! 🎊`,
              message: `You've reached level ${newLevel}!`,
              timestamp: Date.now(),
              read: false,
              metadata: { newLevel, oldLevel }
            })
          }
          
          return {
            userStats: {
              ...state.userStats,
              totalPoints: newTotalPoints,
              level: newLevel
            },
            notifications
          }
        })
      },

      updateStats: (statUpdate: Partial<UserStats>) => {
        set((state) => ({
          userStats: {
            ...state.userStats,
            ...statUpdate
          }
        }))
      },

      checkAndAwardBadges: () => {
        const { userStats, badges } = get()
        const userBadgeIds = badges.map(b => b.id)
        const newBadges: Badge[] = []
        
        AVAILABLE_BADGES.forEach(badge => {
          if (checkBadgeEligibility(badge, userStats, userBadgeIds)) {
            newBadges.push({
              ...badge,
              unlockedAt: new Date().toISOString()
            })
          }
        })
        
        if (newBadges.length > 0) {
          set((state) => ({
            badges: [...state.badges, ...newBadges],
            notifications: [
              ...state.notifications,
              ...newBadges.map(badge => ({
                id: `badge-${badge.id}-${Date.now()}`,
                type: 'badge' as const,
                title: `New Badge Unlocked! ${badge.icon}`,
                message: badge.name,
                timestamp: Date.now(),
                read: false,
                metadata: { badge }
              }))
            ]
          }))
        }
        
        return newBadges
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: `${notification.type}-${Date.now()}`,
              timestamp: Date.now(),
              read: false
            }
          ]
        }))
      },

      markNotificationAsRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        }))
      },

      clearNotification: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }))
      },

      clearAllNotifications: () => {
        set({ notifications: [] })
      },

      incrementEventAttended: (cityName: string) => {
        const { addPoints, checkAndAwardBadges } = get()
        
        set((state) => {
          const citiesVisited = state.userStats.citiesVisited.includes(cityName)
            ? state.userStats.citiesVisited
            : [...state.userStats.citiesVisited, cityName]
          
          return {
            userStats: {
              ...state.userStats,
              eventsAttended: state.userStats.eventsAttended + 1,
              citiesVisited
            }
          }
        })
        
        addPoints(POINT_VALUES.eventAttended, 'Attended event')
        
        // Check for new city bonus
        if (!get().userStats.citiesVisited.includes(cityName)) {
          addPoints(POINT_VALUES.firstInCategory, `First event in ${cityName}`)
        }
        
        checkAndAwardBadges()
      },

      incrementEventCreated: () => {
        const { addPoints, checkAndAwardBadges } = get()
        
        set((state) => ({
          userStats: {
            ...state.userStats,
            eventsCreated: state.userStats.eventsCreated + 1
          }
        }))
        
        addPoints(POINT_VALUES.eventCreated, 'Created event')
        checkAndAwardBadges()
      },

      incrementMessagesSent: (count = 1) => {
        const { addPoints } = get()
        
        set((state) => ({
          userStats: {
            ...state.userStats,
            messagesPosted: state.userStats.messagesPosted + count
          }
        }))
        
        addPoints(POINT_VALUES.messageSent * count, 'Posted message(s)')
        
        // Check for badges every 100 messages
        if (get().userStats.messagesPosted % 100 === 0) {
          get().checkAndAwardBadges()
        }
      },

      incrementFriends: () => {
        const { addPoints, checkAndAwardBadges } = get()
        
        set((state) => ({
          userStats: {
            ...state.userStats,
            friendsMade: state.userStats.friendsMade + 1
          }
        }))
        
        addPoints(POINT_VALUES.friendMade, 'Made new friend')
        checkAndAwardBadges()
      }
    }),
    {
      name: 'eventhive-gamification',
      partialize: (state) => ({
        userStats: state.userStats,
        badges: state.badges,
        achievements: state.achievements,
        notifications: state.notifications
      })
    }
  )
)