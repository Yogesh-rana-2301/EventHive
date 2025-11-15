"use client";

import { useChatStore } from "@/stores/chat-store";
import { DUMMY_CHAT_ROOMS } from "@/lib/dummy-data";
import { Users, MapPin, Globe, Calendar } from "lucide-react";

export function ChatRoomSelector() {
  const { joinRoom } = useChatStore();

  const handleRoomSelect = (roomId: string) => {
    joinRoom(roomId);
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

      <div className="space-y-2">
        {DUMMY_CHAT_ROOMS.map((room) => (
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
                    {room.participants.toLocaleString()} participants
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

      <div className="text-xs text-gray-500 text-center mt-4">
        Select a room to start chatting!
      </div>
    </div>
  );
}
