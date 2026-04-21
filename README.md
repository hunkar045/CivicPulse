# 🏛️ CivicPulse — Report. Track. Resolve.

<div align="center">

![CivicPulse Banner](https://img.shields.io/badge/CivicPulse-v1.0.0-00e5a0?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wnZCbPC90ZXh0Pjwvc3ZnPg==)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-00e5a0?style=for-the-badge)](https://musical-parfait-ee9645.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Vercel-000000?style=for-the-badge&logo=vercel)](https://civic-pulse-gilt.vercel.app/api/health)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**A full-stack civic complaint management web app built for citizens to report, track, and resolve local government issues.**

[🌐 Live Demo](https://musical-parfait-ee9645.netlify.app) • [📡 API Health](https://civic-pulse-gilt.vercel.app/api/health) • [🐛 Report Bug](https://github.com/hunkar045/CivicPulse/issues) • [💡 Request Feature](https://github.com/hunkar045/CivicPulse/issues)

</div>

---

## 📸 Screenshots

| Home Page | Complaints Map | Dashboard |
|-----------|---------------|-----------|
| ![Home](https://via.placeholder.com/300x180/0a0c10/00e5a0?text=Hero+Section) | ![Map](https://via.placeholder.com/300x180/0a0c10/00aaff?text=Live+Map) | ![Dashboard](https://via.placeholder.com/300x180/0a0c10/ffd166?text=Dashboard) |

---

## ✨ Features

- 📣 **File Complaints** — Report 19+ civic issues (Water, Roads, Electricity, Sanitation, etc.)
- 📍 **Live GPS Location** — One-click location detection with interactive Leaflet map
- 📎 **Photo/Video Upload** — Attach evidence with drag & drop (up to 5 files)
- 🔢 **Unique Complaint ID** — Auto-generated tracking ID (e.g. `CP-2026-84291`)
- 🔍 **Real-time Tracking** — Live timeline showing complaint status & department updates
- 🗺️ **Live City Map** — Real-time map showing all complaints with status-colored pins
- 📊 **City Dashboard** — Analytics, category breakdown, response time stats
- 🏆 **Leaderboard** — Top active citizens with points system
- 🔐 **JWT Authentication** — Secure register/login with encrypted passwords
- 👤 **Anonymous Mode** — Option to hide identity from public view
- ⭐ **Rate Resolution** — Citizens can rate government response quality
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- ⚡ **TechXCode Branding** — Built with pride by Team TechXCode

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5, CSS3, JavaScript | Core frontend |
| Vite | Build tool & dev server |
| Leaflet.js | Interactive maps |
| Google Fonts (Syne + DM Sans) | Typography |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File uploads |
| CORS | Cross-origin requests |

### Deployment
| Service | Purpose |
|---------|---------|
| Netlify | Frontend hosting (free) |
| Vercel | Backend hosting (free, never sleeps) |
| MongoDB Atlas | Database (free M0 tier) |

---

## 📁 Project Structure

```
CivicPulse/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication guard
│   ├── models/
│   │   ├── Complaint.js          # Complaint schema with auto-ID
│   │   └── User.js               # User schema with bcrypt hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/* endpoints
│   │   └── complaintRoutes.js    # /api/complaints/* endpoints
│   ├── uploads/                  # Photo/video storage
│   ├── .env                      # Environment variables (never commit!)
│   ├── package.json
│   ├── vercel.json               # Vercel deployment config
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── index.html                # Main HTML - full CivicPulse UI
│   ├── style.css                 # Dark futuristic theme
│   ├── script.js                 # All frontend logic & API calls
│   ├── vite.config.js            # Vite config with API proxy
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas account (free)

### 1. Clone the repository
```bash
git clone https://github.com/hunkar045/CivicPulse.git
cd CivicPulse
```

### 2. Setup MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Sign up free
2. Create a cluster (M0 free tier)
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Copy your connection string

### 3. Configure Backend
```bash
cd backend
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/civicpulse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Install & Run Backend
```bash
cd backend
npm install
npm run dev
```
✅ You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

### 5. Install & Run Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
✅ Open `http://localhost:3000` in browser

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| GET | `/api/auth/leaderboard` | Top 10 citizens | No |

### Complaints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/complaints` | File a complaint | Yes |
| GET | `/api/complaints` | Get all complaints | No |
| GET | `/api/complaints/stats` | City statistics | No |
| GET | `/api/complaints/map` | Map pins data | No |
| GET | `/api/complaints/track/:id` | Track by complaint ID | No |
| GET | `/api/complaints/mine` | My complaints | Yes |
| POST | `/api/complaints/:id/upvote` | Upvote complaint | Yes |
| POST | `/api/complaints/:id/rate` | Rate resolution | Yes |
| PATCH | `/api/complaints/:id/status` | Update status | Officer/Admin |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 🌐 Deployment

### Deploy Frontend (Netlify)
```bash
cd frontend
npm run build
# Drag 'dist' folder to app.netlify.com/drop
```

### Deploy Backend (Vercel)
```bash
# Push to GitHub — Vercel auto-deploys on every push
git push origin main
```

### Environment Variables on Vercel
Add these in Vercel dashboard → Project → Settings → Environment Variables:
```
MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_jwt_secret
NODE_ENV = production
```

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcrypt** (salt rounds: 12)
- ✅ **JWT tokens** with 7-day expiry
- ✅ **CORS** configured for cross-origin requests
- ✅ **File type validation** on uploads
- ✅ **File size limit** (10MB per file)
- ✅ **Role-based access** (citizen / officer / admin)
- ✅ **Anonymous complaints** option

---

## 🗺️ Complaint Categories

| Category | Category | Category |
|----------|----------|----------|
| 💧 Water Supply | 🛣️ Roads & Potholes | ⚡ Electricity |
| 🗑️ Garbage & Sanitation | 🚰 Sewage & Drainage | 💡 Street Lighting |
| 🚌 Public Transport | 🌳 Parks & Recreation | 📢 Noise Pollution |
| 😮‍💨 Air Pollution | 🏗️ Building Violations | 🚦 Traffic Signal |
| 🏥 Healthcare | 🐕 Stray Animals | 🏛️ Encroachment |
| ⚠️ Corruption | 🌿 Trees & Greenery | 🏠 Public Property |
| 🔧 Other | | |

---

## 👥 Team TechXCode

<div align="center">

| Member | Role |
|--------|------|
| **Hunkar Chaware** | Full Stack Developer |
| **Team TechXCode** | Design & Development |

⚡ *Building the future, one line at a time.*

</div>

---

## 📊 Points System

| Action | Points Earned |
|--------|--------------|
| File a complaint | +10 points |
| Complaint resolved | +20 points |
| Rate a resolution | +5 points |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Leaflet.js](https://leafletjs.com/) — Interactive maps
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Netlify](https://netlify.com) — Frontend hosting
- [Vercel](https://vercel.com) — Backend hosting
- [CartoDB](https://carto.com) — Dark map tiles

---

<div align="center">

**Made with ❤️ by Team TechXCode**

⭐ Star this repo if you found it helpful!

[![GitHub stars](https://img.shields.io/github/stars/hunkar045/CivicPulse?style=social)](https://github.com/hunkar045/CivicPulse/stargazers)

</div>
