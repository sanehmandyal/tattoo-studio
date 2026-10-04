# INK CARVERS — Premium Interactive Tattoo Studio Website

A full-stack, production-grade MERN web application built for **INK CARVERS Tattoo Studio**, inspired by high-end luxury atelier aesthetics with rich 3D anatomical design exploration, real-time double-booking prevention, dynamic artist directory, curated portfolio archive, and an integrated administrative portal.

---

## ⚡ Key Highlights & Core Features

### 1. **Cinematic Hero & Interactive 3D Tattoo Placement Studio**
- **3D Anatomical Mannequin**: Rotatable front/back body model with interactive glowing anatomical hotspots (Forearm, Shoulder, Chest, Back, Wrist, Ribs, Thigh, Calf, Ankle).
- **Floating Idea Explorer**: Live dynamic tattoo suggestions (Geometric Lion, Traditional Rose, Script Quote, Mandala, Japanese Dragon, etc.).
- **Dynamic Tattoo Projection**: Instant decal preview on the body model with scale and opacity calibration.
- **Direct Booking Integration**: One-click transition from 3D design to pre-filled appointment scheduling.

### 2. **Numbered Sections Matching the Luxury Reference UI**
1. **Hero & 3D Lab**: "YOUR VISION, OUR INK."
2. **About Us**: Studio heritage, hospital-grade cleanroom standards, and atelier architecture.
3. **Meet Our Artists**: Dynamic directory featuring resident masters (**ELIZA**, **LIAM**, **MARK**, **SOPHIA**).
4. **Curated Portfolio**: High-resolution gallery organized by style (*Sleeve, Realism, Blackwork, Watercolor, Geometric, Fine Line*).
5. **Appointment Booking**: Real-time calendar with slot conflict detection and automated booking reference generation (`INK-2026-XXXX`).
6. **Aftercare Guidelines**: 30-day dermal healing stages, clinical do's and don'ts, and expandable FAQs.
7. **Ink Well Blog**: Deep dives into tattoo psychology, sacred geometry, and session preparation.
8. **Contact & Location**: Stylized dark map locator, studio hours, and interactive consultation form.

### 3. **Integrated Security & Admin Portal (`/admin`)**
- **Executive Dashboard**: Live KPIs, booking status breakdown charts, and quick-approval triggers.
- **Appointment Queue**: Filter, reschedule, assign artists, reject, or mark sessions complete.
- **Artist Management**: Full CRUD, working hours, and portfolio linking.
- **Portfolio Manager**: Multi-image uploads, body placement tags, and style filters.
- **3D Design Lab Manager**: Add new 3D designs, difficulty tiers, and estimated price ranges.
- **Blog Studio**: Rich article editor with markdown support.
- **Studio Calendar**: Visual monthly schedule with artist holiday date blocking.
- **Site Settings**: Live modification of hero headlines, phone, address, and business hours.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Three.js, Lucide Icons, React Router v7, Sonner, React Helmet Async |
| **Backend** | Node.js, Express.js, MongoDB / Mongoose, In-Memory Mongo Fallback, JWT Auth, BcryptJS, Multer, Nodemailer |
| **Design System** | Luxury Charcoal (`#101415`), Warm Wood Header (`#2b1d14`), Bronze Accent (`#A7835D`), Cyan Glow (`#00E5FF`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18
- **NPM** >= 9

### 2. Quick Launch

#### **Backend**
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` and automatically connects to MongoDB (or launches an in-memory Mongo server with pre-seeded master studio data).*

#### **Frontend**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🛡️ Default Demo Accounts

| Role | Email | Password | Access |
|---|---|---|---|
| **Studio Admin** | `admin@inkcarvers.com` | `admin123` | Full `/admin` Portal & Settings |
| **Client** | `alex.cross@example.com` | `customer123` | Booking history & favorites |

---

## 📡 REST API Documentation

- `POST /api/auth/login` — Sign in (JWT token)
- `POST /api/auth/register` — Register customer
- `GET /api/artists` — Fetch master artists
- `GET /api/portfolio` — Fetch filterable portfolio archive
- `GET /api/designs` — Fetch 3D tattoo designs
- `POST /api/bookings` — Create appointment with conflict check
- `GET /api/availability/slots` — Get artist available slots for a date
- `GET /api/blogs` — Get published studio articles
- `POST /api/contact` — Submit consultation inquiry
- `GET /api/settings/public` — Fetch studio branding settings
