# EventHive Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      EVENTHIVE APP                          │
│                    (Next.js Frontend)                       │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               │                          │
       ┌───────▼─────────┐        ┌──────▼──────────┐
       │   Auth Store    │        │  Events Store   │
       │  (Zustand)      │        │   (Zustand)     │
       └───────┬─────────┘        └──────┬──────────┘
               │                          │
               │                          │
               └──────────┬───────────────┘
                          │
                    ┌─────▼──────┐
                    │  Supabase  │
                    │   Client   │
                    └─────┬──────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
    │  Auth   │     │Database │     │ Storage │
    │ Service │     │(Postgres)│     │ Service │
    └─────────┘     └────┬────┘     └─────────┘
                         │
                    ┌────▼────┐
                    │ Tables  │
                    ├─────────┤
                    │profiles │
                    │events   │
                    │attendees│
                    │chats    │
                    │messages │
                    └─────────┘
```

## Data Flow

### 1. User Authentication

```
User Input (email/password)
    ↓
Auth Store → register/login()
    ↓
Supabase Client → supabase.auth.signUp/signIn()
    ↓
Supabase Auth Service
    ↓
Database Trigger → Create Profile
    ↓
Return User + Token
    ↓
Store in Zustand + LocalStorage
```

### 2. Fetch Events

```
User Action (search/filter)
    ↓
Events Store → fetchEvents(filters)
    ↓
Supabase Client → supabase.from('events').select()
    ↓
Apply Filters:
  - search text
  - category
  - date range
  - price range
  - location
    ↓
PostgreSQL Query with Joins
    ↓
Return Event Data + Organizer Info
    ↓
Transform to App Format
    ↓
Update Zustand Store
    ↓
React Components Re-render
```

### 3. Create Event

```
User Input (event form)
    ↓
Events Store → createEvent(data)
    ↓
Check Authentication
    ↓
Supabase Client → supabase.from('events').insert()
    ↓
Database Validates:
  - User is authenticated
  - RLS policies pass
    ↓
Insert Event Record
    ↓
Return New Event
    ↓
Update Local Store
    ↓
Show Success Message
```

### 4. Join Event

```
User Clicks "Join"
    ↓
Events Store → joinEvent(eventId)
    ↓
Supabase Client → insert into event_attendees
    ↓
Database Trigger → Increment current_attendees
    ↓
Fetch Updated Event Count
    ↓
Update Local Store
    ↓
UI Updates Attendee Count
```

## Database Schema Relationships

```
┌──────────────┐
│   profiles   │
│──────────────│
│ id (PK)      │◄─────┐
│ email        │      │
│ name         │      │
│ username     │      │
│ location     │      │
│ badges       │      │
└──────────────┘      │
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────┴──────┐            ┌────────┴─────────┐
│    events    │            │ event_attendees  │
│──────────────│            │──────────────────│
│ id (PK)      │◄───────────│ event_id (FK)    │
│ organizer_id │            │ user_id (FK)     │
│ title        │            │ status           │
│ description  │            │ created_at       │
│ location     │            └──────────────────┘
│ category     │
│ start_date   │
│ price        │
│ attendees    │
│ chat_room_id │──┐
└──────────────┘  │
                  │
          ┌───────┴────────┐
          │   chat_rooms   │
          │────────────────│
          │ id (PK)        │
          │ name           │
          │ type           │
          │ event_id (FK)  │
          └───────┬────────┘
                  │
          ┌───────┴────────┐
          │   messages     │
          │────────────────│
          │ id (PK)        │
          │ room_id (FK)   │
          │ user_id (FK)   │
          │ content        │
          │ created_at     │
          └────────────────┘
```

## Security Model (Row Level Security)

```
┌─────────────────────────────────────────────┐
│            RLS POLICIES                     │
├─────────────────────────────────────────────┤
│                                             │
│  PROFILES:                                  │
│  ✓ Everyone can view                        │
│  ✓ Users can update own profile only        │
│                                             │
│  EVENTS:                                    │
│  ✓ Everyone can view public events          │
│  ✓ Organizers can view own private events   │
│  ✓ Only organizers can update their events  │
│  ✓ Only organizers can delete their events  │
│                                             │
│  EVENT_ATTENDEES:                           │
│  ✓ Everyone can view attendees              │
│  ✓ Users can join events                    │
│  ✓ Users can leave own attendance           │
│                                             │
│  CHAT_ROOMS:                                │
│  ✓ Members can view                         │
│  ✓ Authenticated users can create           │
│                                             │
│  MESSAGES:                                  │
│  ✓ Room members can view                    │
│  ✓ Authenticated users can send             │
│                                             │
└─────────────────────────────────────────────┘
```

## API Layer Structure

```
Frontend (React)
    ↓
Zustand Stores (State Management)
    ├── useAuthStore
    │   ├── login()
    │   ├── register()
    │   ├── logout()
    │   └── checkAuth()
    │
    └── useEventsStore
        ├── fetchEvents(filters)
        ├── createEvent(data)
        ├── updateEvent(id, data)
        ├── deleteEvent(id)
        ├── joinEvent(id)
        └── leaveEvent(id)
    ↓
Supabase Client (@/lib/supabase)
    ├── supabase.auth.*
    ├── supabase.from('table').*
    ├── supabase.rpc('function')
    └── supabase.storage.*
    ↓
Supabase Backend
    ├── Authentication
    ├── PostgreSQL Database
    ├── Storage
    └── Real-time
```

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client config
│
├── types/
│   └── supabase.ts          # Database types
│
└── stores/
    ├── auth-store.ts        # Auth state + Supabase auth
    └── events-store.ts      # Events state + Supabase queries

supabase-schema.sql          # Database schema
.env.local                   # Environment config
```

## Environment Flow

```
Development (.env.local)
    ↓
NEXT_PUBLIC_SUPABASE_URL → Supabase Client
NEXT_PUBLIC_SUPABASE_ANON_KEY → Authentication
    ↓
Your Supabase Project
    ├── Project URL
    ├── Database (PostgreSQL)
    ├── Authentication
    └── Storage
```

## Real-time Features (Ready)

```
Component subscribes
    ↓
supabase.channel('events')
    ↓
Listen for changes:
  - INSERT
  - UPDATE
  - DELETE
    ↓
Automatic UI updates
```

## Type Safety Flow

```
Database Schema (SQL)
    ↓
TypeScript Types (supabase.ts)
    ↓
Store Interfaces
    ↓
Component Props
    ↓
Compile-time Validation ✓
```

This architecture ensures:

- ✅ Type-safe database queries
- ✅ Secure authentication
- ✅ Protected user data
- ✅ Scalable infrastructure
- ✅ Real-time capabilities
- ✅ Easy maintenance
