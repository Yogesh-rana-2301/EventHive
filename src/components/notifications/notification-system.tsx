"use client";

import { useEffect, useState } from "react";
import { useGamificationStore } from "@/stores/gamification-store";
import { useGamificationSettings } from "@/stores/gamification-settings-store";
import { Trophy, X, Award, Star, Crown, CheckCircle, Bell } from "lucide-react";

interface NotificationToastProps {
  notification: {
    id: string;
    type: "badge" | "achievement" | "level_up" | "points";
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    metadata?: any;
  };
  onClose: (id: string) => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case "badge":
        return <Award className="h-6 w-6 text-yellow-500" />;
      case "achievement":
        return <Trophy className="h-6 w-6 text-blue-500" />;
      case "level_up":
        return <Crown className="h-6 w-6 text-purple-500" />;
      case "points":
        return <Star className="h-6 w-6 text-green-500" />;
      default:
        return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "badge":
        return "bg-yellow-50 border-yellow-200";
      case "achievement":
        return "bg-blue-50 border-blue-200";
      case "level_up":
        return "bg-purple-50 border-purple-200";
      case "points":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-lg max-w-sm w-full ${getBgColor()} animate-slide-in`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export function NotificationSystem() {
  const { notifications, markNotificationAsRead, clearNotification } =
    useGamificationStore();
  const { isEnabled, showNotifications } = useGamificationSettings();
  const [visibleNotifications, setVisibleNotifications] = useState<
    typeof notifications
  >([]);

  useEffect(() => {
    // Only show notifications if gamification is enabled and notifications are enabled
    if (!isEnabled || !showNotifications) {
      setVisibleNotifications([]);
      return;
    }

    // Show unread notifications
    const unreadNotifications = notifications.filter((n) => !n.read);
    setVisibleNotifications(unreadNotifications.slice(-3)); // Show max 3 at a time
  }, [notifications, isEnabled, showNotifications]);

  const handleCloseNotification = (id: string) => {
    markNotificationAsRead(id);
    setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));

    // Auto-clear after closing
    setTimeout(() => {
      clearNotification(id);
    }, 1000);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={handleCloseNotification}
        />
      ))}
    </div>
  );
}

// Hook for triggering notifications
export function useNotifications() {
  const { addNotification } = useGamificationStore();

  const showBadgeNotification = (badgeName: string, badgeIcon: string) => {
    addNotification({
      type: "badge",
      title: "Badge Unlocked! 🏆",
      message: `You've earned the "${badgeName}" badge!`,
      metadata: { badgeName, badgeIcon },
    });
  };

  const showLevelUpNotification = (newLevel: number) => {
    addNotification({
      type: "level_up",
      title: "Level Up! 👑",
      message: `Congratulations! You've reached level ${newLevel}!`,
      metadata: { level: newLevel },
    });
  };

  const showPointsNotification = (points: number, reason: string) => {
    addNotification({
      type: "points",
      title: `+${points} Points! ⭐`,
      message: reason,
      metadata: { points, reason },
    });
  };

  const showAchievementNotification = (achievementName: string) => {
    addNotification({
      type: "achievement",
      title: "Achievement Unlocked! 🎯",
      message: `You've completed "${achievementName}"!`,
      metadata: { achievementName },
    });
  };

  return {
    showBadgeNotification,
    showLevelUpNotification,
    showPointsNotification,
    showAchievementNotification,
  };
}

// Notification Panel for viewing all notifications
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    markNotificationAsRead,
    clearNotification,
    clearAllNotifications,
  } = useGamificationStore();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-200"
          aria-label="Close notifications"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-xl pr-14">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-primary-100 text-sm">{unreadCount} unread</p>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="mt-2 text-sm text-primary-100 hover:text-white transition-colors underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-500">
                Start engaging with events to receive notifications about your
                achievements!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications
                .slice()
                .reverse()
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === "badge" && (
                          <Award className="h-5 w-5 text-yellow-500" />
                        )}
                        {notification.type === "achievement" && (
                          <Trophy className="h-5 w-5 text-blue-500" />
                        )}
                        {notification.type === "level_up" && (
                          <Crown className="h-5 w-5 text-purple-500" />
                        )}
                        {notification.type === "points" && (
                          <Star className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
