# 🏛️ CivicPulse — Report. Track. Resolve.

<div align="center">

[![CivicPulse](https://img.shields.io/badge/CivicPulse-v1.0.0-00e5a0?style=for-the-badge)](https://fantastic-pavlova-3e9a83.netlify.app)
[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Site-00e5a0?style=for-the-badge)](https://fantastic-pavlova-3e9a83.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Vercel-000000?style=for-the-badge&logo=vercel)](https://civic-pulse-gilt.vercel.app/api/health)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made by](https://img.shields.io/badge/Made%20by-TechXCode-ff6b6b?style=for-the-badge)](https://github.com/hunkar045)

**A full-stack civic complaint management web app built for citizens to report, track, and resolve local government issues in real-time.**

[🌐 Live Demo](https://fantastic-pavlova-3e9a83.netlify.app) &nbsp;•&nbsp; [📡 API Health](https://civic-pulse-gilt.vercel.app/api/health) &nbsp;•&nbsp; [🐛 Report Bug](https://github.com/hunkar045/CivicPulse/issues) &nbsp;•&nbsp; [💡 Request Feature](https://github.com/hunkar045/CivicPulse/issues)

</div>

---

## 📸 Screenshots

> 📱 **How to add screenshots:** Take screenshots of your live site → Upload to `screenshots/` folder in this repo → They will appear here automatically!

| 🏠 Home Page | 🗺️ Live Map | 📊 Dashboard |
|:---:|:---:|:---:|
| ![Home](screenshots/home.png) | ![Map](screenshots/map.png) | ![Dashboard](screenshots/dashboard.png) |

| 📣 File Complaint | 🔍 Track Complaint | 🔐 Login |
|:---:|:---:|:---:|
| ![File](screenshots/complaint.png) | ![Track](screenshots/track.png) | ![Login](screenshots/login.png) |

### 📱 How to Upload Screenshots from Mobile:
1. Open [fantastic-pavlova-3e9a83.netlify.app](https://fantastic-pavlova-3e9a83.netlify.app) on phone
2. Take screenshots of each page
3. Go to [github.com/hunkar045/CivicPulse](https://github.com/hunkar045/CivicPulse)
4. Click **"Add file"** → **"Upload files"**
5. Type `screenshots/home.png` as the path
6. Upload your screenshots one by one
7. Click **"Commit changes"** ✅

---

## 🌐 Live Links

| Service | URL | Status |
|---------|-----|--------|
| 🌐 **Frontend** | https://fantastic-pavlova-3e9a83.netlify.app | ![Live](https://img.shields.io/badge/status-live-00e5a0) |
| 📡 **Backend API** | https://civic-pulse-gilt.vercel.app | ![Live](https://img.shields.io/badge/status-live-00e5a0) |
| ❤️ **Health Check** | https://civic-pulse-gilt.vercel.app/api/health | ![Live](https://img.shields.io/badge/status-live-00e5a0) |
| 💾 **GitHub** | https://github.com/hunkar045/CivicPulse | - |

---

## ✨ Features

- 📣 **File Complaints** — Report 19+ civic issues (Water, Roads, Electricity, Sanitation & more)
- 📍 **Live GPS Location** — One-click location detection with interactive Leaflet map
- 📎 **Photo/Video Upload** — Attach evidence with drag & drop (up to 5 files, 10MB each)
- 🔢 **Unique Complaint ID** — Auto-generated tracking ID (e.g. `CP-2026-84291`)
- 🔍 **Real-time Tracking** — Live timeline showing complaint status & department updates
- 🗺️ **Live City Map** — Real-time map with status-colored complaint pins
- 📊 **City Dashboard** — Analytics, category breakdown, response time stats
- 🏆 **Leaderboard** — Top active citizens with points & rewards system
- 🔐 **JWT Authentication** — Secure register/login with bcrypt encrypted passwords
- 👤 **Anonymous Mode** — Option to hide identity from public view
- ⭐ **Rate Resolution** — Citizens can rate government response (1-5 stars)
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark Mode UI** — Beautiful dark futuristic design
- ⚡ **Built by TechXCode** — Nagpur's finest dev team

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5, CSS3, Vanilla JavaScript | Core frontend |
| Vite v5 | Build tool & dev server |
| Leaflet.js | Interactive maps |
| Google Fonts (Syne + DM Sans) | Typography |
| CartoDB Dark Tiles | Dark map theme |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js v22 | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing (12 rounds) |
| Multer | File uploads |
| CORS | Cross-origin requests |

### Deployment
| Service | Purpose | Cost |
|---------|---------|------|
| Netlify | Frontend hosting | Free forever |
| Vercel | Backend (never sleeps) | Free forever |
| MongoDB Atlas M0 | Cloud database | Free forever |
| UptimeRobot | Server monitoring | Free forever |

---

## 📁 Project Structure

```
CivicPulse/
├── 📁 backend/
│   ├── 📁 middleware/
│   │   └── authMiddleware.js     # JWT authentication guard
│   ├── 📁 models/
│   │   ├── Complaint.js          # Complaint schema with auto-ID & timeline
│   │   └── User.js               # User schema with bcrypt & points
│   ├── 📁 routes/
│   │   ├── authRoutes.js         # /api/auth/* endpoints
│   │   └── complaintRoutes.js    # /api/complaints/* endpoints
│   ├── 📁 uploads/               # Photo/video storage
│   ├── .env                      # 🔒 Secrets (never commit this!)
│   ├── package.json
│   ├── vercel.json               # Vercel config
│   └── server.js                 # Express entry point
│
├── 📁 frontend/
│   ├── index.html                # Full CivicPulse UI
│   ├── style.css                 # Dark futuristic theme
│   ├── script.js                 # Frontend logic & API calls
│   ├── vite.config.js            # Vite + proxy config
│   └── package.json
│
├── 📁 screenshots/               # 📸 Add your screenshots here!
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Local Setup (Laptop/PC)

### Prerequisites
- [Node.js v18+](https://nodejs.org)
- [Git](https://git-scm.com)
- [MongoDB Atlas](https://mongodb.com/atlas) account (free)

### Step 1 — Clone
```bash
git clone https://github.com/hunkar045/CivicPulse.git
cd CivicPulse
```

### Step 2 — Configure `.env`
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/civicpulse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Step 3 — Run Backend
```bash
cd backend
npm install
npm run dev
# ✅ MongoDB connected
# 🚀 Server on http://localhost:5000
```

### Step 4 — Run Frontend
```bash
cd frontend
npm install
npm run dev
# ✅ Open http://localhost:3000
```

---

## 📱 Mobile Setup (No Laptop Needed!)

### Option A — Just use the live site!
Open on phone: **https://fantastic-pavlova-3e9a83.netlify.app** ✅

### Option B — Run locally on Android with Termux

**Step 1 — Download Termux** from F-Droid:
```
https://f-droid.org/packages/com.termux/
```

**Step 2 — Install Node.js:**
```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
```

**Step 3 — Clone & run:**
```bash
git clone https://github.com/hunkar045/CivicPulse.git
cd CivicPulse/backend
npm install
node server.js
```

**Step 4 — New Termux session (swipe left → New Session):**
```bash
cd CivicPulse/frontend
npm install
npm run dev
```

**Step 5 — Open Chrome:** `http://localhost:3000` 🎉

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new citizen | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |
| `GET` | `/api/auth/profile` | My profile | ✅ JWT |
| `GET` | `/api/auth/leaderboard` | Top 10 citizens | ❌ |

### Complaint Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/complaints` | File complaint | ✅ JWT |
| `GET` | `/api/complaints` | All complaints | ❌ |
| `GET` | `/api/complaints/stats` | City stats | ❌ |
| `GET` | `/api/complaints/map` | Map pins | ❌ |
| `GET` | `/api/complaints/track/:id` | Track by ID | ❌ |
| `GET` | `/api/complaints/mine` | My complaints | ✅ JWT |
| `POST` | `/api/complaints/:id/upvote` | Upvote | ✅ JWT |
| `POST` | `/api/complaints/:id/rate` | Rate 1-5 ⭐ | ✅ JWT |
| `PATCH` | `/api/complaints/:id/status` | Update status | 🔰 Officer |
| `GET` | `/api/health` | Health check | ❌ |

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcrypt** (12 salt rounds)
- ✅ **JWT tokens** with 7-day expiry
- ✅ **CORS** configured for cross-origin
- ✅ **File type validation** (images & videos only)
- ✅ **10MB file size limit**, max 5 files
- ✅ **Role-based access** (citizen / officer / admin)
- ✅ **Anonymous complaints** option
- ✅ All secrets in **environment variables**

---

## 🗺️ Complaint Categories

| | | |
|--|--|--|
| 💧 Water Supply | 🛣️ Roads & Potholes | ⚡ Electricity |
| 🗑️ Garbage & Sanitation | 🚰 Sewage & Drainage | 💡 Street Lighting |
| 🚌 Public Transport | 🌳 Parks & Recreation | 📢 Noise Pollution |
| 😮‍💨 Air Pollution | 🏗️ Building Violations | 🚦 Traffic Signal |
| 🏥 Healthcare | 🐕 Stray Animals | 🏛️ Encroachment |
| ⚠️ Corruption | 🌿 Trees & Greenery | 🏠 Public Property |
| 🔧 Other | | |

---

## 📊 Points System

| Action | Points |
|--------|--------|
| 📣 File a complaint | +10 pts |
| ✅ Complaint resolved | +20 pts |
| ⭐ Rate a resolution | +5 pts |
| 🏆 Top 10 leaderboard | 🎖️ Badge |

---

## 👥 Team TechXCode

<div align="center">

| 👤 Member | 💼 Role |
|--------|------|
| **Hunkar Chaware** | Full Stack Developer & Team Lead |
| **Team TechXCode** | UI/UX Design & Development |

⚡ *Building the future, one line at a time.*

🏫 Yeshwantrao Chavan College of Engineering, Nagpur

</div>

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Leaflet.js](https://leafletjs.com/) — Interactive maps
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Netlify](https://netlify.com) — Frontend hosting
- [Vercel](https://vercel.com) — Backend hosting
- [CartoDB](https://carto.com) — Dark map tiles
- [UptimeRobot](https://uptimerobot.com) — Server monitoring

---

<div align="center">

**Made with ❤️ by Team TechXCode — Nagpur**

⭐ **Star this repo** if you found it helpful!

[![GitHub stars](https://img.shields.io/github/stars/hunkar045/CivicPulse?style=social)](https://github.com/hunkar045/CivicPulse/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/hunkar045/CivicPulse?style=social)](https://github.com/hunkar045/CivicPulse/network/members)

🌐 **https://fantastic-pavlova-3e9a83.netlify.app**

</div>
