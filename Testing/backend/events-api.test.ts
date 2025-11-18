import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
} from "@/lib/api/events";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe("Events API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchEvents", () => {
    it("fetches events successfully", async () => {
      const mockEvents = [
        { id: "1", title: "Event 1", date: "2025-12-01" },
        { id: "2", title: "Event 2", date: "2025-12-15" },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await fetchEvents();

      expect(result).toEqual(mockEvents);
      expect(supabase.from).toHaveBeenCalledWith("events");
      expect(mockQuery.select).toHaveBeenCalledWith(
        "*, profiles(name, avatar_url)"
      );
    });

    it("applies category filter", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await fetchEvents({ category: "music" });

      expect(mockQuery.eq).toHaveBeenCalledWith("category", "music");
    });

    it("applies city filter", async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await fetchEvents({ city: "Mumbai" });

      expect(mockQuery.eq).toHaveBeenCalledWith("city", "Mumbai");
    });

    it("throws error when fetch fails", async () => {
      const mockError = { message: "Database error" };
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        gte: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await expect(fetchEvents()).rejects.toThrow("Failed to fetch events");
    });
  });

  describe("createEvent", () => {
    it("creates event successfully", async () => {
      const mockEventData = {
        title: "New Event",
        date: "2025-12-01",
        category: "technology",
      };
      const mockCreatedEvent = { id: "1", ...mockEventData };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreatedEvent,
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await createEvent(mockEventData);

      expect(result).toEqual(mockCreatedEvent);
      expect(mockQuery.insert).toHaveBeenCalledWith(mockEventData);
    });

    it("throws error when creation fails", async () => {
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "Insert failed" },
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await expect(createEvent({})).rejects.toThrow("Failed to create event");
    });
  });

  describe("updateEvent", () => {
    it("updates event successfully", async () => {
      const updates = { title: "Updated Title" };
      const mockUpdatedEvent = { id: "1", ...updates };

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedEvent,
          error: null,
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await updateEvent("1", updates);

      expect(result).toEqual(mockUpdatedEvent);
      expect(mockQuery.update).toHaveBeenCalledWith(updates);
      expect(mockQuery.eq).toHaveBeenCalledWith("id", "1");
    });
  });

  describe("deleteEvent", () => {
    it("deletes event successfully", async () => {
      const mockQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await deleteEvent("1");

      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith("id", "1");
    });

    it("throws error when deletion fails", async () => {
      const mockQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: { message: "Delete failed" },
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await expect(deleteEvent("1")).rejects.toThrow("Failed to delete event");
    });
  });

  describe("joinEvent", () => {
    it("joins event successfully", async () => {
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await joinEvent("event-1", "user-1");

      expect(supabase.from).toHaveBeenCalledWith("event_attendees");
      expect(mockQuery.insert).toHaveBeenCalledWith({
        event_id: "event-1",
        user_id: "user-1",
      });
    });

    it("throws error when join fails", async () => {
      const mockQuery = {
        insert: jest.fn().mockResolvedValue({
          error: { message: "Already joined" },
        }),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await expect(joinEvent("event-1", "user-1")).rejects.toThrow(
        "Failed to join event"
      );
    });
  });
});
