# 🗺️ EventHive - Interactive Event Discovery & Chat Platform

> **Map-based event discovery meets community chat** - Connecting India through events and conversations

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.2.0-orange.svg)]()
[![Backend](https://img.shields.io/badge/backend-Supabase-00C896.svg)]()
[![Auth](https://img.shields.io/badge/auth-integrated-blue.svg)]()

## 🚀 Vision

EventHive is the first-of-its-kind platform that combines **interactive map-based event discovery** with **real-time community chat**, designed specifically for India. We're building bridges between local communities and creating connections across the nation through immersive event experiences.

### ✨ What makes us unique?

- 🗺️ **Interactive Map Discovery** - Explore events visually on an intuitive map interface with location-based recommendations
- 💬 **Multi-Layered Chat System** - Event-specific chats, city groups, global India conversations with anonymity options
- 🎭 **Complete Event Lifecycle** - From discovery to after-event connections, we keep communities engaged
- 🏛️ **Community-Driven** - Users create, share, and discover events together with verified organizer system
- 🎫 **Integrated Experience** - Seamless ticketing with UPI integration and instant event access
- 🔐 **Production-Ready Backend** - Powered by Supabase with real-time capabilities

---

## 🎯 Core Features

### 📍 Smart Event Discovery & Management

- **Interactive Map Interface** - Click, explore, and discover events in your area with location-based suggestions
- **Advanced Search & Filters** - Find events by category, date, price, distance, and popularity
- **Community Publishing** - Anyone can create and share events with rich media support
- **Verified Organizer System** - Colleges, NGOs, and clubs get verification badges for trusted events
- **Diverse Event Types** - Cultural festivals, educational workshops, social meetups, college events, concerts
- **Smart Location Services** - Auto-adjust to current location with manual override options
- **Integrated Ticketing** - Seamless paid/free event booking with UPI and digital wallet support

### 💭 Community Ecosystem

#### 🎪 Event-Specific Mini Chats

- **Automatic Chat Creation** - Every event gets its own temporary chatroom
- **Pre-Event Coordination** - Attendees connect, plan, and build excitement together
- **Live Event Updates** - Share photos, experiences, and real-time moments
- **Hierarchical Chat System** - Separate channels for organizers/trusted members and public discussion
- **Auto-Archive System** - Chats automatically archive post-event for future reference

#### 🌟 The "After-Event" Hub

- **48-Hour Connection Window** - Private group chats for events with 10+ attendees
- **Photo & Memory Sharing** - Preserve event memories and connections
- **Instant Feedback Loop** - Real-time feedback channel for organizers
- **Friend Discovery** - Convert event connections into lasting friendships
- **User Event History** - Track attended events and past connections

#### 🌍 Global Indian Chat Network

- **State-Wise Communities** - Join and explore different state groups across India
- **Anonymous Mode Available** - Express freely with optional identity protection
- **Cross-Cultural Dialogue** - Connect with people from different regions
- **Dynamic Group Management** - Join/leave state groups based on interests

#### 🏙️ City-Level Chat Groups

- **Hyper-Local Discussions** - Connect with people in your specific city
- **Local Opportunity Sharing** - Discover hidden gems and local events
- **Friendship Building** - Build real connections in your area
- **Gamified Engagement** - Badges, streaks, and community recognition

### 🎫 Enhanced User Experience

#### 🔐 Smart Onboarding

- **Seamless Registration** - Quick login/register with social auth options
- **Location Permissions** - Smart location detection with manual configuration
- **Username Creation** - Personalized identity with availability checker
- **Initial Information Collection** - Tailored experience based on interests

#### 🏆 Gamification & Rewards

- **Coupon System** - Win rewards for organizing successful events (100+ attendees)
- **Achievement Badges** - Recognition for active community participation
- **Usage Benefits** - Exclusive perks for regular users and top organizers
- **Leaderboards** - City and state-wise community rankings

#### 🛡️ Advanced Safety Features

- **One-Click Reporting** - Instant report/block functionality in all chats
- **AI Content Moderation** - Smart keyword filtering and behavior analysis
- **Verified User System** - Trust badges for reliable community members
- **Privacy Controls** - Granular privacy settings and anonymous options

---

## 🎨 User Journey & Interface

### 🏠 Homepage Experience

1. **Interactive Map View** - Users land on a dynamic map showing nearby events
2. **Event Pin Exploration** - Click any pin to view event preview
3. **Event Detail Pop-up** - Rich event information with banner, description, pricing, timing
4. **Instant Ticket Purchase** - UPI integration for seamless transactions
5. **Chat Access** - Join event-specific discussions with one tap

### 📱 Event Interaction Flow

- **Event Discovery** → **Detail View** → **Ticket Purchase** → **Chat Join** → **Event Attendance** → **After-Event Hub**
- **Organizer Tools** - Dedicated dashboard for event management and participant engagement
- **Trust System** - Verified organizers and trusted members get special privileges

---

## 🎨 Product Screenshots

_Coming Soon - UI/UX designs and app screenshots showcasing the enhanced features_

---

## 🛠️ Tech Stack

### Frontend

- **Web**: Next.js 14 with App Router
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand / Redux Toolkit
- **Maps Integration**: Google Maps API with custom markers

### Backend

- **Server**: Node.js + Express.js / Python FastAPI
- **Database**: PostgreSQL (events, users, tickets) + Redis (chat cache)
- **Real-time**: Socket.io with room management
- **Authentication**: JWT + OAuth 2.0 (Google, Facebook)
- **File Storage**: AWS S3 / Cloudinary for media

### Services & APIs

- **Payment Gateway**: Razorpay / Stripe for UPI integration
- **Location Services**: Google Places API + Geolocation
- **Push Notifications**: Firebase Cloud Messaging
- **Email/SMS**: SendGrid + Twilio
- **Cloud Infrastructure**: AWS / Google Cloud Platform
- **CDN**: Cloudflare for global content delivery

### AI & Analytics

- **Content Moderation**: OpenAI API / Custom ML models
- **Event Recommendations**: Collaborative filtering algorithms
- **Analytics**: Google Analytics 4 + Custom event tracking
- **A/B Testing**: PostHog / Amplitude

---

## 🚦 Development Roadmap

### 🎯 Phase 1: MVP (Q1-Q2)

- [ ] Interactive map with event plotting
- [ ] City-level chat rooms
- [ ] Basic event publishing system
- [ ] User authentication & profiles

### 🎯 Phase 2: Community Expansion (Q2-Q3)

- [ ] Global Indian chat rooms
- [ ] Anonymous user options
- [ ] Event ticketing integration
- [ ] Advanced event filtering
- [ ] Push notifications

### 🎯 Phase 3: Advanced Features (Q3-Q4)

- [ ] AI-driven event recommendations
- [ ] Gamification system (badges, streaks)
- [ ] Analytics dashboard

---

## 🎯 Target Audience

| Segment                  | Description                                   | Use Cases                                   |
| ------------------------ | --------------------------------------------- | ------------------------------------------- |
| **Urban Youth**          | College students, young professionals (18-30) | Event discovery, making friends, networking |
| **Community Organizers** | Event creators, local businesses              | Event promotion, community building         |
| **Social Connectors**    | People seeking local/national connections     | Cultural exchange                           |

---

## 🏆 Competitive Advantage

| Feature                       | EventHive | BookMyShow | Meetup | District (Zomato) |
| ----------------------------- | --------- | ---------- | ------ | ----------------- |
| **Map-based Discovery**       | ✅        | ❌         | ❌     | ✅                |
| **Event-Specific Chats**      | ✅        | ❌         | ❌     | ❌                |
| **Verified Organizer System** | ✅        | ❌         | ✅     | ❌                |
| **UPI Ticket Integration**    | ✅        | ✅         | ❌     | ❌                |
| **Community Publishing**      | ✅        | ❌         | ✅     | ❌                |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- **Supabase Account** (free tier works great!)

### Quick Setup (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/eventhive.git
cd eventhive

# 2. Install dependencies
npm install

# 3. Set up Supabase (see BACKEND_QUICKSTART.md)
cp .env.local.example .env.local
# Add your Supabase URL and Key to .env.local

# 4. Run database schema in Supabase SQL Editor
# Copy & paste content from supabase-schema.sql

# 5. Check setup
./check-supabase-setup.sh

# 6. Start development server
npm run dev
```

🎉 Visit `http://localhost:3000` - You're ready!

### 📚 Backend Documentation

- **[BACKEND_QUICKSTART.md](BACKEND_QUICKSTART.md)** - 5 min quick start guide
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Complete setup & features
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - What's integrated

**Check your setup anytime:**

```bash
./check-supabase-setup.sh
```

### ✨ What's Included

Backend (Supabase) features:

- ✅ User authentication & profiles
- ✅ Event CRUD operations
- ✅ Advanced search & filtering
- ✅ Location-based queries
- ✅ Join/leave events tracking
- ✅ Real-time subscriptions
- ✅ File storage ready
- ✅ Row Level Security
- ✅ Auto attendee counting

### Optional: Legacy Environment Variables

If you need additional services:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eventhive
REDIS_URL=redis://localhost:6379

# Authentication & Security
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Maps & Location Services
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_PLACES_API_KEY=your-places-api-key

# Payment Integration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
UPI_MERCHANT_ID=your-upi-merchant-id

# Real-time & Communication
SOCKET_IO_SECRET=your-socket-io-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# AI & Moderation
OPENAI_API_KEY=your-openai-key
CONTENT_MODERATION_THRESHOLD=0.7

# Cloud Services
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=eventhive-media

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID=your-ga-id
SENTRY_DSN=your-sentry-dsn
```

---

## 🤝 Contributing

We welcome contributions from developers, designers, and community enthusiasts! Here's how you can help:

### 🚀 How to Contribute

1. **🍴 Fork the Project**
2. **🔧 Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **📝 Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **🔀 Open a Pull Request**

### 📋 Development Guidelines

- Follow ESLint and Prettier configurations
- Write unit and integration tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Test chat functionality thoroughly
- Validate payment integration in sandbox

### 🎨 Design Contributions

- UI/UX improvements for map interface
- Chat system design enhancements
- Accessibility improvements
- Animation and micro-interaction designs

---

## 📊 Project Stats

- **Lines of Code**: Coming Soon
- **Contributors**: 4 (You could be next! 🚀)
- **Issues**: 1 open
- **Pull Requests**: 0 open

---

## 📋 API Documentation

_Comprehensive API documentation will be available at `/docs` with interactive Swagger interface_

### Core API Endpoints

```bash
# Authentication & User Management
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET /api/users/profile
PUT /api/users/profile
POST /api/users/location

# Event Management
GET /api/events?lat=28.6139&lng=77.2090&radius=10&filters=music,tech
POST /api/events
GET /api/events/:eventId
PUT /api/events/:eventId
DELETE /api/events/:eventId
POST /api/events/:eventId/join

# Ticketing & Payments
POST /api/tickets/purchase
GET /api/tickets/user/:userId
POST /api/payments/razorpay/webhook
GET /api/payments/transaction/:transactionId

# Chat System
GET /api/chat/rooms/event/:eventId
GET /api/chat/rooms/city/:cityId
GET /api/chat/rooms/state/:stateCode
POST /api/chat/rooms/:roomId/messages
GET /api/chat/rooms/:roomId/messages?page=1&limit=50
POST /api/chat/rooms/:roomId/join
DELETE /api/chat/rooms/:roomId/leave

# After-Event Features
POST /api/events/:eventId/after-event-hub
GET /api/events/:eventId/connections
POST /api/users/:userId/add-friend

# Moderation & Safety
POST /api/moderation/report
POST /api/moderation/block-user
GET /api/moderation/user-reports

# Gamification
GET /api/rewards/user/:userId
POST /api/rewards/claim
GET /api/leaderboard/city/:cityId
```

---

## 🌟 Inspiration & References

- **Event Discovery**: Meetup, BookMyShow, Facebook Events
- **Chat Systems**: WhatsApp, Discord, Telegram
- **Map Interaction**: Google Maps, Zomato
- **Community Building**: Reddit, Clubhouse
- **Gaming Elements**: Clash of Clans global chat

---

## 🔒 Privacy & Security

### Data Protection

- **End-to-End Encryption** for private messages
- **GDPR Compliance** for user data handling
- **Two-Factor Authentication** for account security
- **Regular Security Audits** and penetration testing
- **Anonymity Options** for sensitive conversations
- **Data Retention Policies** for chat archives

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Team

- Aditya Bhardwaj
- Yogesh Rana
- Rohit Tripathy
- Nikshay Kataria

---

<!---
## 📞 Connect With Us

- **GitHub**:
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Email**: hello@eventhive.com

---
-->

## 🙏 Acknowledgments

- Thanks to the open-source community
- Inspired by India's diverse cultural landscape
- Built with ❤️ for connecting communities

---

<div align="center">

### 🌟 Star this repo if you like the project!

**Made with ❤️ in India for India🇮🇳**

</div>
