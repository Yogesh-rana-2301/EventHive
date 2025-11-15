'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useGamificationSettings } from '@/stores/gamification-settings-store'
import { 
  Trophy, 
  Settings, 
  X, 
  Bell, 
  Award, 
  TrendingUp, 
  Eye, 
  EyeOff,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

export function GamificationToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isEnabled,
    showDemoPanel,
    showNotifications,
    showBadges,
    showProgress,
    toggleGamification,
    toggleDemoPanel,
    toggleNotifications,
    toggleBadges,
    toggleProgress
  } = useGamificationSettings()

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-background/50 backdrop-blur-sm border-border/50 ${
          isEnabled ? 'text-primary border-primary/50' : 'text-muted-foreground'
        }`}
      >
        <Trophy className="h-4 w-4" />
        <span className="sr-only">Toggle gamification</span>
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Gamification
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-accent/20">
              <div className="flex items-center space-x-2">
                {isEnabled ? (
                  <ToggleRight className="h-5 w-5 text-primary" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="font-medium">Enable Gamification</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleGamification}
              >
                {isEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>

            {/* Sub-options (only show when gamification is enabled) */}
            {isEnabled && (
              <div className="space-y-2 pl-4 border-l-2 border-accent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleNotifications}
                  >
                    {showNotifications ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>Badges</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBadges}
                  >
                    {showBadges ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>Progress Bars</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleProgress}
                  >
                    {showProgress ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <Settings className="h-4 w-4" />
                      <span>Demo Panel</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleDemoPanel}
                    >
                      {showDemoPanel ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 p-2 rounded-lg bg-accent/10 text-xs text-muted-foreground">
            {isEnabled 
              ? "Earn points, unlock badges, and track your EventHive journey!"
              : "Gamification features are disabled. Enable to track progress and earn rewards."
            }
          </div>
        </div>
      )}
    </div>
  )
}