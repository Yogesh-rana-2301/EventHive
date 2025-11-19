"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { MessageCircle, X, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dynamic imports to avoid TypeScript module resolution issues
import { ChatRoomSelector } from "@/components/chat/chat-room-selector";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    activeRoom,
    connectToSocket,
    disconnectFromSocket,
    isConnected,
    leaveRoom,
  } = useChatStore();

  useEffect(() => {
    if (isOpen && !isConnected) {
      connectToSocket();
    }

    return () => {
      if (isConnected) {
        disconnectFromSocket();
      }
    };
  }, [isOpen, isConnected, connectToSocket, disconnectFromSocket]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleBackToRooms = () => {
    if (activeRoom) {
      leaveRoom(activeRoom.id);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-30 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              {activeRoom && (
                <button
                  onClick={handleBackToRooms}
                  className="hover:bg-primary-600 p-1 rounded transition-colors mr-1"
                  title="Back to all chats"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-medium">
                  {activeRoom ? activeRoom.name : "EventHive Chat"}
                </h3>
                {activeRoom && (
                  <p className="text-xs text-primary-100">
                    <Users className="h-3 w-3 inline mr-1" />
                    {activeRoom.participants} participants
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-primary-600 p-1 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
              Connecting to chat...
            </div>
          )}

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {!activeRoom ? (
              <ChatRoomSelector />
            ) : (
              <>
                <ChatMessages />
                <ChatInput />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
