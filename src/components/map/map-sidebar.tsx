"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventsStore, EventFilters } from "@/stores/events-store";
import { EVENT_CATEGORIES } from "@/lib/utils";
import { CreateEventModal } from "@/components/events/create-event-modal";

export function MapSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<EventFilters>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { fetchEvents, events, isLoading, selectEvent } = useEventsStore();
  const { searchEventsByName } = useEventsStore();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const filters = { ...activeFilters, search: query };
    setActiveFilters(filters);
    if (!query) {
      await fetchEvents(filters);
    } else {
      await searchEventsByName(query);
    }
  };

  const handleFilterChange = async (key: keyof EventFilters, value: any) => {
    const filters = { ...activeFilters, [key]: value };
    setActiveFilters(filters);
    await fetchEvents(filters);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`glassmorphism transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} w-80 h-full flex flex-col shadow-2xl relative`}
      >
        {/* Toggle Button - On the right edge */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-12 top-1/2 -translate-y-1/2 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-primary-500 hover:to-purple-600 text-primary-600 hover:text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-glow z-20 border-2 border-primary-200 dark:border-primary-800 hover:border-transparent"
          style={{
            clipPath: "polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)",
            padding: "1.5rem 0.25rem",
            width: "2.0rem",
            height: "5 rem",
          }}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <div className="relative flex items-center justify-center h-full">
            {isOpen ? (
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:scale-110" />
            ) : (
              <ChevronRight className="h-6 w-6 transition-transform group-hover:scale-110 animate-bounce-subtle" />
            )}
          </div>
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div>
            <h1 className="text-xl font-bold gradient-text">Event Hive</h1>
            <p className="text-sm text-muted-foreground">
              Discover events around you
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <Filter className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </span>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={activeFilters.category || ""}
              onChange={(e) =>
                handleFilterChange("category", e.target.value || undefined)
              }
              className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all shadow-sm hover:shadow-md"
            >
              <option value="">All Categories</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <select
              value={activeFilters.distance || ""}
              onChange={(e) =>
                handleFilterChange(
                  "distance",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                min="0"
                onChange={(e) => {
                  const min = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;
                  const current = activeFilters.priceRange || {};
                  handleFilterChange("priceRange", { ...current, min });
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                min="0"
                onChange={(e) => {
                  const max = e.target.value
                    ? parseFloat(e.target.value)
                    : undefined;
                  const current = activeFilters.priceRange || {};
                  handleFilterChange("priceRange", { ...current, max });
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                onChange={(e) => {
                  const start = e.target.value;
                  const current = activeFilters.dateRange || {};
                  handleFilterChange("dateRange", { ...current, start });
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="date"
                onChange={(e) => {
                  const end = e.target.value;
                  const current = activeFilters.dateRange || {};
                  handleFilterChange("dateRange", { ...current, end });
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveFilters({});
                setSearchQuery("");
                fetchEvents();
              }}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                {isLoading
                  ? "Loading events..."
                  : `${events.length} Events Found`}
              </h3>
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => selectEvent(event)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    {event.images.length > 0 && (
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.location.city}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-primary-600">
                          {event.price === 0 ? "Free" : `₹${event.price}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {event.currentAttendees} attending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
