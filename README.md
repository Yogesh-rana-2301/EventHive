# 🗺️ EventHive - Interactive Event Discovery & Chat Platform 

> **Map-based event discovery meets community chat** - Connecting India through events and conversations

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-0.1.0-orange.svg)]()

## 🚀 Vision

EventHive is the first-of-its-kind platform that combines **interactive map-based event discovery** with **real-time community chat**, designed specifically for India. We're building bridges between local communities and creating connections across the nation.

### ✨ What makes us unique?

- 🗺️ **Interactive Map Discovery** - Explore events visually on an intuitive map interface
- 💬 **Dual Chat System** - Connect locally with your city and globally across India  
- 🎭 **Anonymous Options** - Express freely while building genuine connections
- 🏛️ **Community-Driven** - Users create, share, and discover events together
- 🌏 **Multi-Language Support** - Chat in English or your preferred regional language

---

## 🎯 Core Features

### 📍 Event Discovery & Management
- **Interactive Map Interface** - Click, explore, and discover events in your area
- **Community Publishing** - Anyone can create and share events
- **Diverse Event Types** - Cultural festivals, educational workshops, social meetups, college events
- **Smart Notifications** - Never miss events you care about
- **Integrated Ticketing** - Seamless paid/free event booking

### 💭 Community Chat System

#### 🌍 Global Indian Chat
- Connect with people from different states across India
- Cross-cultural dialogue and networking opportunities  
- Multi-language support (English + Regional languages)
- Optional anonymity for open conversations

#### 🏙️ City-Level Chat Groups  
- Hyper-local discussions with people in your city
- Share local opportunities and events
- Build real friendships in your area
- Gamified engagement with badges and streaks

---

## 🎨 Product Screenshots

*Coming Soon - UI/UX designs and app screenshots will be added here*

---

## 🛠️ Tech Stack

### Frontend
- **Web**: React.js / Next.js
- **Mobile**: React Native
- **Styling**: Tailwind CSS / Styled Components

### Backend  
- **Server**: Node.js + Express / Python Django
- **Database**: PostgreSQL (events, users) + MongoDB (chat history)
- **Real-time**: Socket.io / WebSocket
- **Authentication**: JWT + OAuth

### Services & APIs
- **Maps**: Google Maps API / Mapbox
- **Cloud**: AWS / Google Cloud
- **CDN**: Cloudflare
- **Monitoring**: Sentry + Analytics

### Future Tech
- **AI/ML**: Content moderation, event recommendations
- **AR**: Event navigation and discovery
- **Push Notifications**: Firebase Cloud Messaging

---

## 🚦 Development Roadmap

### 🎯 Phase 1: MVP (Q1-Q2)
- [ ] Interactive map with event plotting
- [ ] City-level chat rooms
- [ ] Basic event publishing system
- [ ] User authentication & profiles
- [ ] Mobile-responsive web app

### 🎯 Phase 2: Community Expansion (Q2-Q3)
- [ ] Global Indian chat rooms
- [ ] Anonymous user options  
- [ ] Event ticketing integration
- [ ] Advanced event filtering
- [ ] Push notifications

### 🎯 Phase 3: Advanced Features (Q3-Q4)
- [ ] AI-driven event recommendations
- [ ] Gamification system (badges, streaks)
- [ ] AR event navigation
- [ ] Multi-language chat translation
- [ ] Analytics dashboard

---

## 🎯 Target Audience

| Segment | Description | Use Cases |
|---------|-------------|-----------|
| **Urban Youth** | College students, young professionals (18-30) | Event discovery, making friends, networking |
| **Community Organizers** | Event creators, local businesses | Event promotion, community building |
| **Social Connectors** | People seeking local/national connections | Cultural exchange, language practice |

---

## 🏆 Competitive Advantage

| Feature | EventHive | BookMyShow | Meetup | WhatsApp Groups |
|---------|-----------|------------|--------|----------------|
| Map-based Discovery | ✅ | ❌ | ❌ | ❌ |
| Local + Global Chat | ✅ | ❌ | ❌ | ❌ |
| Anonymous Options | ✅ | ❌ | ❌ | ❌ |
| Community Publishing | ✅ | ❌ | ✅ | ❌ |
| Multi-language Support | ✅ | ❌ | ❌ | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm/yarn
- PostgreSQL 13+
- MongoDB 4+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/eventhive.git
cd eventhive

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/eventhive
MONGODB_URI=mongodb://localhost:27017/eventhive

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# Maps
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Real-time
SOCKET_IO_SECRET=your-socket-secret
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **🍴 Fork the Project**
2. **🔧 Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **📝 Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **🔀 Open a Pull Request**

### Development Guidelines
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commit messages

---

## 📊 Project Stats

- **Lines of Code**: Coming Soon
- **Contributors**: 1 (You could be next! 🚀)
- **Issues**: 0 open
- **Pull Requests**: 0 open

---

## 📋 API Documentation

*Detailed API documentation will be available at `/docs` once the backend is implemented*

### Sample Endpoints

```bash
# Events
GET /api/events?lat=28.6139&lng=77.2090&radius=10
POST /api/events

# Chat  
GET /api/chat/rooms/city/:cityId
POST /api/chat/rooms/:roomId/messages

# Users
POST /api/auth/login
GET /api/users/profile
```

---

## 🌟 Inspiration & References

- **Event Discovery**: Meetup, BookMyShow, Facebook Events
- **Chat Systems**: WhatsApp, Discord, Telegram  
- **Map Interaction**: Google Maps, Zomato
- **Community Building**: Reddit, Clubhouse
- **Gaming Elements**: Clash of Clans global chat

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

