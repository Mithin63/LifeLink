# BloodConnect – Full-Stack Blood Donor & Emergency Request Management System

> **"Connecting Donors. Saving Lives."**

BloodConnect is a state-of-the-art, responsive full-stack blood donation and emergency blood-request management web application built with **React**, **JavaScript (ES Modules / JSX)**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, and **SQLite / Relational Database**.

---

## 🌟 Key Features

### 1. User Registration & Authentication (Role-Based)
* **Roles Supported**:
  * 🔴 **Blood Donor**: Manage donation availability, medical history, location & certificates.
  * 🔵 **Patient / Attendant**: Create emergency requests, view live tracking timeline & matched donors.
  * 🏥 **Hospital**: Manage emergency ward blood requests and track cold-storage inventory levels.
  * 🏦 **Blood Bank**: Regional blood unit storage tracking.
  * 🛡️ **System Administrator**: Platform-wide statistics, donor verification, user & request moderation.
* **Security**: JWT authentication, bcrypt password hashing, protected routes, and sanitization.
* **1-Click Demo Logins**: Instant testing buttons on the login page for all roles.

### 2. Donor Management & GPS Proximity Search
* **Interactive Donor Directory**: Filter by blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), city, availability, and verification status.
* **"Use My Current Location"**: Real-time browser GPS geolocation calculation using the **Haversine formula** to measure exact distances in kilometers.
* **Donor Profile & Live Availability Switch**: Donors can toggle their status between `Available` and `Not Available` with instant database synchronization.
* **Digital Certificates**: Donors earn verified certificates with downloadable certificate IDs for completed donations.

### 3. Emergency Blood Request System
* **Emergency Prioritization**: Distinct priority badges (`Normal`, `Urgent`, `Emergency`).
* **Auto-generated Unique Tracking IDs**: e.g., `BR-2026-0001`.
* **Automated Smart Matching**: Instantly triggers candidate donor search and notifications upon submission.

### 4. Smart Donor Matching Algorithm
Calculates a multi-factor compatibility score (out of 100):
$$\text{Score} = \text{Blood Compatibility (up to 40)} + \text{Live Availability (25)} + \text{Proximity Distance (up to 20)} + \text{90-Day Eligibility (15)} + \text{Verified Status (5)}$$

* **Compatibility Matrix**:
  * `O-`: Universal Red Cell Donor (can donate to all groups)
  * `AB+`: Universal Recipient (can receive from all groups)
  * Rh-factor and ABO group matching rules applied strictly.
* **Medical Disclaimer**: System clearly indicates that smart matching assists in finding potential donors while final clinical cross-matching is performed by hospital staff.

### 5. Blood Request Tracking & Visual Progress Tracker
Visual 6-stage lifecycle progress tracker matching the UI mockup:
$$\text{Request Created} \longrightarrow \text{Donors Being Matched} \longrightarrow \text{Donor Contacted} \longrightarrow \text{Donor Confirmed} \longrightarrow \text{Blood Arranged} \longrightarrow \text{Completed}$$

### 6. Executive Admin Dashboard & Recharts Analytics
* **Summary KPI Cards**: Total Donors, Active Requests, Emergency Requests, Completed Requests, Registered Hospitals, Blood Banks, and Lives Saved.
* **Recharts Visualizations**:
  * Blood Group Distribution Donut Chart with center metrics.
  * Monthly Blood Requisitions vs. Fulfilled Units Bar Chart.
  * Emergency vs. Normal Priority Breakdown.
* **Management Portals**: Manage Users, Verify Donors, Moderate Requests, Partner Hospitals, and Export Reports.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript (JSX), Vite, Tailwind CSS, React Router v7, Lucide React icons, Recharts |
| **Backend** | Node.js (ES Modules), Express.js, SQLite / SQL |
| **Database** | PostgreSQL schema (`schema.sql`, `seeds.sql`) with zero-config relational SQLite engine fallback (`data/bloodconnect.db`) |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs password encryption, role-based authorization middleware |

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js**: v18 or higher (v20+ recommended)
* **npm**: v9 or higher

### 1. Clone & Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment
A `.env.example` file is provided in the root and in `server/`.
```bash
cp .env.example server/.env
```

### 3. Seed the Database
Populates the database with realistic donors across all blood groups, partner hospitals, demo requests, and notifications:
```bash
npm run seed
```

