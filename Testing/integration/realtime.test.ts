import { RealtimeService } from "@/lib/integrations/realtime";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase");

describe("RealtimeService Integration", () => {
  let realtimeService: RealtimeService;
  let mockChannel: any;

  beforeEach(() => {
    realtimeService = new RealtimeService();

    mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      track: jest.fn(),
      presenceState: jest.fn().mockReturnValue({}),
      unsubscribe: jest.fn(),
    };

    (supabase.channel as jest.Mock).mockReturnValue(mockChannel);
    (supabase.removeChannel as jest.Mock).mockReturnValue(Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("subscribeToEventUpdates", () => {
    it("creates channel with correct name", () => {
      const eventId = "event-123";
      realtimeService.subscribeToEventUpdates(eventId, jest.fn());

      expect(supabase.channel).toHaveBeenCalledWith(`event-${eventId}`);
    });

    it("subscribes to postgres changes", () => {
      const mockCallback = jest.fn();
      const eventId = "event-123";

      realtimeService.subscribeToEventUpdates(eventId, mockCallback);

      expect(mockChannel.on).toHaveBeenCalledWith(
        "postgres_changes",
        expect.objectContaining({
          event: "*",
          schema: "public",
          table: "events",
          filter: `id=eq.${eventId}`,
        }),
        expect.any(Function)
      );
    });

    it("subscribes to channel", () => {
      realtimeService.subscribeToEventUpdates("event-123", jest.fn());

      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    it("returns unsubscribe function", () => {
      const unsubscribe = realtimeService.subscribeToEventUpdates(
        "event-123",
        jest.fn()
      );

      expect(typeof unsubscribe).toBe("function");
    });

    it("unsubscribe removes channel", () => {
      const unsubscribe = realtimeService.subscribeToEventUpdates(
        "event-123",
        jest.fn()
      );

      unsubscribe();

      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });

    it("calls callback on update", () => {
      const mockCallback = jest.fn();
      let updateHandler: Function;

      mockChannel.on.mockImplementation((event, config, handler) => {
        updateHandler = handler;
        return mockChannel;
      });

      realtimeService.subscribeToEventUpdates("event-123", mockCallback);

      const payload = { new: { id: "event-123", title: "Updated" } };
      updateHandler!(payload);

      expect(mockCallback).toHaveBeenCalledWith(payload);
    });
  });

  describe("subscribeToChat", () => {
    it("creates channel with correct name", () => {
      const roomId = "room-456";
      realtimeService.subscribeToChat(roomId, jest.fn());

      expect(supabase.channel).toHaveBeenCalledWith(`room-${roomId}`);
    });

    it("subscribes to INSERT events only", () => {
      const mockCallback = jest.fn();
      const roomId = "room-456";

      realtimeService.subscribeToChat(roomId, mockCallback);

      expect(mockChannel.on).toHaveBeenCalledWith(
        "postgres_changes",
        expect.objectContaining({
          event: "INSERT",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        }),
        expect.any(Function)
      );
    });

    it("calls callback on new message", () => {
      const mockCallback = jest.fn();
      let messageHandler: Function;

      mockChannel.on.mockImplementation((event, config, handler) => {
        messageHandler = handler;
        return mockChannel;
      });

      realtimeService.subscribeToChat("room-456", mockCallback);

      const newMessage = { id: "msg-1", content: "Hello", room_id: "room-456" };
      messageHandler!({ new: newMessage });

      expect(mockCallback).toHaveBeenCalledWith(newMessage);
    });

    it("returns unsubscribe function", () => {
      const unsubscribe = realtimeService.subscribeToChat(
        "room-456",
        jest.fn()
      );

      expect(typeof unsubscribe).toBe("function");

      unsubscribe();
      expect(supabase.removeChannel).toHaveBeenCalled();
    });
  });

  describe("subscribeToPresence", () => {
    it("creates presence channel", () => {
      const roomId = "room-789";
      realtimeService.subscribeToPresence(roomId, jest.fn());

      expect(supabase.channel).toHaveBeenCalledWith(
        `presence-${roomId}`,
        expect.objectContaining({
          config: { presence: { key: "user_id" } },
        })
      );
    });

    it("subscribes to presence events", () => {
      const mockCallback = jest.fn();
      realtimeService.subscribeToPresence("room-789", mockCallback);

      expect(mockChannel.on).toHaveBeenCalledWith(
        "presence",
        { event: "sync" },
        expect.any(Function)
      );
    });

    it("calls callback with presence state", () => {
      const mockCallback = jest.fn();
      let presenceHandler: Function;

      const mockPresenceState = {
        "user-1": [{ user_id: "user-1", online_at: "2025-01-01" }],
        "user-2": [{ user_id: "user-2", online_at: "2025-01-01" }],
      };

      mockChannel.presenceState.mockReturnValue(mockPresenceState);

      mockChannel.on.mockImplementation((event, config, handler) => {
        if (event === "presence") {
          presenceHandler = handler;
        }
        return mockChannel;
      });

      realtimeService.subscribeToPresence("room-789", mockCallback);

      presenceHandler!();

      expect(mockCallback).toHaveBeenCalledWith([
        { user_id: "user-1", online_at: "2025-01-01" },
        { user_id: "user-2", online_at: "2025-01-01" },
      ]);
    });

    it("tracks user presence on subscription", async () => {
      let subscribeHandler: Function;

      mockChannel.subscribe.mockImplementation((handler) => {
        subscribeHandler = handler;
        return mockChannel;
      });

      realtimeService.subscribeToPresence("room-789", jest.fn());

      await subscribeHandler("SUBSCRIBED");

      expect(mockChannel.track).toHaveBeenCalledWith(
        expect.objectContaining({
          online_at: expect.any(String),
        })
      );
    });

    it("does not track if subscription fails", async () => {
      let subscribeHandler: Function;

      mockChannel.subscribe.mockImplementation((handler) => {
        subscribeHandler = handler;
        return mockChannel;
      });

      realtimeService.subscribeToPresence("room-789", jest.fn());

      await subscribeHandler("CHANNEL_ERROR");

      expect(mockChannel.track).not.toHaveBeenCalled();
    });
  });

  describe("unsubscribe", () => {
    it("removes specific channel", () => {
      realtimeService.subscribeToEventUpdates("event-1", jest.fn());

      realtimeService.unsubscribe("event-event-1");

      expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
    });

    it("handles non-existent channel gracefully", () => {
      expect(() => {
        realtimeService.unsubscribe("non-existent");
      }).not.toThrow();
    });
  });

  describe("unsubscribeAll", () => {
    it("unsubscribes from all channels", () => {
      realtimeService.subscribeToEventUpdates("event-1", jest.fn());
      realtimeService.subscribeToChat("room-1", jest.fn());
      realtimeService.subscribeToPresence("room-2", jest.fn());

      realtimeService.unsubscribeAll();

      expect(supabase.removeChannel).toHaveBeenCalledTimes(3);
    });

    it("clears all channel references", () => {
      realtimeService.subscribeToEventUpdates("event-1", jest.fn());
      realtimeService.subscribeToChat("room-1", jest.fn());

      realtimeService.unsubscribeAll();

      expect(realtimeService["channels"].size).toBe(0);
    });

    it("handles empty channel list", () => {
      expect(() => {
        realtimeService.unsubscribeAll();
      }).not.toThrow();
    });
  });
});
