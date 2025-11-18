import { MapService } from "@/lib/integrations/mapbox";
import mapboxgl from "mapbox-gl";

jest.mock("mapbox-gl");

describe("MapService Integration", () => {
  let mapService: MapService;
  let mockContainer: HTMLElement;
  let mockMap: any;

  beforeEach(() => {
    mapService = new MapService();
    mockContainer = document.createElement("div");

    mockMap = {
      addControl: jest.fn(),
      flyTo: jest.fn(),
      remove: jest.fn(),
      on: jest.fn(),
    };

    (mapboxgl.Map as jest.Mock).mockImplementation(() => mockMap);
    (mapboxgl.Marker as jest.Mock).mockImplementation(() => ({
      setLngLat: jest.fn().mockReturnThis(),
      setPopup: jest.fn().mockReturnThis(),
      addTo: jest.fn().mockReturnThis(),
      remove: jest.fn(),
    }));
    (mapboxgl.Popup as jest.Mock).mockImplementation(() => ({
      setHTML: jest.fn().mockReturnThis(),
    }));
    (mapboxgl.NavigationControl as jest.Mock).mockImplementation(() => ({}));
    (mapboxgl.GeolocateControl as jest.Mock).mockImplementation(() => ({}));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("initialize", () => {
    it("initializes map with correct parameters", () => {
      const center: [number, number] = [72.8777, 19.076];

      mapService.initialize(mockContainer, center);

      expect(mapboxgl.Map).toHaveBeenCalledWith(
        expect.objectContaining({
          container: mockContainer,
          style: "mapbox://styles/mapbox/streets-v12",
          center,
          zoom: 12,
        })
      );
    });

    it("adds navigation control", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      expect(mapboxgl.NavigationControl).toHaveBeenCalled();
      expect(mockMap.addControl).toHaveBeenCalled();
    });

    it("adds geolocate control", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      expect(mapboxgl.GeolocateControl).toHaveBeenCalledWith(
        expect.objectContaining({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })
      );
    });

    it("returns map instance", () => {
      const result = mapService.initialize(mockContainer, [72.8777, 19.076]);
      expect(result).toBe(mockMap);
    });
  });

  describe("addEventMarkers", () => {
    beforeEach(() => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);
    });

    it("adds markers for all events", () => {
      const mockEvents = [
        {
          id: "1",
          title: "Event 1",
          location_lng: 72.8777,
          location_lat: 19.076,
          category: "music",
        },
        {
          id: "2",
          title: "Event 2",
          location_lng: 77.5946,
          location_lat: 12.9716,
          category: "technology",
        },
      ];

      mapService.addEventMarkers(mockEvents);

      expect(mapboxgl.Marker).toHaveBeenCalledTimes(2);
    });

    it("creates custom marker elements", () => {
      const mockEvent = {
        id: "1",
        title: "Test Event",
        location_lng: 72.8777,
        location_lat: 19.076,
        category: "music",
      };

      mapService.addEventMarkers([mockEvent]);

      const markerCalls = (mapboxgl.Marker as jest.Mock).mock.calls;
      expect(markerCalls[0][0]).toBeInstanceOf(HTMLElement);
    });

    it("sets marker coordinates", () => {
      const mockEvent = {
        id: "1",
        title: "Test Event",
        location_lng: 72.8777,
        location_lat: 19.076,
        category: "music",
      };

      const mockMarker = {
        setLngLat: jest.fn().mockReturnThis(),
        setPopup: jest.fn().mockReturnThis(),
        addTo: jest.fn().mockReturnThis(),
        remove: jest.fn(),
      };

      (mapboxgl.Marker as jest.Mock).mockImplementation(() => mockMarker);

      mapService.addEventMarkers([mockEvent]);

      expect(mockMarker.setLngLat).toHaveBeenCalledWith([72.8777, 19.076]);
    });

    it("creates popup for each marker", () => {
      const mockEvent = {
        id: "1",
        title: "Test Event",
        date: "2025-12-25",
        location: "Mumbai",
        location_lng: 72.8777,
        location_lat: 19.076,
        category: "music",
      };

      mapService.addEventMarkers([mockEvent]);

      expect(mapboxgl.Popup).toHaveBeenCalledWith({ offset: 25 });
    });

    it("clears existing markers before adding new ones", () => {
      const mockEvents = [
        {
          id: "1",
          location_lng: 72.8777,
          location_lat: 19.076,
          category: "music",
        },
      ];

      mapService.addEventMarkers(mockEvents);
      mapService.addEventMarkers(mockEvents);

      // Should have cleared and re-added
      expect(mapService["markers"]).toHaveLength(1);
    });
  });

  describe("clearMarkers", () => {
    it("removes all markers", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      const mockMarkerRemove = jest.fn();
      (mapboxgl.Marker as jest.Mock).mockImplementation(() => ({
        setLngLat: jest.fn().mockReturnThis(),
        setPopup: jest.fn().mockReturnThis(),
        addTo: jest.fn().mockReturnThis(),
        remove: mockMarkerRemove,
      }));

      const mockEvents = [
        {
          id: "1",
          location_lng: 72.8777,
          location_lat: 19.076,
          category: "music",
        },
      ];

      mapService.addEventMarkers(mockEvents);
      mapService.clearMarkers();

      expect(mockMarkerRemove).toHaveBeenCalled();
      expect(mapService["markers"]).toHaveLength(0);
    });
  });

  describe("flyTo", () => {
    it("flies to specified coordinates", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      mapService.flyTo([77.5946, 12.9716], 15);

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [77.5946, 12.9716],
        zoom: 15,
      });
    });

    it("uses default zoom if not specified", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      mapService.flyTo([77.5946, 12.9716]);

      expect(mockMap.flyTo).toHaveBeenCalledWith({
        center: [77.5946, 12.9716],
        zoom: 15,
      });
    });
  });

  describe("destroy", () => {
    it("removes all markers and map", () => {
      mapService.initialize(mockContainer, [72.8777, 19.076]);

      const mockEvents = [
        {
          id: "1",
          location_lng: 72.8777,
          location_lat: 19.076,
          category: "music",
        },
      ];
      mapService.addEventMarkers(mockEvents);

      mapService.destroy();

      expect(mockMap.remove).toHaveBeenCalled();
      expect(mapService["map"]).toBeNull();
    });

    it("handles destroy when map not initialized", () => {
      expect(() => mapService.destroy()).not.toThrow();
    });
  });
});
