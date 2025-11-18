import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EventCard } from "@/components/events/event-card";

const mockEvent = {
  id: "1",
  title: "Tech Conference 2025",
  description: "A great tech conference",
  date: "2025-12-25",
  location: "Mumbai, Maharashtra",
  location_lat: 19.076,
  location_lng: 72.8777,
  category: "technology",
  attendees: 50,
  max_attendees: 100,
  creator_id: "user-1",
};

describe("EventCard Component", () => {
  it("displays event information correctly", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText("Tech Conference 2025")).toBeInTheDocument();
    expect(screen.getByText("A great tech conference")).toBeInTheDocument();
    expect(screen.getByText("Mumbai, Maharashtra")).toBeInTheDocument();
  });

  it("handles join event action", async () => {
    const onJoin = jest.fn();
    render(<EventCard event={mockEvent} onJoin={onJoin} />);

    const joinButton = screen.getByText("Join Event");
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(onJoin).toHaveBeenCalledWith(mockEvent.id);
    });
  });

  it("shows full indicator when event is full", () => {
    const fullEvent = { ...mockEvent, attendees: 100, max_attendees: 100 };
    render(<EventCard event={fullEvent} />);

    expect(screen.getByText("Event Full")).toBeInTheDocument();
    expect(screen.getByText("Join Event")).toBeDisabled();
  });

  it("formats date correctly", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/Dec 25, 2025/)).toBeInTheDocument();
  });

  it("displays category badge", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("technology")).toBeInTheDocument();
  });

  it("shows attendee count", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText("50/100 attendees")).toBeInTheDocument();
  });
});
