export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'events' | 'community' | 'social' | 'organizer' | 'special'
  requirements: string[]
  unlockedAt?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  maxProgress: number
  badgeId?: string
  isCompleted: boolean
  category: string
}

export interface UserStats {
  eventsAttended: number
  eventsCreated: number
  messagesPosted: number
  friendsMade: number
  citiesVisited: string[]
  totalPoints: number
  level: number
  joinDate: string
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-event',
    name: 'First Step',
    description: 'Attended your first event',
    icon: '🎉',
    color: 'bg-green-500',
    rarity: 'common',
    category: 'events',
    requirements: ['Attend 1 event']
  },
  {
    id: 'event-enthusiast',
    name: 'Event Enthusiast', 
    description: 'Attended 10 events',
    icon: '🌟',
    color: 'bg-blue-500',
    rarity: 'rare',
    category: 'events',
    requirements: ['Attend 10 events']
  },
  {
    id: 'party-animal',
    name: 'Party Animal',
    description: 'Attended 50 events',
    icon: '🦄',
    color: 'bg-purple-500',
    rarity: 'epic',
    category: 'events',
    requirements: ['Attend 50 events']
  },
  {
    id: 'event-legend',
    name: 'Event Legend',
    description: 'Attended 100 events',
    icon: '👑',
    color: 'bg-yellow-500',
    rarity: 'legendary',
    category: 'events',
    requirements: ['Attend 100 events']
  },
  {
    id: 'organizer-debut',
    name: 'Organizer Debut',
    description: 'Created your first event',
    icon: '📅',
    color: 'bg-indigo-500',
    rarity: 'common',
    category: 'organizer',
    requirements: ['Create 1 event']
  },
  {
    id: 'crowd-pleaser',
    name: 'Crowd Pleaser',
    description: 'Organized an event with 100+ attendees',
    icon: '🎪',
    color: 'bg-red-500',
    rarity: 'epic',
    category: 'organizer',
    requirements: ['Organize event with 100+ attendees']
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Made 25 friends through events',
    icon: '🦋',
    color: 'bg-pink-500',
    rarity: 'rare',
    category: 'social',
    requirements: ['Make 25 friends']
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    description: 'Posted 500 messages in chat',
    icon: '💬',
    color: 'bg-cyan-500',
    rarity: 'rare',
    category: 'community',
    requirements: ['Post 500 messages']
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Attended events in 5 different cities',
    icon: '🗺️',
    color: 'bg-teal-500',
    rarity: 'epic',
    category: 'events',
    requirements: ['Attend events in 5 cities']
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'One of the first 1000 users',
    icon: '🐦',
    color: 'bg-orange-500',
    rarity: 'legendary',
    category: 'special',
    requirements: ['Join in first 1000 users']
  }
]

export const calculateLevel = (totalPoints: number): number => {
  if (totalPoints < 100) return 1
  if (totalPoints < 300) return 2
  if (totalPoints < 600) return 3
  if (totalPoints < 1000) return 4
  if (totalPoints < 1500) return 5
  return Math.floor(totalPoints / 300) + 2
}

export const getPointsForNextLevel = (currentLevel: number): number => {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500]
  if (currentLevel >= levelThresholds.length) {
    return levelThresholds[levelThresholds.length - 1] + (currentLevel - levelThresholds.length + 1) * 300
  }
  return levelThresholds[currentLevel]
}

export const POINT_VALUES = {
  eventAttended: 10,
  eventCreated: 25,
  messageSent: 1,
  friendMade: 5,
  eventWithHighAttendance: 50, // 100+ attendees
  firstInCategory: 15,
  weeklyStreak: 20,
  monthlyStreak: 100
}

export const checkBadgeEligibility = (badge: Badge, stats: UserStats, userBadges: string[]): boolean => {
  if (userBadges.includes(badge.id)) return false
  
  switch (badge.id) {
    case 'first-event':
      return stats.eventsAttended >= 1
    case 'event-enthusiast':
      return stats.eventsAttended >= 10
    case 'party-animal':
      return stats.eventsAttended >= 50
    case 'event-legend':
      return stats.eventsAttended >= 100
    case 'organizer-debut':
      return stats.eventsCreated >= 1
    case 'social-butterfly':
      return stats.friendsMade >= 25
    case 'chatterbox':
      return stats.messagesPosted >= 500
    case 'explorer':
      return stats.citiesVisited.length >= 5
    case 'early-bird':
      // This would be determined by join date and user count at time of joining
      return false // Placeholder logic
    default:
      return false
  }
}