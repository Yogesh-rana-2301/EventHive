import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GamificationSettingsState {
  isEnabled: boolean
  showDemoPanel: boolean
  showNotifications: boolean
  showBadges: boolean
  showProgress: boolean
  toggleGamification: () => void
  toggleDemoPanel: () => void
  toggleNotifications: () => void
  toggleBadges: () => void
  toggleProgress: () => void
  setGamificationEnabled: (enabled: boolean) => void
}

export const useGamificationSettings = create<GamificationSettingsState>()(
  persist(
    (set) => ({
      isEnabled: true,
      showDemoPanel: true,
      showNotifications: true,
      showBadges: true,
      showProgress: true,
      
      toggleGamification: () => 
        set((state) => ({ isEnabled: !state.isEnabled })),
      
      toggleDemoPanel: () => 
        set((state) => ({ showDemoPanel: !state.showDemoPanel })),
      
      toggleNotifications: () => 
        set((state) => ({ showNotifications: !state.showNotifications })),
      
      toggleBadges: () => 
        set((state) => ({ showBadges: !state.showBadges })),
      
      toggleProgress: () => 
        set((state) => ({ showProgress: !state.showProgress })),
      
      setGamificationEnabled: (enabled: boolean) => 
        set({ isEnabled: enabled }),
    }),
    {
      name: 'eventhive-gamification-settings',
    }
  )
)