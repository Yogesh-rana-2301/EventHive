# EventHive API Integration Guide

## 🔧 Required API Credentials & Configuration

### 1. Environment Variables (.env.local)

Create a `.env.local` file in the root directory with the following variables:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# FastAPI Backend
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=your-api-secret-key

# Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your-key-here
RAZORPAY_KEY_SECRET=your-razorpay-secret-here

# Maps & Location Services
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Socket.io & Real-time
SOCKET_IO_URL=http://localhost:3001
SOCKET_IO_SECRET=your-socket-secret

# Email Services (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloud Storage (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics & Monitoring (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn
```

---

## 🏗️ Backend API Integration Points

### 1. Authentication API (`/src/lib/auth-api.ts`)

```typescript
// Location: src/lib/auth-api.ts
// Purpose: Handle user authentication, registration, profile management
// Endpoints:
// - POST /auth/login
// - POST /auth/register
// - GET /auth/profile
// - PUT /auth/profile
// - POST /auth/logout
```

### 2. Events API (`/src/lib/events-api.ts`)

```typescript
// Location: src/lib/events-api.ts
// Purpose: Event CRUD operations, search, filtering
// Endpoints:
// - GET /events
// - POST /events
// - GET /events/:id
// - PUT /events/:id
// - DELETE /events/:id
// - POST /events/:id/join
// - GET /events/search
```

### 3. Chat API (`/src/lib/chat-api.ts`)

```typescript
// Location: src/lib/chat-api.ts
// Purpose: Real-time messaging, room management
// Socket Events:
// - join_room
// - leave_room
// - send_message
// - receive_message
// - user_typing
// - room_created
```

### 4. Gamification API (`/src/lib/gamification-api.ts`)

```typescript
// Location: src/lib/gamification-api.ts
// Purpose: Points, badges, achievements, leaderboards
// Endpoints:
// - GET /gamification/stats
// - POST /gamification/award-points
// - GET /gamification/badges
// - POST /gamification/unlock-badge
// - GET /gamification/leaderboard
```

### 5. Payment API (`/src/lib/payment-api.ts`)

```typescript
// Location: src/lib/payment-api.ts
// Purpose: Razorpay integration, ticket purchases
// Endpoints:
// - POST /payments/create-order
// - POST /payments/verify
// - GET /payments/history
// - POST /payments/refund
```

---

## 📡 API Service Implementation Locations

### Replace Dummy Data in These Files:

1. **Events Store** (`/src/stores/events-store.ts`)
   - Replace `dummyEvents` with API calls
   - Update `fetchEvents()` function
   - Add real event creation/update logic

2. **Chat Store** (`/src/stores/chat-store.ts`)
   - Replace dummy socket connection
   - Implement real Socket.io client
   - Add message persistence

3. **Auth Store** (`/src/stores/auth-store.ts`)
   - Replace localStorage auth with JWT tokens
   - Add proper session management
   - Implement secure logout

4. **Gamification Store** (`/src/stores/gamification-store.ts`)
   - Sync points/badges with backend
   - Real-time achievement unlocking
   - Leaderboard data fetching

---

## 🔑 How to Obtain API Credentials

### 1. Supabase Setup

1. Visit [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy Project URL and anon key
5. Create tables: users, events, messages, gamification_stats

### 2. Razorpay Setup

1. Visit [razorpay.com](https://razorpay.com)
2. Create merchant account
3. Go to Account & Settings > API Keys
4. Generate Test/Live keys
5. Configure webhooks for payment verification

### 3. Mapbox Setup (Optional Enhancement)

1. Visit [mapbox.com](https://mapbox.com)
2. Create account and project
3. Go to Account > Access tokens
4. Create new token with appropriate scopes

### 4. Google Maps Setup (Optional)

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API & Places API
3. Create API key with restrictions
4. Configure billing (required for production)

---

## 🚀 FastAPI Backend Structure

Your FastAPI backend should have these main modules:

```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── auth/                # Authentication endpoints
│   ├── events/              # Event management endpoints
│   ├── chat/                # Chat & Socket.io handlers
│   ├── gamification/        # Points, badges, achievements
│   ├── payments/            # Razorpay integration
│   ├── database/            # Database models & connections
│   └── utils/               # Helper functions
├── requirements.txt         # Python dependencies
└── .env                     # Backend environment variables
```

### Key FastAPI Dependencies:

```bash
pip install fastapi uvicorn
pip install supabase
pip install python-socketio
pip install razorpay
pip install pydantic
pip install python-jose[cryptography]
pip install passlib[bcrypt]
```

---

## 📋 Implementation Priority Order

1. **Database Setup** (Supabase)
   - Create user tables
   - Set up authentication
   - Design event schema

2. **Authentication API**
   - Implement JWT tokens
   - User registration/login
   - Profile management

3. **Events API**
   - Replace dummy data
   - Add real CRUD operations
   - Implement search/filtering

4. **Payment Integration**
   - Razorpay order creation
   - Payment verification
   - Ticket generation

5. **Real-time Chat**
   - Socket.io server setup
   - Message persistence
   - Room management

6. **Gamification Sync**
   - Points calculation API
   - Badge unlock system
   - Leaderboard generation

---

## ⚠️ Security Considerations

- Store sensitive keys in environment variables
- Use HTTPS in production
- Implement rate limiting
- Validate all API inputs
- Use CORS properly
- Implement proper JWT expiration
- Hash passwords securely
- Validate payment webhooks

---

## 🔧 Development vs Production

**Development:**

- Use test API keys
- localhost URLs
- Debug logging enabled
- CORS allowing all origins

**Production:**

- Live API credentials
- Production domain URLs
- Error logging only
- Restricted CORS origins
- SSL certificates
- CDN for static assets
