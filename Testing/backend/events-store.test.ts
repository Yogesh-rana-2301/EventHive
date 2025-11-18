import { renderHook, act, waitFor } from "@testing-library/react";
import { useEventsStore } from "@/stores/events-store";
import * as api from "@/lib/api/events";

jest.mock("@/lib/api/events");

describe("Events Store", () => {
  beforeEach(() => {
    useEventsStore.setState({
      events: [],
      selectedEvent: null,
      filters: {},
      loading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useEventsStore());

    expect(result.current.events).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedEvent).toBe(null);
  });

  describe("fetchEvents", () => {
    it("fetches events successfully", async () => {
      const mockEvents = [
        { id: "1", title: "Event 1" },
        { id: "2", title: "Event 2" },
      ];

      (api.fetchEvents as jest.Mock).mockResolvedValue(mockEvents);

      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.fetchEvents();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.events).toEqual(mockEvents);
        expect(result.current.error).toBe(null);
      });
    });

    it("handles fetch error", async () => {
      const mockError = new Error("Fetch failed");
      (api.fetchEvents as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.fetchEvents();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Fetch failed");
      });
    });
  });

  describe("createEvent", () => {
    it("creates event and updates state", async () => {
      const newEvent = { id: "3", title: "New Event" };
      (api.createEvent as jest.Mock).mockResolvedValue(newEvent);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.createEvent({ title: "New Event" });
      });

      await waitFor(() => {
        expect(result.current.events).toContainEqual(newEvent);
        expect(result.current.loading).toBe(false);
      });
    });

    it("handles create error", async () => {
      const mockError = new Error("Create failed");
      (api.createEvent as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        try {
          await result.current.createEvent({ title: "New Event" });
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe("Create failed");
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("updateEvent", () => {
    it("updates event in state", async () => {
      const existingEvents = [
        { id: "1", title: "Event 1" },
        { id: "2", title: "Event 2" },
      ];

      useEventsStore.setState({ events: existingEvents });

      const updatedEvent = { id: "1", title: "Updated Event 1" };
      (api.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.updateEvent("1", { title: "Updated Event 1" });
      });

      await waitFor(() => {
        const event = result.current.events.find((e) => e.id === "1");
        expect(event?.title).toBe("Updated Event 1");
      });
    });
  });

  describe("deleteEvent", () => {
    it("removes event from state", async () => {
      const existingEvents = [
        { id: "1", title: "Event 1" },
        { id: "2", title: "Event 2" },
      ];

      useEventsStore.setState({ events: existingEvents });
      (api.deleteEvent as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useEventsStore());

      await act(async () => {
        await result.current.deleteEvent("1");
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(1);
        expect(result.current.events.find((e) => e.id === "1")).toBeUndefined();
      });
    });
  });

  describe("setFilters", () => {
    it("updates filters", () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.setFilters({ category: "music" });
      });

      expect(result.current.filters).toEqual({ category: "music" });
    });

    it("merges filters", () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.setFilters({ category: "music" });
      });

      act(() => {
        result.current.setFilters({ city: "Mumbai" });
      });

      expect(result.current.filters).toEqual({
        category: "music",
        city: "Mumbai",
      });
    });
  });

  describe("setSelectedEvent", () => {
    it("sets selected event", () => {
      const { result } = renderHook(() => useEventsStore());
      const event = { id: "1", title: "Event 1" };

      act(() => {
        result.current.setSelectedEvent(event);
      });

      expect(result.current.selectedEvent).toEqual(event);
    });

    it("clears selected event", () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        result.current.setSelectedEvent({ id: "1", title: "Event 1" });
      });

      act(() => {
        result.current.setSelectedEvent(null);
      });

      expect(result.current.selectedEvent).toBe(null);
    });
  });

  describe("clearError", () => {
    it("clears error state", () => {
      const { result } = renderHook(() => useEventsStore());

      act(() => {
        useEventsStore.setState({ error: "Some error" });
      });

      expect(result.current.error).toBe("Some error");

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});
