import { create } from "zustand";
import { DUMMY_EVENTS } from "@/lib/dummy-data";
import { supabase } from "@/lib/supabase";

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: {
    id: string;
    name: string;
    isVerified: boolean;
    avatar?: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
  };
  category: string;
  startDate: string;
  endDate: string;
  price: number; // 0 for free events
  maxAttendees?: number;
  currentAttendees: number;
  images: string[];
  tags: string[];
  isPublic: boolean;
  chatRoomId?: string;
  ticketUrl?: string;
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  distance?: number;
  search?: string;
}

interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  isLoading: boolean;
  filters: EventFilters;
  userLocation: { lat: number; lng: number } | null;

  // Actions
  fetchEvents: (filters?: EventFilters) => Promise<void>;
  createEvent: (
    eventData: Omit<
      Event,
      "id" | "createdAt" | "updatedAt" | "currentAttendees"
    >
  ) => Promise<Event>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  selectEvent: (event: Event | null) => void;
  setFilters: (filters: EventFilters) => void;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  getNearbyEvents: (lat: number, lng: number, radius: number) => Event[];
  searchEventsByName: (query: string) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: DUMMY_EVENTS,
  selectedEvent: null,
  isLoading: false,
  filters: {},
  userLocation: null,

  fetchEvents: async (filters = {}) => {
    set({ isLoading: true });

    try {
      let query = supabase
        .from("events")
        .select(
          `
          *,
          organizer:profiles!organizer_id (
            id,
            name,
            avatar_url,
            is_verified
          )
        `
        )
        .eq("is_public", true)
        .order("start_date", { ascending: true });

      // Apply filters
      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.dateRange) {
        query = query
          .gte("start_date", filters.dateRange.start)
          .lte("end_date", filters.dateRange.end);
      }

      if (filters.priceRange) {
        query = query
          .gte("price", filters.priceRange.min)
          .lte("price", filters.priceRange.max);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        // Fallback to dummy data
        set({ events: DUMMY_EVENTS, isLoading: false, filters });
        return;
      }

      // Transform Supabase data to match our Event interface
      const events: Event[] = (data || []).map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        organizer: {
          id: event.organizer.id,
          name: event.organizer.name,
          isVerified: event.organizer.is_verified,
          avatar: event.organizer.avatar_url,
        },
        location: {
          lat: event.location_lat,
          lng: event.location_lng,
          address: event.address,
          city: event.city,
          state: event.state,
        },
        category: event.category,
        startDate: event.start_date,
        endDate: event.end_date,
        price: event.price,
        maxAttendees: event.max_attendees,
        currentAttendees: event.current_attendees,
        images: event.images,
        tags: event.tags,
        isPublic: event.is_public,
        chatRoomId: event.chat_room_id,
        ticketUrl: event.ticket_url,
        requirements: event.requirements,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      }));

      // Apply distance filter if location is provided
      let filteredEvents = events;
      const { userLocation } = get();
      if (userLocation && filters.distance) {
        filteredEvents = get().getNearbyEvents(
          userLocation.lat,
          userLocation.lng,
          filters.distance
        );
      }

      set({ events: filteredEvents, isLoading: false, filters });
    } catch (error) {
      console.error("Error fetching events:", error);
      // Fallback to dummy data
      set({ events: DUMMY_EVENTS, isLoading: false });
    }
  },

  searchEventsByName: async (query: string) => {
    set({ isLoading: true });
    try {
      // Simple title-only ilike search to match user's request
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          organizer:profiles!organizer_id (
            id,
            name,
            avatar_url,
            is_verified
          )
        `
        )
        .ilike("title", `%${query}%`)
        .eq("is_public", true)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error searching events by name:", error);
        set({ events: DUMMY_EVENTS, isLoading: false });
        return;
      }

      const events: Event[] = (data || []).map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        organizer: {
          id: event.organizer.id,
          name: event.organizer.name,
          isVerified: event.organizer.is_verified,
          avatar: event.organizer.avatar_url,
        },
        location: {
          lat: event.location_lat,
          lng: event.location_lng,
          address: event.address,
          city: event.city,
          state: event.state,
        },
        category: event.category,
        startDate: event.start_date,
        endDate: event.end_date,
        price: event.price,
        maxAttendees: event.max_attendees,
        currentAttendees: event.current_attendees,
        images: event.images,
        tags: event.tags,
        isPublic: event.is_public,
        chatRoomId: event.chat_room_id,
        ticketUrl: event.ticket_url,
        requirements: event.requirements,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
      }));

      set({
        events,
        isLoading: false,
        filters: { ...(get().filters || {}), search: query },
      });
    } catch (error) {
      console.error("Error searching events:", error);
      set({ events: DUMMY_EVENTS, isLoading: false });
    }
  },

  createEvent: async (eventData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First, create the event
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title: eventData.title,
            description: eventData.description,
            organizer_id: user.id,
            location_lat: eventData.location.lat,
            location_lng: eventData.location.lng,
            address: eventData.location.address,
            city: eventData.location.city,
            state: eventData.location.state,
            category: eventData.category,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            price: eventData.price,
            max_attendees: eventData.maxAttendees,
            images: eventData.images,
            tags: eventData.tags,
            is_public: eventData.isPublic,
            ticket_url: eventData.ticketUrl,
            requirements: eventData.requirements,
          },
        ] as any)
        .select(
          `
          *,
          organizer:profiles!organizer_id (
            id,
            name,
            avatar_url,
            is_verified
          )
        `
        )
        .single();

      if (error) throw error;
      if (!data) throw new Error("Failed to create event");

      const insertedEvent = data as any;

      // Create a chat room for this event
      const { data: chatRoomData, error: chatRoomError } = await (
        supabase as any
      )
        .from("chat_rooms")
        .insert([
          {
            name: `${insertedEvent.title} - Chat`,
            type: "event",
            event_id: insertedEvent.id,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (chatRoomError) {
        console.error("Error creating chat room:", chatRoomError);
      } else if (chatRoomData) {
        // Update the event with the chat room ID
        await (supabase as any)
          .from("events")
          .update({ chat_room_id: chatRoomData.id })
          .eq("id", insertedEvent.id);

        insertedEvent.chat_room_id = chatRoomData.id;
      }

      const newEvent: Event = {
        id: insertedEvent.id,
        title: insertedEvent.title,
        description: insertedEvent.description,
        organizer: {
          id: insertedEvent.organizer.id,
          name: insertedEvent.organizer.name,
          isVerified: insertedEvent.organizer.is_verified,
          avatar: insertedEvent.organizer.avatar_url,
        },
        location: {
          lat: insertedEvent.location_lat,
          lng: insertedEvent.location_lng,
          address: insertedEvent.address,
          city: insertedEvent.city,
          state: insertedEvent.state,
        },
        category: insertedEvent.category,
        startDate: insertedEvent.start_date,
        endDate: insertedEvent.end_date,
        price: insertedEvent.price,
        maxAttendees: insertedEvent.max_attendees,
        currentAttendees: insertedEvent.current_attendees,
        images: insertedEvent.images,
        tags: insertedEvent.tags,
        isPublic: insertedEvent.is_public,
        chatRoomId: insertedEvent.chat_room_id,
        ticketUrl: insertedEvent.ticket_url,
        requirements: insertedEvent.requirements,
        createdAt: insertedEvent.created_at,
        updatedAt: insertedEvent.updated_at,
      };

      set((state) => ({
        events: [...state.events, newEvent],
      }));

      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  updateEvent: async (eventId, updates) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.location) {
        updateData.location_lat = updates.location.lat;
        updateData.location_lng = updates.location.lng;
        updateData.address = updates.location.address;
        updateData.city = updates.location.city;
        updateData.state = updates.location.state;
      }
      if (updates.category) updateData.category = updates.category;
      if (updates.startDate) updateData.start_date = updates.startDate;
      if (updates.endDate) updateData.end_date = updates.endDate;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.maxAttendees) updateData.max_attendees = updates.maxAttendees;
      if (updates.images) updateData.images = updates.images;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined)
        updateData.is_public = updates.isPublic;

      const result = await (supabase as any)
        .from("events")
        .update(updateData)
        .eq("id", eventId)
        .select(
          `
          *,
          organizer:profiles!organizer_id (
            id,
            name,
            avatar_url,
            is_verified
          )
        `
        )
        .single();

      const { data, error } = result;

      if (error) throw error;

      const updatedEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description,
        organizer: {
          id: data.organizer.id,
          name: data.organizer.name,
          isVerified: data.organizer.is_verified,
          avatar: data.organizer.avatar_url,
        },
        location: {
          lat: data.location_lat,
          lng: data.location_lng,
          address: data.address,
          city: data.city,
          state: data.state,
        },
        category: data.category,
        startDate: data.start_date,
        endDate: data.end_date,
        price: data.price,
        maxAttendees: data.max_attendees,
        currentAttendees: data.current_attendees,
        images: data.images,
        tags: data.tags,
        isPublic: data.is_public,
        chatRoomId: data.chat_room_id,
        ticketUrl: data.ticket_url,
        requirements: data.requirements,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      set((state) => ({
        events: state.events.map((event) =>
          event.id === eventId ? updatedEvent : event
        ),
        selectedEvent:
          state.selectedEvent?.id === eventId
            ? updatedEvent
            : state.selectedEvent,
      }));
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
        selectedEvent:
          state.selectedEvent?.id === eventId ? null : state.selectedEvent,
      }));
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  joinEvent: async (eventId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await (supabase as any).from("event_attendees").insert([
        {
          event_id: eventId,
          user_id: user.id,
          status: "attending",
        },
      ]);

      if (error) throw error;

      // The database trigger will automatically update current_attendees
      // Fetch the updated event to get the new count
      const { data: eventData } = await supabase
        .from("events")
        .select("current_attendees")
        .eq("id", eventId)
        .single();

      if (eventData) {
        const typedEventData = eventData as any;
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? { ...event, currentAttendees: typedEventData.current_attendees }
              : event
          ),
          selectedEvent:
            state.selectedEvent?.id === eventId
              ? {
                  ...state.selectedEvent,
                  currentAttendees: typedEventData.current_attendees,
                }
              : state.selectedEvent,
        }));
      }
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  },

  leaveEvent: async (eventId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("event_attendees")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;

      // The database trigger will automatically update current_attendees
      // Fetch the updated event to get the new count
      const { data: eventData } = await supabase
        .from("events")
        .select("current_attendees")
        .eq("id", eventId)
        .single();

      if (eventData) {
        const typedEventData = eventData as any;
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? { ...event, currentAttendees: typedEventData.current_attendees }
              : event
          ),
          selectedEvent:
            state.selectedEvent?.id === eventId
              ? {
                  ...state.selectedEvent,
                  currentAttendees: typedEventData.current_attendees,
                }
              : state.selectedEvent,
        }));
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  },

  selectEvent: (event) => {
    set({ selectedEvent: event });
  },

  setFilters: (filters) => {
    set({ filters });
  },

  setUserLocation: (location) => {
    set({ userLocation: location });
  },

  getNearbyEvents: (lat, lng, radius) => {
    const { events } = get();

    // Calculate distance using Haversine formula
    const calculateDistance = (
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number
    ) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return events.filter((event) => {
      const distance = calculateDistance(
        lat,
        lng,
        event.location.lat,
        event.location.lng
      );
      return distance <= radius;
    });
  },
}));
