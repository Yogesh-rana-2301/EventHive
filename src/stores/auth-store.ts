import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

interface ProfileData {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  location_lat?: number;
  location_lng?: number;
  city?: string;
  state?: string;
  badges?: string[];
  is_verified: boolean;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  location?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
  badges: string[];
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Partial<User> & { email: string; password: string }
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateLocation: (location: User["location"]) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profileError) throw profileError;
          if (!profileData) throw new Error("Profile not found");

          const profile = profileData as ProfileData;

          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            avatar: profile.avatar_url,
            location:
              profile.location_lat && profile.location_lng
                ? {
                    lat: profile.location_lat,
                    lng: profile.location_lng,
                    city: profile.city || "",
                    state: profile.state || "",
                  }
                : undefined,
            badges: profile.badges || [],
            isVerified: profile.is_verified,
            createdAt: profile.created_at,
          };

          set({
            user,
            token: data.session?.access_token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.message || "Login failed");
        }
      },

      register: async (userData) => {
        set({ isLoading: true });

        try {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                name: userData.name,
              },
            },
          });

          if (error) throw error;

          if (!data.user) {
            throw new Error("Registration failed");
          }

          // The profile will be created automatically by the database trigger
          // Fetch the created profile
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profileError) throw profileError;
          if (!profileData) throw new Error("Profile not found");

          const profile = profileData as ProfileData;

          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            avatar: profile.avatar_url,
            location:
              profile.location_lat && profile.location_lng
                ? {
                    lat: profile.location_lat,
                    lng: profile.location_lng,
                    city: profile.city || "",
                    state: profile.state || "",
                  }
                : undefined,
            badges: profile.badges || [],
            isVerified: profile.is_verified,
            createdAt: profile.created_at,
          };

          set({
            user,
            token: data.session?.access_token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        try {
          // Check if there's a pending session from landing page
          const pendingSession = sessionStorage.getItem(
            "eventhive_pending_session"
          );
          if (pendingSession) {
            try {
              const session = JSON.parse(pendingSession);
              // Set the session in Supabase
              await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
              });
              // Clear the pending session
              sessionStorage.removeItem("eventhive_pending_session");
              console.log("Set session from landing page");
            } catch (error) {
              console.error("Error setting pending session:", error);
            }
          }

          // First check Supabase authentication
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (session && session.user) {
            // User is authenticated with Supabase
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (!profileError && profileData) {
              const profile = profileData as ProfileData;
              const user: User = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                username: profile.username,
                avatar: profile.avatar_url,
                location:
                  profile.location_lat && profile.location_lng
                    ? {
                        lat: profile.location_lat,
                        lng: profile.location_lng,
                        city: profile.city || "",
                        state: profile.state || "",
                      }
                    : undefined,
                badges: profile.badges || [],
                isVerified: profile.is_verified,
                createdAt: profile.created_at,
              };

              set({
                user,
                token: session.access_token,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            }
          }

          // Fallback: Check if user came from landing page (legacy)
          const landingPageUser = localStorage.getItem("eventhive_user");
          if (landingPageUser) {
            try {
              const userData = JSON.parse(landingPageUser);
              if (userData.isAuthenticated) {
                console.warn(
                  "User logged in via landing page but not in Supabase. Please sign up properly."
                );
              }
            } catch (error) {
              console.error("Error parsing landing page user data:", error);
            }
          }

          // No valid authentication found
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error checking auth:", error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (updates) => {
        const { token, user } = get();

        if (!token || !user) return;

        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/users/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
          });

          if (!response.ok) {
            throw new Error("Profile update failed");
          }

          const updatedUser = await response.json();
          set({ user: updatedUser });
        } catch (error) {
          throw error;
        }
      },

      updateLocation: async (location) => {
        const { updateProfile } = get();
        await updateProfile({ location });
      },
    }),
    {
      name: "eventhive-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
