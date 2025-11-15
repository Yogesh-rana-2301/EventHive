# 🚀 Supabase Backend Integration - Complete Setup Guide

## ✅ What's Been Done

I've integrated Supabase as your backend! Here's what's implemented:

### Files Created:

1. **`src/lib/supabase.ts`** - Supabase client configuration
2. **`src/types/supabase.ts`** - TypeScript database types
3. **`supabase-schema.sql`** - Complete database schema

### Files Updated:

1. **`src/stores/events-store.ts`** - Now uses Supabase for all event operations
2. **`src/stores/auth-store.ts`** - Now uses Supabase Authentication

### Features Implemented:

✅ User authentication (signup/login/logout)
✅ Event CRUD operations (Create, Read, Update, Delete)
✅ Event search and filtering
✅ Join/Leave events
✅ Location-based event search
✅ Real-time capabilities (ready to use)
✅ Row Level Security (RLS) policies
✅ Automatic attendee counting

---

## 🎯 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: EventHive (or your choice)
   - **Database Password**: (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project" (takes ~2 minutes)

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 3: Set Up Environment Variables

1. In your project root, create `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace with YOUR actual values from Step 2

### Step 4: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase-schema.sql` in your project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** (bottom right)
7. You should see: "Success. No rows returned"

This creates:

- ✅ profiles table
- ✅ events table
- ✅ event_attendees table
- ✅ chat_rooms table
- ✅ messages table
- ✅ All necessary indexes
- ✅ Security policies
- ✅ Database triggers

### Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings (or use default for development)

### Step 6: Test the Integration

1. **Start your dev server**:

```bash
npm run dev
```

2. **Open the app**: `http://localhost:3000`

3. **Test signup**:
   - Click "Sign In" button
   - Switch to "Register" tab
   - Fill in your details
   - Submit

4. **Check Supabase**:
   - Go to **Authentication** → **Users**
   - You should see your new user!
   - Go to **Table Editor** → **profiles**
   - Your profile should be there!

---

## 🔥 What You Can Do Now

### 1. **Search Events**

The `fetchEvents()` function now supports:

- ✅ Search by text (title, description)
- ✅ Filter by category
- ✅ Filter by date range
- ✅ Filter by price range
- ✅ Filter by distance (location-based)

Example:

```typescript
const { fetchEvents } = useEventsStore();

// Search for music events
await fetchEvents({
  category: "Music",
  search: "concert",
  priceRange: { min: 0, max: 50 },
  distance: 10, // within 10km
});
```

### 2. **Create Events**

```typescript
const { createEvent } = useEventsStore();

const newEvent = await createEvent({
  title: "Tech Meetup",
  description: "Join us for networking!",
  location: {
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
  },
  category: "Technology",
  startDate: "2025-11-20T18:00:00Z",
  endDate: "2025-11-20T21:00:00Z",
  price: 0, // free event
  images: [],
  tags: ["tech", "networking"],
  isPublic: true,
});
```

### 3. **Join/Leave Events**

```typescript
const { joinEvent, leaveEvent } = useEventsStore();

// Join an event
await joinEvent(eventId);

// Leave an event
await leaveEvent(eventId);
```

### 4. **User Authentication**

```typescript
const { login, register, logout } = useAuthStore();

// Register
await register({
  email: "user@example.com",
  password: "secure123",
  name: "John Doe",
});

// Login
await login("user@example.com", "secure123");

// Logout
logout();
```

---

## 📊 Database Structure

### Tables Created:

**profiles** - User information

- Auto-created when user signs up
- Stores name, username, location, badges, etc.

**events** - All events

- Created by users
- Supports images, tags, categories
- Location-based (lat/lng)

**event_attendees** - Who's attending what

- Links users to events
- Tracks attendance status

**chat_rooms** - Event chat rooms

- Ready for real-time chat
- Links to events

**messages** - Chat messages

- Supports text, images, system messages

---

## 🔒 Security Features

### Row Level Security (RLS)

Your database is secure! Policies implemented:

**Profiles:**

- ✅ Anyone can view profiles
- ✅ Users can only update their own profile

**Events:**

- ✅ Anyone can view public events
- ✅ Only organizers can edit their events
- ✅ Only organizers can delete their events

**Attendees:**

- ✅ Anyone can see who's attending
- ✅ Users can join/leave events

**Chat:**

- ✅ Only members can view messages
- ✅ Authenticated users can send messages

---

## 🎨 Advanced Features

### 1. **Real-time Event Updates**

Add this to subscribe to event changes:

```typescript
// In your component
useEffect(() => {
  const channel = supabase
    .channel("events-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      (payload) => {
        console.log("Event changed:", payload);
        // Refresh events
        fetchEvents();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 2. **Location-based Search**

Database function `nearby_events` is already created:

```typescript
const { data } = await supabase.rpc("nearby_events", {
  lat: 28.6139,
  lng: 77.209,
  radius_km: 10,
});
```

### 3. **File Upload** (for event images)

```typescript
// Upload event image
const file = event.target.files[0];
const { data, error } = await supabase.storage
  .from("event-images")
  .upload(`${eventId}/${file.name}`, file);

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage.from("event-images").getPublicUrl(data.path);
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"

**Solution**: Make sure `.env.local` exists with correct values

### "Failed to fetch events"

**Solution**:

1. Check SQL schema is created
2. Verify environment variables
3. Check browser console for errors

### "Not authenticated" errors

**Solution**: User needs to be logged in first

```typescript
const { isAuthenticated } = useAuthStore();
if (!isAuthenticated) {
  // Show login modal
}
```

### Tables not created

**Solution**:

1. Go to SQL Editor in Supabase
2. Run the schema again
3. Check for error messages

### RLS Policy errors

**Solution**: The SQL schema includes all policies. If you see RLS errors:

1. Go to **Authentication** → check user is logged in
2. Go to **Table Editor** → **Events** → **View Policies**
3. Make sure policies are enabled

---

## 📈 Next Steps

### Immediate:

1. ✅ Run the SQL schema
2. ✅ Set environment variables
3. ✅ Test signup/login
4. ✅ Create your first event

### Soon:

1. 🎨 Set up Storage bucket for images
2. 💬 Implement real-time chat
3. 🔔 Add push notifications
4. 📊 Create admin dashboard

### Production:

1. 🔐 Set up custom email templates
2. 🌍 Add CDN for images
3. 📈 Enable database analytics
4. 🔄 Set up backups

---

## 🆘 Need Help?

**Check these files:**

- `src/lib/supabase.ts` - Client configuration
- `src/types/supabase.ts` - Type definitions
- `supabase-schema.sql` - Database schema

**Common Commands:**

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Check for TypeScript errors
npm run type-check

# Build for production
npm run build
```

**Supabase Dashboard Sections:**

- **Table Editor** - View your data
- **SQL Editor** - Run queries
- **Authentication** - Manage users
- **API Docs** - Auto-generated API documentation

---

## 🎉 You're All Set!

Your EventHive app now has a complete, production-ready backend with:

- ✅ User authentication
- ✅ Database with all tables
- ✅ Event management
- ✅ Real-time capabilities
- ✅ Security policies
- ✅ Location-based search

**Test it now**: `npm run dev` and create your first event! 🚀
