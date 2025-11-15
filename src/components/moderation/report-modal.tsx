"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";
import { X, Flag, AlertTriangle, Shield, User } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "message" | "user" | "event";
  targetId: string;
  targetTitle?: string;
}

const REPORT_REASONS = {
  message: [
    "Spam or unwanted content",
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Inappropriate content",
    "Threats or violence",
    "Misinformation",
    "Other",
  ],
  user: [
    "Inappropriate behavior",
    "Harassment or bullying",
    "Spam or fake account",
    "Impersonation",
    "Threatening behavior",
    "Other",
  ],
  event: [
    "Inappropriate content",
    "Spam or fake event",
    "Misleading information",
    "Inappropriate venue",
    "Safety concerns",
    "Other",
  ],
};

export function ReportModal({
  isOpen,
  onClose,
  type,
  targetId,
  targetTitle,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportMessage, blockUser } = useChatStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      alert("Please select a reason for reporting.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (type === "message") {
        await reportMessage(targetId, selectedReason);
      } else {
        // TODO: Implement user and event reporting
        console.log(
          `Reporting ${type}:`,
          targetId,
          selectedReason,
          additionalDetails
        );
      }

      alert(
        "Thank you for your report. We will review it and take appropriate action."
      );
      onClose();

      // Reset form
      setSelectedReason("");
      setAdditionalDetails("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockAndReport = async () => {
    try {
      setIsSubmitting(true);
      await blockUser(targetId);
      await handleSubmit(new Event("submit") as any);
      alert("User has been blocked and reported.");
    } catch (error) {
      console.error("Failed to block user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "message":
        return <Flag className="h-6 w-6 text-red-500" />;
      case "user":
        return <User className="h-6 w-6 text-red-500" />;
      case "event":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Flag className="h-6 w-6 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "message":
        return "Report Message";
      case "user":
        return "Report User";
      case "event":
        return "Report Event";
      default:
        return "Report Content";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 pr-10">
            {getIcon()}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {getTitle()}
              </h2>
              {targetTitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {targetTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why are you reporting this {type}?
            </label>
            <div className="space-y-2">
              {REPORT_REASONS[type].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details (optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Provide any additional context that might help us understand the issue..."
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {additionalDetails.length}/500 characters
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your safety matters</p>
                <p>
                  All reports are reviewed by our moderation team. We take
                  action against content that violates our community guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedReason}
              className="w-full"
            >
              {isSubmitting ? "Submitting Report..." : "Submit Report"}
            </Button>

            {type === "user" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleBlockAndReport}
                disabled={isSubmitting || !selectedReason}
                className="w-full"
              >
                Block User & Report
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            False reports may result in restrictions on your account. Please
            only report content that genuinely violates our{" "}
            <button className="text-primary-600 hover:underline">
              Community Guidelines
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
