"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Map as MapIcon, Layers } from "lucide-react";
import { useEventsStore } from "@/stores/events-store";
import { Event } from "@/stores/events-store";
import { EventPopup } from "@/components/map/event-popup";
import { MAP_THEMES, type MapThemeKey } from "@/lib/map-themes";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom event icon
const createEventIcon = (category: string) => {
  const categoryStyles: Record<
    string,
    { color: string; gradient: string; icon: string }
  > = {
    "Music & Concerts": {
      color: "#E11D48",
      gradient: "linear-gradient(135deg, #E11D48 0%, #F43F5E 100%)",
      icon: "🎵",
    },
    "Arts & Culture": {
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
      icon: "🎨",
    },
    "Food & Drink": {
      color: "#EA580C",
      gradient: "linear-gradient(135deg, #EA580C 0%, #FB923C 100%)",
      icon: "🍽️",
    },
    "Sports & Fitness": {
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      icon: "⚽",
    },
    Technology: {
      color: "#0EA5E9",
      gradient: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
      icon: "💻",
    },
    "Business & Networking": {
      color: "#DC2626",
      gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
      icon: "💼",
    },
    "Health & Wellness": {
      color: "#8B5CF6",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
      icon: "🧘",
    },
    Education: {
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
      icon: "📚",
    },
    Community: {
      color: "#EC4899",
      gradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
      icon: "👥",
    },
    Fashion: {
      color: "#D946EF",
      gradient: "linear-gradient(135deg, #D946EF 0%, #E879F9 100%)",
      icon: "👗",
    },
    Festival: {
      color: "#F97316",
      gradient: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
      icon: "🎪",
    },
    Competition: {
      color: "#EAB308",
      gradient: "linear-gradient(135deg, #EAB308 0%, #FDE047 100%)",
      icon: "🏆",
    },
    Mystery: {
      color: "#6366F1",
      gradient: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
      icon: "🔍",
    },
    default: {
      color: "#007AFF",
      gradient: "linear-gradient(135deg, #007AFF 0%, #3B82F6 100%)",
      icon: "📍",
    },
  };

  const style = categoryStyles[category] || categoryStyles.default;

  return L.divIcon({
    html: `
      <div style="
        background: ${style.gradient};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: bounce 2s ease-in-out infinite;
      ">
        ${style.icon}
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .custom-event-marker:hover > div {
          transform: scale(1.2) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35), 0 3px 10px rgba(0,0,0,0.2) !important;
        }
      </style>
    `,
    className: "custom-event-marker",
    iconSize: [25, 25],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

interface InteractiveMapProps {
  className?: string;
  mapTheme?: MapThemeKey;
}

export default function InteractiveMap({
  className,
  mapTheme = "standard",
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const { events, fetchEvents, selectEvent, setUserLocation } =
    useEventsStore();

  // Default center (Chandigarh, India)
  const defaultCenter: [number, number] = [30.7333, 76.7794];
  const defaultZoom = 15;

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Fetch events near user's location
          fetchEvents({
            distance: 50, // 50km radius
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to fetching all events
          fetchEvents();
        }
      );
    } else {
      // Fallback to fetching all events
      fetchEvents();
    }
  }, [fetchEvents, setUserLocation]);

  const handleEventClick = (event: Event) => {
    selectEvent(event);
  };

  return (
    <div className={`h-full w-full relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          key={mapTheme}
          attribution={MAP_THEMES[mapTheme].attribution}
          url={MAP_THEMES[mapTheme].url}
        />

        <MapController center={defaultCenter} zoom={defaultZoom} />

        {/* Event Markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            icon={createEventIcon(event.category)}
            eventHandlers={{
              click: () => handleEventClick(event),
            }}
          >
            <Popup>
              <EventPopup event={event} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
