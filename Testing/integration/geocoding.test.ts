import axios from "axios";
import {
  geocodeAddress,
  reverseGeocode,
  extractCityState,
} from "@/lib/integrations/geocoding";

jest.mock("axios");

describe("Geocoding Service Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("geocodeAddress", () => {
    it("geocodes address successfully", async () => {
      const mockResponse = {
        data: {
          features: [
            {
              place_name: "Mumbai, Maharashtra, India",
              center: [72.8777, 19.076],
              context: [
                { id: "place.123", text: "Mumbai" },
                { id: "region.456", text: "Maharashtra" },
              ],
            },
            {
              place_name: "Bangalore, Karnataka, India",
              center: [77.5946, 12.9716],
              context: [
                { id: "place.789", text: "Bangalore" },
                { id: "region.012", text: "Karnataka" },
              ],
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const results = await geocodeAddress("Mumbai");

      expect(results).toHaveLength(2);
      expect(results[0].place_name).toBe("Mumbai, Maharashtra, India");
      expect(results[0].center).toEqual([72.8777, 19.076]);
    });

    it("sends correct API parameters", async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { features: [] } });

      await geocodeAddress("Mumbai");

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("Mumbai"),
        expect.objectContaining({
          params: expect.objectContaining({
            country: "IN",
            limit: 5,
          }),
        })
      );
    });

    it("restricts search to India", async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { features: [] } });

      await geocodeAddress("Mumbai");

      const callParams = (axios.get as jest.Mock).mock.calls[0][1].params;
      expect(callParams.country).toBe("IN");
    });

    it("limits results to 5", async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { features: [] } });

      await geocodeAddress("Mumbai");

      const callParams = (axios.get as jest.Mock).mock.calls[0][1].params;
      expect(callParams.limit).toBe(5);
    });

    it("handles geocoding errors", async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(geocodeAddress("Invalid")).rejects.toThrow(
        "Failed to geocode address"
      );
    });

    it("encodes address in URL", async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { features: [] } });

      await geocodeAddress("Mumbai, Maharashtra");

      const callUrl = (axios.get as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain(encodeURIComponent("Mumbai, Maharashtra"));
    });

    it("returns empty array for no results", async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: { features: [] } });

      const results = await geocodeAddress("NonExistentPlace");

      expect(results).toEqual([]);
    });
  });

  describe("reverseGeocode", () => {
    it("reverse geocodes coordinates successfully", async () => {
      const mockResponse = {
        data: {
          features: [
            {
              place_name: "Mumbai, Maharashtra, India",
              center: [72.8777, 19.076],
              context: [
                { id: "place.123", text: "Mumbai" },
                { id: "region.456", text: "Maharashtra" },
              ],
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await reverseGeocode(72.8777, 19.076);

      expect(result.place_name).toBe("Mumbai, Maharashtra, India");
      expect(result.center).toEqual([72.8777, 19.076]);
    });

    it("sends correct coordinates", async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          features: [{ place_name: "Test", center: [0, 0], context: [] }],
        },
      });

      await reverseGeocode(72.8777, 19.076);

      const callUrl = (axios.get as jest.Mock).mock.calls[0][0];
      expect(callUrl).toContain("72.8777,19.0760");
    });

    it("handles reverse geocoding errors", async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(reverseGeocode(72.8777, 19.076)).rejects.toThrow(
        "Failed to reverse geocode coordinates"
      );
    });

    it("returns first feature from results", async () => {
      const mockResponse = {
        data: {
          features: [
            { place_name: "First", center: [1, 1], context: [] },
            { place_name: "Second", center: [2, 2], context: [] },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await reverseGeocode(1, 1);

      expect(result.place_name).toBe("First");
    });
  });

  describe("extractCityState", () => {
    it("extracts city from context", () => {
      const result = {
        place_name: "Mumbai, Maharashtra, India",
        center: [72.8777, 19.076] as [number, number],
        context: [
          { id: "place.123", text: "Mumbai" },
          { id: "region.456", text: "Maharashtra" },
        ],
      };

      const { city, state } = extractCityState(result);

      expect(city).toBe("Mumbai");
    });

    it("extracts state from context", () => {
      const result = {
        place_name: "Mumbai, Maharashtra, India",
        center: [72.8777, 19.076] as [number, number],
        context: [
          { id: "place.123", text: "Mumbai" },
          { id: "region.456", text: "Maharashtra" },
        ],
      };

      const { city, state } = extractCityState(result);

      expect(state).toBe("Maharashtra");
    });

    it("handles missing city", () => {
      const result = {
        place_name: "India",
        center: [77.0, 20.0] as [number, number],
        context: [{ id: "country.123", text: "India" }],
      };

      const { city, state } = extractCityState(result);

      expect(city).toBeUndefined();
    });

    it("handles missing state", () => {
      const result = {
        place_name: "Mumbai",
        center: [72.8777, 19.076] as [number, number],
        context: [{ id: "place.123", text: "Mumbai" }],
      };

      const { city, state } = extractCityState(result);

      expect(state).toBeUndefined();
    });

    it("handles empty context", () => {
      const result = {
        place_name: "Unknown Location",
        center: [0, 0] as [number, number],
        context: [],
      };

      const { city, state } = extractCityState(result);

      expect(city).toBeUndefined();
      expect(state).toBeUndefined();
    });
  });
});
