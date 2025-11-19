"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { Button } from "@/components/ui/button";
import { Send, Smile, UserX, Eye, EyeOff } from "lucide-react";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { activeRoom, sendMessage, setTyping } = useChatStore();
  const { incrementMessagesSent } = useGamificationStore();

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout | null = null;

    if (message && !isTyping) {
      setIsTyping(true);
      if (activeRoom) {
        setTyping(activeRoom.id, true);
      }
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (activeRoom) {
          setTyping(activeRoom.id, false);
        }
      }
    }, 1000);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [message, isTyping, activeRoom, setTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeRoom) return;

    // Simple content moderation
    const bannedWords = ["spam", "abuse", "hate", "violence"];
    const lowercaseMessage = message.toLowerCase();
    const containsBannedWord = bannedWords.some((word) =>
      lowercaseMessage.includes(word)
    );

    if (containsBannedWord) {
      alert(
        "Your message contains inappropriate content. Please revise and try again."
      );
      return;
    }

    try {
      await sendMessage(activeRoom.id, message.trim(), isAnonymous);

      // Trigger gamification rewards for message sent
      incrementMessagesSent(1);

      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!activeRoom) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* Typing Indicator */}
      {/* TODO: Show who's typing */}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-2">
          {/* Input Area */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${activeRoom.name}...`}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              maxLength={1000}
            />

            {/* Character count */}
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {message.length}/1000
            </div>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!message.trim()}
            className="shrink-0"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          {/* Emoji Quick Access */}
          <div className="flex items-center space-x-1">
            {["👍", "❤️", "😂", "😊", "🔥", "👏"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="hover:bg-gray-100 p-1 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
            <button
              type="button"
              className="hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <Smile className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Anonymous Toggle */}
          <button
            type="button"
            onClick={toggleAnonymous}
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm transition-colors ${
              isAnonymous
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isAnonymous ? (
              <>
                <EyeOff className="h-3 w-3" />
                <span>Anonymous</span>
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                <span>Public</span>
              </>
            )}
          </button>
        </div>

        {/* Guidelines */}
        <div className="text-xs text-gray-500 mt-2">
          Be respectful and follow our{" "}
          <button className="text-primary-600 hover:underline">
            community guidelines
          </button>
          . Use the report button if you see inappropriate content.
        </div>
      </form>
    </div>
  );
}
