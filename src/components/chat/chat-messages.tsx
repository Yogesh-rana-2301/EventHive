"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/stores/chat-store";
import { DUMMY_MESSAGES } from "@/lib/dummy-data";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal, Reply, Flag, Heart } from "lucide-react";
import { ReportModal } from "@/components/moderation/report-modal";

export function ChatMessages() {
  const { activeRoom, messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    targetId: string;
    targetTitle?: string;
  }>({ isOpen: false, targetId: "" });

  const roomMessages = activeRoom
    ? messages[activeRoom.id] || DUMMY_MESSAGES
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // TODO: Implement reaction handling
    console.log("Add reaction:", emoji, "to message:", messageId);
  };

  const handleReport = (messageId: string) => {
    setReportModal({
      isOpen: true,
      targetId: messageId,
      targetTitle: "Chat Message",
    });
  };

  if (!activeRoom) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0">
      {roomMessages.map((message) => (
        <div key={message.id} className="group">
          {/* Message */}
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
              {message.isAnonymous ? "?" : message.username[0]}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm text-gray-900">
                  {message.isAnonymous ? "Anonymous" : message.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>

              {/* Reply indicator */}
              {message.replyTo && (
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <Reply className="h-3 w-3 mr-1" />
                  Replying to message
                </div>
              )}

              {/* Message text */}
              <div className="text-sm text-gray-800 break-words">
                {message.isDeleted ? (
                  <span className="italic text-gray-500">
                    [Message deleted]
                  </span>
                ) : (
                  message.content
                )}
              </div>

              {/* Reactions */}
              {message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                      className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                    >
                      <span className="text-sm">{reaction.emoji}</span>
                      <span className="text-xs text-gray-600">
                        {reaction.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Message Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <button
                  onClick={() => handleReaction(message.id, "👍")}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Like"
                >
                  <Heart className="h-3 w-3 text-gray-500" />
                </button>
                <button
                  onClick={() => handleReport(message.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Report"
                >
                  <Flag className="h-3 w-3 text-gray-500" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreHorizontal className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {roomMessages.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8">
          No messages yet. Be the first to start the conversation!
        </div>
      )}

      <div ref={messagesEndRef} />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, targetId: "" })}
        type="message"
        targetId={reportModal.targetId}
        targetTitle={reportModal.targetTitle}
      />
    </div>
  );
}
