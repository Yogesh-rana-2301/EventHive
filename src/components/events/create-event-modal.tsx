"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEventsStore } from "@/stores/events-store";
import { useAuthStore } from "@/stores/auth-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { useNotifications } from "@/components/notifications/notification-system";
import { EVENT_CATEGORIES } from "@/lib/utils";
import {
  X,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Image as ImageIcon,
  Tag,
  AlertCircle,
} from "lucide-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { createEvent } = useEventsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { incrementEventCreated } = useGamificationStore();
  const { showPointsNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    price: 0,
    maxAttendees: "",
    address: "",
    city: "",
    state: "",
    requirements: [""],
    tags: [""],
  });

  if (!isOpen) return null;

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You need to be logged in to create an event. Please sign up or log
              in to continue.
            </p>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = "/landing_page/";
                }}
                className="flex-1"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Geocode address to get lat/lng coordinates
  const geocodeAddress = async (
    address: string,
    city: string,
    state: string
  ): Promise<{ lat: number; lng: number } | null> => {
    try {
      const fullAddress = `${address}, ${city}, ${state}, India`;
      console.log("Geocoding address:", fullAddress);

      // Using Nominatim (OpenStreetMap) free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();
      console.log("Geocoding response:", data);

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Starting event creation...");
      console.log("User from auth store:", user);
      console.log(
        "User isAuthenticated:",
        useAuthStore.getState().isAuthenticated
      );
      console.log("Form data:", formData);

      // Validate user is logged in
      if (!user) {
        console.error("No user found in auth store");
        throw new Error(
          "You must be logged in to create an event. Please sign up or log in first."
        );
      }

      console.log("User validation passed. User ID:", user.id);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error("Please fill in all required fields");
      }

      if (!formData.address || !formData.city || !formData.state) {
        throw new Error("Please provide complete address information");
      }

      // Geocode the address to get coordinates
      console.log("Geocoding address...");
      const coordinates = await geocodeAddress(
        formData.address,
        formData.city,
        formData.state
      );

      if (!coordinates) {
        throw new Error(
          "Could not find location coordinates. Please check your address and try again."
        );
      }

      console.log("Coordinates found:", coordinates);

      const eventData = {
        title: formData.title,
        description: formData.description,
        organizer: {
          id: user.id,
          name: user.name,
          isVerified: user.isVerified,
          avatar: user.avatar,
        },
        location: {
          lat: coordinates.lat,
          lng: coordinates.lng,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        },
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate || formData.startDate,
        price: formData.price,
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : undefined,
        images: [],
        tags: formData.tags.filter((tag) => tag.trim()),
        isPublic: true,
        requirements: formData.requirements.filter((req) => req.trim()),
      };

      console.log("Creating event with data:", eventData);
      const createdEvent = await createEvent(eventData);
      console.log("Event created successfully:", createdEvent);

      // Trigger gamification rewards
      incrementEventCreated();
      showPointsNotification(50, "Event created successfully!");

      onClose();

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        price: 0,
        maxAttendees: "",
        address: "",
        city: "",
        state: "",
        requirements: [""],
        tags: [""],
      });
    } catch (error: any) {
      console.error("Failed to create event:", error);
      const errorMessage =
        error.message || "Failed to create event. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayInput = (
    field: "requirements" | "tags",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field: "requirements" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field: "requirements" | "tags", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
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
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl z-40">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 pr-10">
            Create New Event
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your event..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-600" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Location
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter venue address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Event Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="0 for free events"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Max Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxAttendees: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-primary-600" />
              Tags
            </h3>

            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    handleArrayInput("tags", index, e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter tag"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("tags", index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayField("tags")}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Add another tag
            </button>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Requirements (Optional)
            </h3>

            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) =>
                    handleArrayInput("requirements", index, e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter requirement"
                />
                {formData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("requirements", index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addArrayField("requirements")}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Add another requirement
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
