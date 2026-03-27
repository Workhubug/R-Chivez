# R-CHIVEZ Artist Admin Portal - PRD

## Original Problem Statement
Build R-CHIVEZ - a high-end, dark-themed web app UI for African artists to archive, distribute, and license their music. Based on the Archive Functional Spec, includes comprehensive forms for metadata, rights ownership, and licensing.

## Brand Identity
- **Name**: R-CHIVEZ (stylized archives)
- **Colors**: Deep purple (#251E49), Cyan (#00BFFF), Purple (#8B5CF6)
- **Logo**: Vinyl record with soundwave motif

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI + Framer Motion
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Icons**: Phosphor Icons
- **Charts**: Recharts

## Core Modules (from Archive Functional Spec)
1. **Master Archive & Asset Vault** - Secure storage for WAV, FLAC, stems, cover art
2. **Metadata Standardization Engine** - ISRC, UPC, contributor roles, Afro-centric genre taxonomy
3. **Rights Ownership Registry** - Copyright owner, territories, rights types
4. **Licensing & Commercialization Engine** - Sync, NFT, Commercial licensing
5. **Distribution Partner Sync Layer** - Spotify, Apple Music, Boomplay integration
6. **Royalty Entitlement & Wallet** - Revenue distribution and withdrawals

## What's Been Implemented (March 27, 2026)

### Landing Page
- R-CHIVEZ branding with vinyl record logo
- Hero section with "Archive Your Music. Own Your Rights. Monetize Forever."
- Feature cards for all 8 core modules
- Stats section (50K+ artists, 2M+ tracks, $10M+ distributed)

### Archive Upload Form (Enhanced per Functional Spec)
- **Basic Info Tab**: Title, Asset Type (Master Audio/Stems/Video/Image), Duration, Afro-centric Genre Taxonomy (25 genres), Related Assets checkboxes (Stems, Instrumental, Acapella)
- **Metadata Tab**: ISRC Code, UPC/EAN, Primary Artist, Featured Artists, Producers, Writers, Release Date, Label
- **Rights Tab**: Copyright Owner, Rights Type (Master/Publishing/Both), Territory Rights (Global, Africa, specific countries)

### Dashboard
- Metrics cards with new cyan/purple theme
- Recent files with status badges
- Earnings tracking with purple accent

### Other Sections
- Distribution Partner Sync
- Licensing Configuration
- Analytics Charts
- Wallet with withdrawals

## Mocked Features
- File upload (metadata only, no actual file storage)
- Analytics data (random mock data)
- Wallet withdrawals (mock processing)

## Remaining Backlog

### P0 (Critical)
- None - MVP complete with enhanced forms

### P1 (High Priority)
- Real file storage (Object Storage for WAV/FLAC)
- Rights Conflict Detection Engine
- Contract & Documentation Vault

### P2 (Medium Priority)
- Bulk metadata ingestion
- Multi-owner governance workflows
- Recoupment tracking

### P3 (Low Priority)
- Chain-of-custody audit trails
- Revenue split configuration UI
- Mobile responsive improvements

## Next Tasks
1. Integrate Object Storage for actual master file uploads
2. Implement Rights Conflict Detection (ISRC collision, ownership overlap)
3. Add Contract Vault for legal documents
4. Build Royalty Split Configuration form
