# 🎯 Supabase Integration - Quick Reference

## ⚡ Quick Start (5 Minutes)

### 1. Create Supabase Project

```
1. Go to https://supabase.com
2. New Project → Choose name & region
3. Copy URL and Anon Key
```

### 2. Configure Environment

```bash
# Edit .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### 3. Create Database

```
1. Open Supabase SQL Editor
2. Copy all content from supabase-schema.sql
3. Paste and Run
```

### 4. Test

```bash
npm run dev
# Visit http://localhost:3000
# Click Sign In → Register
```

---

## 📦 What's Integrated

### ✅ Backend Features

- User Authentication (email/password)
- Event CRUD operations
- Search & filtering
- Location-based queries
- Join/leave events
- Real-time subscriptions (ready)
- File storage (ready)

### ✅ Files Created

```
src/lib/supabase.ts           # Client config
src/types/supabase.ts          # TypeScript types
supabase-schema.sql            # Database schema
SUPABASE_SETUP.md              # Full guide
check-supabase-setup.sh        # Setup checker
```

### ✅ Files Updated

```
src/stores/events-store.ts     # Uses Supabase
src/stores/auth-store.ts       # Uses Supabase Auth
```

---

## 🔧 Common Operations

### Authentication

```typescript
import { useAuthStore } from "@/stores/auth-store";

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

// Check auth status
const { isAuthenticated, user } = useAuthStore();
```

### Events

```typescript
import { useEventsStore } from "@/stores/events-store";

// Fetch all events
await fetchEvents();

// Search events
await fetchEvents({
  search: "music",
  category: "Entertainment",
  priceRange: { min: 0, max: 50 },
  distance: 10,
});

// Create event
await createEvent({
  title: "My Event",
  description: "Great event!",
  location: {
    lat: 28.6139,
    lng: 77.209,
    address: "Delhi",
    city: "New Delhi",
    state: "Delhi",
  },
  category: "Technology",
  startDate: "2025-11-20T18:00:00Z",
  endDate: "2025-11-20T21:00:00Z",
  price: 0,
  images: [],
  tags: ["tech"],
  isPublic: true,
});

// Join event
await joinEvent(eventId);

// Leave event
await leaveEvent(eventId);
```

### Direct Supabase Queries

```typescript
import { supabase } from "@/lib/supabase";

// Fetch with custom query
const { data, error } = await supabase
  .from("events")
  .select("*")
  .eq("category", "Music")
  .limit(10);

// Real-time subscription
const channel = supabase
  .channel("events")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "events",
    },
    (payload) => {
      console.log("Change:", payload);
    }
  )
  .subscribe();

// Location-based search
const { data } = await supabase.rpc("nearby_events", {
  lat: 28.6139,
  lng: 77.209,
  radius_km: 10,
});
```

---

## 📊 Database Tables

```
profiles          → User profiles
events            → All events
event_attendees   → Who's attending
chat_rooms        → Event chats
messages          → Chat messages
```

---

## 🔒 Security (Already Configured)

- ✅ Row Level Security enabled
- ✅ Users can only edit own data
- ✅ Public events visible to all
- ✅ Private data protected
- ✅ Automatic user profile creation

---

## 🐛 Quick Troubleshooting

**"Missing Supabase env variables"**
→ Check `.env.local` has correct values

**"Failed to fetch"**
→ Run `supabase-schema.sql` in Supabase

**"Not authenticated"**
→ User must login first

**"RLS policy error"**
→ Schema includes all policies, run full SQL

---

## 📚 Commands

```bash
# Check setup status
./check-supabase-setup.sh

# Start dev server
npm run dev

# Install dependencies
npm install

# Type check
npm run type-check
```

---

## 🎯 Testing Checklist

- [ ] Create Supabase project
- [ ] Copy URL & Key to `.env.local`
- [ ] Run `supabase-schema.sql`
- [ ] Start dev server
- [ ] Test signup
- [ ] Create an event
- [ ] Join an event
- [ ] Test search

---

## 🆘 Full Documentation

**`SUPABASE_SETUP.md`** - Complete setup guide with:

- Step-by-step instructions
- Advanced features
- Real-time setup
- File upload
- Production tips

---

## ✨ You're Ready!

Your app now has a complete backend. Just:

1. Add Supabase credentials
2. Run the SQL schema
3. Start coding! 🚀

**Check status**: `./check-supabase-setup.sh`
