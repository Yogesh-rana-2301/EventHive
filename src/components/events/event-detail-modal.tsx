"use client";

import { useState, useEffect } from "react";
import { useEventsStore } from "@/stores/events-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { useNotifications } from "@/components/notifications/notification-system";
import { useChatStore } from "@/stores/chat-store";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Tag,
  Star,
  Share2,
  Heart,
  MessageCircle,
  Ticket,
  ExternalLink,
  Camera,
  Image,
  Send,
  ThumbsUp,
  MessageSquare,
  Upload,
  Shield,
} from "lucide-react";

export function EventDetailModal() {
  const { selectedEvent, selectEvent, joinEvent } = useEventsStore();
  const { incrementEventAttended } = useGamificationStore();
  const { showPointsNotification } = useNotifications();
  const { joinRoom } = useChatStore();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"payment" | "otp">("payment");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showAfterEventHub, setShowAfterEventHub] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [photoCaption, setPhotoCaption] = useState("");
  const [sharedPhotos, setSharedPhotos] = useState<
    Array<{ id: string; url: string; caption: string; author: string }>
  >([]);
  const [isCheckingAttendance, setIsCheckingAttendance] = useState(false);

  // Check if user has already joined this event whenever selectedEvent changes
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      if (!selectedEvent) {
        setHasJoined(false);
        return;
      }

      setIsCheckingAttendance(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setHasJoined(false);
          setIsCheckingAttendance(false);
          return;
        }

        const { data, error } = await supabase
          .from("event_attendees")
          .select("id")
          .eq("event_id", selectedEvent.id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking attendance:", error);
          setHasJoined(false);
        } else {
          setHasJoined(!!data);
        }
      } catch (error) {
        console.error("Error checking attendance:", error);
        setHasJoined(false);
      } finally {
        setIsCheckingAttendance(false);
      }
    };

    checkAttendanceStatus();
  }, [selectedEvent?.id]);

  if (!selectedEvent) return null;

  const handleClose = () => {
    selectEvent(null);
  };

  const handleJoinEventClick = () => {
    // Show confirmation popup instead of directly joining
    setShowJoinConfirmation(true);
  };

  const handleBuyTicket = async () => {
    if (selectedEvent.price > 0) {
      // Show payment modal for paid events
      setShowPaymentModal(true);
      setPaymentStep("payment");
      setAcceptedTerms(false);
      setOtpValue("");
      setShowJoinConfirmation(false);
    } else {
      // Free event - join directly
      await processEventJoin();
    }
  };

  const handlePaymentSubmit = () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions to proceed");
      return;
    }
    // Move to OTP step
    setPaymentStep("otp");
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setIsJoining(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close payment modal
      setShowPaymentModal(false);

      // Process the event join
      await processEventJoin();

      // Show success message
      alert(
        `✅ Payment successful!\n\nYou have been charged ₹${selectedEvent.price} (Demo mode)\nTicket confirmed for "${selectedEvent.title}"`
      );
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("❌ OTP verification failed. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const processEventJoin = async () => {
    setIsJoining(true);
    try {
      // Join the event
      await joinEvent(selectedEvent.id);
      setHasJoined(true);

      // Trigger gamification rewards
      incrementEventAttended(selectedEvent.location.city);
      showPointsNotification(25, `Joined "${selectedEvent.title}"!`);

      // If there's a ticket URL, open it
      if (selectedEvent.ticketUrl) {
        window.open(selectedEvent.ticketUrl, "_blank");
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      alert("❌ Failed to join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleGoToChat = async () => {
    setIsJoining(true);
    try {
      // First join the event
      await joinEvent(selectedEvent.id);
      setHasJoined(true);
      setShowJoinConfirmation(false);

      // Trigger gamification rewards
      incrementEventAttended(selectedEvent.location.city);
      showPointsNotification(25, `Joined "${selectedEvent.title}"!`);

      // Navigate to chat
      if (selectedEvent.chatRoomId) {
        try {
          await joinRoom(selectedEvent.chatRoomId);
          console.log("Joined chat for event:", selectedEvent.id);
          // The chat system component will automatically show the chat
        } catch (chatError) {
          console.error("Failed to join chat:", chatError);
          alert(
            "Joined event, but couldn't open chat. Please try accessing it from the chat menu."
          );
        }
      } else {
        alert(
          "No chat room available for this event. The organizer hasn't set it up yet."
        );
      }
    } catch (error) {
      console.error("Failed to join event:", error);
      alert("Failed to join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedEvent.title,
        text: selectedEvent.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleJoinChat = async () => {
    // Direct chat access (without joining)
    if (selectedEvent.chatRoomId) {
      try {
        await joinRoom(selectedEvent.chatRoomId);
        console.log("Joined chat for event:", selectedEvent.id);
        // The chat system component will automatically show the chat
      } catch (error) {
        console.error("Failed to join chat:", error);
        alert("Failed to open chat. Please try again.");
      }
    } else {
      alert("No chat room available for this event.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to storage and get URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now().toString(),
          url: reader.result as string,
          caption: photoCaption,
          author: "Current User", // TODO: Get from auth store
        };
        setSharedPhotos([...sharedPhotos, newPhoto]);
        setPhotoCaption("");
        alert("Photo shared successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim() && rating > 0) {
      // TODO: Submit feedback to backend
      console.log("Feedback submitted:", { rating, feedback });
      alert("Thank you for your feedback!");
      setFeedback("");
      setRating(0);
    }
  };

  // Check if event has ended
  const eventHasEnded = new Date(selectedEvent.endDate) < new Date();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 pr-10">
            Event Details
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Images */}
          {selectedEvent.images.length > 0 && (
            <div className="mb-6">
              <img
                src={selectedEvent.images[0]}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Event Title & Organizer */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedEvent.title}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Organized by</span>
              <span className="font-medium text-gray-900">
                {selectedEvent.organizer.name}
              </span>
              {selectedEvent.organizer.isVerified && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedEvent.startDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">
                  {selectedEvent.location.address}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Attendees</p>
                <p className="font-medium text-gray-900">
                  {selectedEvent.currentAttendees}
                  {selectedEvent.maxAttendees &&
                    ` / ${selectedEvent.maxAttendees}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Tag className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-900">
                  {selectedEvent.category}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Event Price</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(selectedEvent.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About this event
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedEvent.description}
            </p>
          </div>

          {/* Tags */}
          {selectedEvent.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {selectedEvent.requirements &&
            selectedEvent.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedEvent.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* After-Event Hub */}
          {eventHasEnded && hasJoined && (
            <div className="mb-6 border-2 border-primary-200 rounded-lg p-4 bg-gradient-to-br from-primary-50 to-purple-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-primary-600" />
                  After-Event Hub
                </h3>
                <button
                  onClick={() => setShowAfterEventHub(!showAfterEventHub)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  {showAfterEventHub ? "Hide" : "Show"}
                </button>
              </div>

              {showAfterEventHub && (
                <div className="space-y-6">
                  {/* Photo & Memory Sharing */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Image className="h-4 w-4 mr-2 text-primary-600" />
                      Share Your Memories
                    </h4>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Add a caption for your photo..."
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />

                      <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors">
                        <Upload className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Upload Photo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Shared Photos Grid */}
                    {sharedPhotos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {sharedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            {photo.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                                {photo.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Instant Feedback Loop */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-primary-600" />
                      Share Your Feedback
                    </h4>

                    <div className="space-y-3">
                      {/* Rating Stars */}
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                          Rate this event
                        </label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feedback Text */}
                      <textarea
                        placeholder="Share your experience with the organizer..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                      />

                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={!feedback.trim() || rating === 0}
                        size="sm"
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Your feedback helps organizers improve future events!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleJoinEventClick}
              disabled={isJoining || hasJoined || isCheckingAttendance}
              className="flex-1"
              size="lg"
            >
              {isCheckingAttendance ? (
                "Checking..."
              ) : isJoining ? (
                "Joining..."
              ) : hasJoined ? (
                "✓ Joined"
              ) : selectedEvent.price > 0 ? (
                <>
                  <Ticket className="h-4 w-4 mr-2" />
                  Buy Ticket - {formatPrice(selectedEvent.price)}
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Join Event
                </>
              )}
            </Button>

            {selectedEvent.chatRoomId && hasJoined && (
              <Button
                variant="outline"
                onClick={handleJoinChat}
                className="flex-1"
                size="lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Chat
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-4 w-4" />
              <span>Save</span>
            </button>

            {selectedEvent.ticketUrl && (
              <a
                href={selectedEvent.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>External Link</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Join Confirmation Popup */}
      {showJoinConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowJoinConfirmation(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Join "{selectedEvent.title}"
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose how you'd like to participate in this event:
            </p>

            <div className="space-y-3">
              {/* Buy Ticket / Join Event Button */}
              <Button
                onClick={handleBuyTicket}
                disabled={isJoining}
                className="w-full"
                size="lg"
              >
                {selectedEvent.price > 0 ? (
                  <>
                    <Ticket className="h-5 w-5 mr-2" />
                    Buy Ticket - {formatPrice(selectedEvent.price)}
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5 mr-2" />
                    Join Event (Free)
                  </>
                )}
              </Button>

              {/* Go to Chat Group Button */}
              <Button
                onClick={handleGoToChat}
                disabled={isJoining}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Go to Chat Group
              </Button>

              {/* Cancel Button */}
              <Button
                onClick={() => setShowJoinConfirmation(false)}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPaymentModal(false);
            setPaymentStep("payment");
            setAcceptedTerms(false);
            setOtpValue("");
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {paymentStep === "payment" ? (
              <>
                {/* Payment Step */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Complete Payment
                  </h3>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentStep("payment");
                      setAcceptedTerms(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Payment Gateway Logo */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg p-4 mb-6 text-center">
                  <div className="text-white text-2xl font-bold mb-1">
                    Razorpay
                  </div>
                  <div className="text-blue-100 text-xs">
                    Secure Payment Gateway
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    {selectedEvent.images[0] && (
                      <img
                        src={selectedEvent.images[0]}
                        alt={selectedEvent.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {selectedEvent.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatDate(selectedEvent.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount to Pay</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{selectedEvent.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    🎭 <strong>Demo Mode:</strong> This is a simulated payment.
                    No actual charge will be made.
                  </p>
                </div>

                {/* Terms Checkbox */}
                <div className="mb-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I accept the terms and conditions and authorize EventHive
                      to charge ₹{selectedEvent.price} for this event ticket.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={!acceptedTerms}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Pay ₹{selectedEvent.price}
                </Button>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </>
            ) : (
              <>
                {/* OTP Step */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enter OTP
                  </h3>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentStep("payment");
                      setOtpValue("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* OTP Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900 mb-2">
                    📱 An OTP has been sent to your registered mobile number
                  </p>
                  <p className="text-xs text-blue-700">
                    <strong>Demo OTP:</strong> Use{" "}
                    <code className="bg-blue-200 px-2 py-1 rounded">
                      123456
                    </code>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) =>
                      setOtpValue(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  />
                </div>

                {/* Verify Button */}
                <Button
                  onClick={handleOtpSubmit}
                  disabled={isJoining || otpValue.length !== 6}
                  className="w-full mb-3"
                  size="lg"
                >
                  {isJoining ? "Verifying..." : "Verify & Complete Payment"}
                </Button>

                {/* Resend OTP */}
                <button
                  onClick={() =>
                    alert("OTP resent successfully! (Demo mode)\nUse: 123456")
                  }
                  className="text-sm text-primary-600 hover:text-primary-700 w-full text-center"
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
