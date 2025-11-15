'use client'

import { Button } from '@/components/ui/button'
import { useGamificationStore } from '@/stores/gamification-store'
import { useNotifications } from '@/components/notifications/notification-system'
import { Trophy, Star, Award, Crown } from 'lucide-react'

export function GamificationDemo() {
  const { 
    incrementEventAttended, 
    incrementEventCreated, 
    incrementMessagesSent, 
    incrementFriends, 
    addPoints,
    userStats,
    badges
  } = useGamificationStore()
  
  const { 
    showBadgeNotification, 
    showLevelUpNotification, 
    showPointsNotification, 
    showAchievementNotification 
  } = useNotifications()

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
        Gamification Demo
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-600">
          Level: {userStats.level} | Points: {userStats.totalPoints}
        </div>
        <div className="text-xs text-gray-600">
          Badges: {badges.length}
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          size="sm" 
          className="w-full text-xs"
          onClick={() => {
            incrementEventAttended('Mumbai')
            showPointsNotification(25, 'Attended event in Mumbai!')
          }}
        >
          Attend Event
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs"
          onClick={() => {
            incrementEventCreated()
            showPointsNotification(50, 'Created new event!')
          }}
        >
          Create Event
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs"
          onClick={() => {
            incrementMessagesSent(1)
            showPointsNotification(5, 'Sent chat message!')
          }}
        >
          Send Message
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-xs"
          onClick={() => {
            incrementFriends()
            showPointsNotification(15, 'Made new friend!')
          }}
        >
          Make Friend
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full text-xs"
          onClick={() => {
            addPoints(100, 'Bonus points!')
            showPointsNotification(100, 'Bonus points awarded!')
          }}
        >
          <Star className="h-3 w-3 mr-1" />
          Bonus Points
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full text-xs"
          onClick={() => {
            showBadgeNotification('Early Bird', '🐦')
          }}
        >
          <Award className="h-3 w-3 mr-1" />
          Test Badge
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full text-xs"
          onClick={() => {
            showLevelUpNotification(userStats.level + 1)
          }}
        >
          <Crown className="h-3 w-3 mr-1" />
          Test Level Up
        </Button>
      </div>
    </div>
  )
}