// Supabase Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          location_lat: number | null;
          location_lng: number | null;
          city: string | null;
          state: string | null;
          badges: string[];
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          city?: string | null;
          state?: string | null;
          badges?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          city?: string | null;
          state?: string | null;
          badges?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          organizer_id: string;
          location_lat: number;
          location_lng: number;
          address: string;
          city: string;
          state: string;
          category: string;
          start_date: string;
          end_date: string;
          price: number;
          max_attendees: number | null;
          current_attendees: number;
          images: string[];
          tags: string[];
          is_public: boolean;
          chat_room_id: string | null;
          ticket_url: string | null;
          requirements: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          organizer_id: string;
          location_lat: number;
          location_lng: number;
          address: string;
          city: string;
          state: string;
          category: string;
          start_date: string;
          end_date: string;
          price?: number;
          max_attendees?: number | null;
          current_attendees?: number;
          images?: string[];
          tags?: string[];
          is_public?: boolean;
          chat_room_id?: string | null;
          ticket_url?: string | null;
          requirements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          organizer_id?: string;
          location_lat?: number;
          location_lng?: number;
          address?: string;
          city?: string;
          state?: string;
          category?: string;
          start_date?: string;
          end_date?: string;
          price?: number;
          max_attendees?: number | null;
          current_attendees?: number;
          images?: string[];
          tags?: string[];
          is_public?: boolean;
          chat_room_id?: string | null;
          ticket_url?: string | null;
          requirements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_attendees: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          status: "attending" | "interested" | "not_attending";
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          status?: "attending" | "interested" | "not_attending";
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          status?: "attending" | "interested" | "not_attending";
          created_at?: string;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          name: string;
          type: "event" | "direct" | "group";
          event_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "event" | "direct" | "group";
          event_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "event" | "direct" | "group";
          event_id?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          content: string;
          type: "text" | "image" | "system";
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          type?: "text" | "image" | "system";
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          content?: string;
          type?: "text" | "image" | "system";
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      nearby_events: {
        Args: {
          lat: number;
          lng: number;
          radius_km: number;
        };
        Returns: {
          id: string;
          title: string;
          distance_km: number;
        }[];
      };
    };
    Enums: {
      event_status: "attending" | "interested" | "not_attending";
      chat_type: "event" | "direct" | "group";
      message_type: "text" | "image" | "system";
    };
  };
}
