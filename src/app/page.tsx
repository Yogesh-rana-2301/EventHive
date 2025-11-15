"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/stores/auth-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { useGamificationSettings } from "@/stores/gamification-settings-store";
import { MapSidebar } from "@/components/map/map-sidebar";
import { EventDetailModal } from "@/components/events/event-detail-modal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ChatSystem } from "@/components/chat/chat-system";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserProfileModal } from "@/components/profile/user-profile-modal";
import { NotificationPanel } from "@/components/notifications/notification-system";
import { GamificationDemo } from "@/components/gamification/gamification-demo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GamificationToggle } from "@/components/gamification/gamification-toggle";
import { Button } from "@/components/ui/button";
import { User, Bell, LogIn, Layers, MapIcon } from "lucide-react";
import { MAP_THEMES, type MapThemeKey } from "@/lib/map-themes";

// Dynamic import for map to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map"),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="h-screen" />,
  }
);

export default function HomePage() {
  const { isAuthenticated, checkAuth, user } = useAuthStore();
  const { notifications } = useGamificationStore();
  const { isEnabled: gamificationEnabled, showDemoPanel } =
    useGamificationSettings();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mapTheme, setMapTheme] = useState<MapThemeKey>("standard");
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Map Container */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap mapTheme={mapTheme} />
      </div>
      {/* Top Header with Glassmorphism */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                EventHive
              </h1>
              <p className="text-xs text-muted-foreground">
                Discover & Connect
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />

            {/* Gamification Toggle - Always visible */}
            <GamificationToggle />

            {isAuthenticated ? (
              <>
                {/* Notifications Button - Only show if gamification is enabled */}
                {gamificationEnabled && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setShowNotifications(true)}
                    className="relative bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                        {notifications.filter((n) => !n.read).length}
                      </div>
                    )}
                  </Button>
                )}

                {/* User Profile Button */}
                <Button
                  variant="secondary"
                  onClick={() => setShowUserProfile(true)}
                  className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {user?.name}
                  </span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Map Theme Selector - Positioned below main header */}
        <div className="mt-5 flex justify-end">
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
            >
              <Layers className="h-4 w-4" />
            </Button>

            {/* Theme Dropdown */}
            {showThemeSelector && (
              <div className="absolute top-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 min-w-[200px] animate-scale-in">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Map Style
                </div>
                <div className="space-y-1">
                  {(Object.keys(MAP_THEMES) as MapThemeKey[]).map(
                    (themeKey) => (
                      <button
                        key={themeKey}
                        onClick={() => {
                          setMapTheme(themeKey);
                          setShowThemeSelector(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          mapTheme === themeKey
                            ? "bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {MAP_THEMES[themeKey].name}
                          </span>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>{" "}
      {/* Left Sidebar */}
      <div className="absolute left-0 top-0 z-30 h-full pointer-events-none">
        <div className="pointer-events-auto h-full">
          <MapSidebar />
        </div>
      </div>
      {/* Event Detail Modal */}
      <EventDetailModal />
      {/* Chat System */}
      <ChatSystem />
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      {/* Gamification Demo (for testing) */}
      {process.env.NODE_ENV === "development" &&
        gamificationEnabled &&
        showDemoPanel && <GamificationDemo />}
    </div>
  );
}
