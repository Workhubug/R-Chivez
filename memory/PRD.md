# Ziki Tunes Artist Admin Portal - PRD

## Original Problem Statement
Build a high-end, dark-themed web app UI for Ziki Tunes Artist Admin Portal - an Afro-centric music ecosystem for African artists to archive, distribute, and license their music. Features include hero landing page, dashboard with metrics, file archive system, distribution to DSPs, licensing configuration, analytics charts, and wallet management.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Icons**: Phosphor Icons
- **Charts**: Recharts

## User Personas
1. **African Music Artists** - Primary users who want to manage their music catalog
2. **Music Producers** - Users creating and licensing beats/instrumentals
3. **Record Labels** - Managing multiple artist catalogs

## Core Requirements
- [x] Dark theme with gold/orange accents (#FF6B00, #D4AF37)
- [x] Hero landing page with CTAs
- [x] JWT authentication (register/login)
- [x] Dashboard with metrics cards
- [x] Archive file manager with drag & drop
- [x] File detail panel with glassmorphism effect
- [x] Distribution to DSPs (Spotify, Apple Music, Boomplay)
- [x] Licensing configuration (Sync, NFT, Commercial)
- [x] Analytics with charts (streams, revenue, geography)
- [x] Wallet with balance and withdrawal options

## What's Been Implemented (March 27, 2026)

### Backend API (/app/backend/server.py)
- User authentication (register, login, me)
- File CRUD operations
- Wallet balance and transactions
- Analytics endpoint with mock data
- Demo data seeding

### Frontend Pages
- LandingPage.jsx - Hero section with CTAs, features, stats
- AuthPage.jsx - Register/Login with validation
- Dashboard.jsx - Main layout with sidebar navigation

### Dashboard Components
- DashboardHome.jsx - Welcome, metrics, recent files
- ArchiveSection.jsx - File grid/list, upload dialog
- DistributionSection.jsx - DSP selection, platform cards
- LicensingSection.jsx - License types, pricing slider
- AnalyticsSection.jsx - Line/area/bar charts
- WalletSection.jsx - Balance card, withdraw dialog
- FileDetailPanel.jsx - Glassmorphism panel with toggles

## Mocked Features
- File upload (metadata only, no actual file storage)
- Analytics data (random mock data generation)
- Wallet withdrawals (mock processing)

## Remaining Backlog

### P0 (Critical)
- None - MVP complete

### P1 (High Priority)
- Real file storage integration (Object Storage)
- Payment gateway integration (Stripe/PayPal)
- Email notifications

### P2 (Medium Priority)
- Artist collaboration features
- Playlist management
- Social sharing

### P3 (Low Priority)
- Mobile responsive improvements
- Dark/Light theme toggle
- Multi-language support

## Next Tasks
1. Integrate real file storage for music uploads
2. Add Stripe for payment processing
3. Implement email notifications for transactions
4. Add mobile responsive sidebar
