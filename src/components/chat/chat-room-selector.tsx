"use client";

import { useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Users, MapPin, Globe, Calendar } from "lucide-react";

export function ChatRoomSelector() {
  const { rooms, fetchRooms, joinRoom, isLoading } = useChatStore();

  useEffect(() => {
    // Fetch rooms when component mounts
    fetchRooms();
  }, [fetchRooms]);

  const handleRoomSelect = async (roomId: string) => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Failed to join chat room. Please try again.");
    }
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "city":
        return <MapPin className="h-4 w-4" />;
      case "state":
        return <MapPin className="h-4 w-4" />;
      case "global":
        return <Globe className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0">
      <h4 className="font-medium text-gray-900 mb-3">Join a Chat Room</h4>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading chat rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No chat rooms available</p>
          <p className="text-xs text-gray-400 mt-1">
            Join an event to access its chat
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.id)}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-primary-600">{getRoomIcon(room.type)}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {room.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {room.type === "event"
                        ? "Event Chat"
                        : `${room.participants.toLocaleString()} participants`}
                    </span>
                    {room.unreadCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 text-center mt-4">
        {!isLoading && rooms.length > 0 && "Select a room to start chatting!"}
      </div>
    </div>
  );
}