### 4. Run the Full-Stack Application
```bash
npm run dev
```
* **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
* **Backend API Server**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@bloodconnect.org` | `admin123` | System Administrator (Full Dashboard & Stats) |
| **Donor** | `donor@bloodconnect.org` | `donor123` | Rahul Kumar (Blood Group: `O+`, Verified) |
| **Patient** | `patient@bloodconnect.org` | `patient123` | Mithin Patient (Emergency Requisitions) |
| **Hospital** | `hospital@bloodconnect.org` | `hospital123` | City Care Hospital Admin |
| **Blood Bank** | `bank@bloodconnect.org` | `password123` | Red Cross Society Blood Bank |

*(You can also use the 1-click quick login buttons directly on the Login page).*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new user (Donor / Patient / Hospital / Blood Bank)
* `POST /api/auth/login` — Login with email/phone & password
* `POST /api/auth/logout` — Logout user session
* `GET /api/auth/me` — Get current authenticated user profile

### Donors (`/api/donors`)
* `GET /api/donors` — List donors with query filters (`blood_group`, `city`, `available`, `lat`, `lon`, `search`)
* `GET /api/donors/:id` — Get single donor details and donation history
* `PUT /api/donors/:id` — Update donor profile information
* `PATCH /api/donors/:id/availability` — Toggle donor active availability
* `GET /api/donors/:id/donations` — Retrieve donor's donation certificates
* `POST /api/donors/:id/donations` — Record new completed blood donation

### Blood Requests (`/api/requests`)
* `POST /api/requests` — Create new emergency/standard blood request (auto-generates `BR-2026-XXXX`)
* `GET /api/requests` — List blood requests with filters (`status`, `blood_group`, `priority`, `city`)
* `GET /api/requests/:id` — Get request details, matched donors, and status timeline
* `PATCH /api/requests/:id/status` — Advance request status through the 6 lifecycle stages
* `DELETE /api/requests/:id` — Cancel / delete request

### Donor Matching (`/api`)
* `GET /api/requests/:id/matches` — Get smart ranked compatible donors for a specific request
* `POST /api/requests/:id/match` — Re-compute smart donor matching
* `POST /api/matches/:id/contact` — Send in-app & SMS emergency alert to matched donor
* `PATCH /api/matches/:id/status` — Update match status (`Suggested`, `Contacted`, `Accepted`, `Confirmed`)

### Administration (`/api/admin`)
* `GET /api/admin/statistics` — KPI metrics, blood group distribution, and monthly trends
* `GET /api/admin/users` — List and search all registered platform users
* `DELETE /api/admin/users/:id` — Delete user account
* `PATCH /api/admin/donors/:id/verify` — Toggle verified medical status badge
* `GET /api/admin/reports` — Summary reports for audit and export

---

## 📂 Project Architecture

```
BloodConnect/
├── client/                     # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, DashboardLayout, ProgressTracker, DonorCard, etc.
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, HowItWorks, FindDonors, Login, Register
│   │   │   ├── donor/          # DonorDashboard, DonorProfile, DonationHistory, NearbyRequests
│   │   │   ├── patient/        # PatientDashboard, CreateBloodRequest, MyRequests, RequestDetails, MatchedDonors
│   │   │   ├── hospital/       # HospitalDashboard, HospitalRequests, HospitalMatches, HospitalProfile
│   │   │   └── admin/          # AdminDashboard, ManageUsers, ManageDonors, ManageRequests, ManageHospitals, Reports
│   │   ├── services/           # api.ts (REST client)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Application Routes
│   │   └── main.tsx            # React Entry Point
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # database.ts (Relational DB engine)
│   │   ├── controllers/        # auth, donor, request, match, admin, hospital, notification controllers
│   │   ├── middleware/         # authMiddleware, roleMiddleware
│   │   ├── routes/             # REST route endpoints
│   │   ├── services/           # matchingService.ts (Haversine distance & compatibility algorithm), notificationService.ts
│   │   ├── db/                 # seedData.ts, seedRunner.ts
│   │   └── index.ts            # Server entry point
├── schema.sql                  # PostgreSQL standard relational schema
├── seeds.sql                   # PostgreSQL seed data script
├── .env.example                # Sample environment variables
├── package.json                # Root concurrent scripts
└── README.md                   # Full documentation
```

---

## 📄 License
This project is developed for College Full Stack Development Coursework. MIT License.
